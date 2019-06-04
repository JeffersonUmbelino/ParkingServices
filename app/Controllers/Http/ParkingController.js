'use strict'

const Helpers = use('Helpers')
const Parking = use('App/Models/Parking')
const Geo = require('geo-nearby');

const Database = use('Database')

class ParkingController {

  //listas or registros
  async index({ request }) {

    const { latitude, longitude, distance } = request.all()
    //const distance = 1000;
    const parkings = await Parking
      .query()
      .with('images')
      .fetch()

    if (latitude && longitude) {
      const dataset = new Geo(parkings.rows, { setOptions: { id: 'id', lat: 'latitude', lon: 'longitude' } });
      const nears = dataset.nearBy(latitude, longitude, distance);
      const nearside = nears.map(g => g.i);
      parkings.rows = parkings.rows.filter((r) => nearside.includes(r.id));
    }

    // descobrir a quantidade de vagas
    const anAsyncFunction = async r => {
      let occupation = await Database
        .table('parkings')
        .innerJoin('positions', 'parkings.id', 'positions.parking_id')
        .where({ "positions.occupation": "true", "parkings.id": r.id })
        .count();
      return { "title": r.title,"vacancies": r.total_vacancies - occupation[0]["count(*)"]
                ,"id": r.id , "polygon" : r.polygon  , "total_vacancies": r.total_vacancies
                , "latitude" : r.latitude , "longitude" : r.longitude
              } // adicionar os atributos que precisamos
    }

    const getData = async () => {
      return await Promise.all(parkings.rows.map(item => anAsyncFunction(item)))
    }
    const rows = await getData()
    return rows;

    // return parkings

  }

  //exibição de registros
  async show({ params }) {

    let occupation = await Database
      .table('parkings')
      .innerJoin('positions', 'parkings.id', 'positions.parking_id')
      .where({ "positions.occupation": "true", "parkings.id": params.id })
      .count();

    const parkings = await Parking.findOrFail(params.id)
    //await parkings.load('images')
    const r = parkings
    return { "title": r.title,"vacancies": r.total_vacancies - occupation[0]["count(*)"]
    ,"id": r.id , "polygon" : r.polygon  , "total_vacancies": r.total_vacancies
    , "latitude" : r.latitude , "longitude" : r.longitude
      } 
  }

  //Cria novos registros
  async store({ auth, request, response }) {

    const  { id }  = auth.user
    const data = request.only([

      'title',
      'address',
      'latitude',
      'longitude',
      'polygon',
      'price',
      'total_vacancies'

    ])

    const parking = await Parking.create({ ...data, user_id: id })

    return parking

  }


  //altera registros
  async update({ params, request, response }) {

    const parking = await Parking.findOrFail(params.id)

    const data = request.only([

      'title',
      'address',
      'latitude',
      'longitude',
      'polygon',
      'price',
      'total_vacancies'


    ])

    parking.merge(data)

    await parking.save()

    return parking

  }

  //Remove registros
  async destroy({ params, auth, response }) {
    const parkings = await Parking.findOrFail(params.id)

    if (parkings.user_id != auth.user.id) {
      return response.status(401).send({ error: 'Not authorized' })
    }

    await parkings.delete()

  }
}

module.exports = ParkingController
