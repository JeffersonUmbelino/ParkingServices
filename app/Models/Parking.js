'use strict'

const Model = use('Model')
const Database = use('Database')

class Parking extends Model {


	//Escopo de restrição de consulta.
	static scopeNearBy (query, latitude, longitude, distance) {

		//Calculo haversine de distancia.
		const haversine = `(6371 * acos(cos(radians(${latitude}))
								 * cos(radians(latitude))
								 * cos(radians(longitude)
								 - radians(${longitude}))
								 + sin(radians(${latitude})) 
								 * sin(radians(latitude)))) `

		return query	

		.select('*', Database.raw(`${haversine} as distance`))
		//Compara os valores obitidos por nós.
		.whereRaw(`${haversine} < ${distance}`)	
	}



	user(){
		return this.belongsTo('App/Models/User')
	}
	
	images(){
		return this.hasMany('App/Models/Image')
	}
}

module.exports = Parking
