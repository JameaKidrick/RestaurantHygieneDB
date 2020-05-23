// Update with your config settings.
require('dotenv').config()

module.exports = {

  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      database: process.env.DEV_DB_DATABASE,
      user:     process.env.DEV_DB_USERNAME,
      password: process.env.DEV_DB_PASSWORD
    },
    migrations: {
      tableName: './data/migrations'
    },
    seeds: {
      tableName: './data/seeds'
    }
  },

  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: './data/migrations'
    },
    seeds: {
      tableName: './data/seeds'
    }
  }

};
