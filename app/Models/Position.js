'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Position extends Model {

    //uma posição pertence a um estacionamento
    parkings(){
        this.belongsTo('App/Models/Parking')
    }

    //em uma posição estaciona apenas um usuario.(pertence)
    user(){
        this.belongsTo('App/Models/User')
    }
    
}

module.exports = Position
