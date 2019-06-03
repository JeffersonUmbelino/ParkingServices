'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PositionSchema extends Schema {
  up () {
    this.create('positions', (table) => {
      table.increments()

      table
          .integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      
      table
          .integer('parking_id')
          .unsigned()
          .references('id')
          .inTable('parkings')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      
      table.boolean('occupation')
      table.decimal('latitude', 9, 6).notNullabe
      table.decimal('longitude', 9, 6).notNullabe
      table.timestamps()
    })
  }

  down () {
    this.drop('positions')
  }
}

module.exports = PositionSchema
