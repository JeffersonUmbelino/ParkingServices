'use strict'

const Helpers = use('Helpers')
const Parking = use('App/Models/Parking')
const Geo = require('geo-nearby');

class ParkingController {

  //listas or registros
  async index ({request}) {

  

    const {latitude, longitude} = request.all()
    const dist = 5000;
    const parkings = await Parking
      .query()
      .with('images')
      .fetch()

    const dataset = new Geo(parkings.rows, {setOptions: {id: 'id', lat: 'latitude', lon: 'longitude'}});
    const nears = dataset.nearBy(latitude, longitude, dist);
    const nearside = nears.map(g => g.i);
    parkings.rows = parkings.rows.filter( (r) => nearside.includes(r.id) );
    return parkings;

  }

 //exibição de registros
  async show ({params}) {

      const parkings = await Parking.findOrFail(params.id)

      await parkings.load('images')

      return parkings

  }

  //Cria novos registros
  async store ({ auth, request, response }) {

      const {id} = auth.user
      const data = request.only([

          'title',
          'address',
          'latitude',
          'longitude',
          'price',
          'total_vacancies'

        ])

      const parking = await Parking.create({...data, user_id: id })

      return parking

  }


  //altera registros
  async update ({ params, request, response }) {

    const parking = await Parking.findOrFail(params.id)

    const data = request.only([

          'title',
          'address',
          'latitude',
          'longitude',
          'price',
          'total_vacancies'


      ])

    parking.merge(data)

    await parking.save()

    return parking

  }

 //Remove registros
  async destroy ({ params, auth, response }) {
    const parkings = await Parking.findOrFail(params.id)

    if(parkings.user_id != auth.user.id){
      return response.status(401).send({error: 'Not authorized'})
    }

      await parkings.delete()

  }
}

module.exports = ParkingController
