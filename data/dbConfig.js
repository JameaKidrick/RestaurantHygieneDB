const knex = require('knex')
const config = require('../knexfile')
const cypress_config = require('../cypress.json')

const environment = process.env.CYPRESS_DATABASE_ENVIRONMENT || 'development'

console.log('ENVIRONMENT IN DBCONFIG FILE', environment, process.env.CYPRESS_DATABASE_ENVIRONMENT, config[environment].connection.database, cypress_config)

module.exports = knex(config[environment]);