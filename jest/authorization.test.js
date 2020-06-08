const request = require('supertest');
const server = require('../api/server');
const db = require('../data/dbConfig');
const knex = require('knex');

describe('Register', function () {
  beforeEach(() => {
    return db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  });

  test('Checks if server is running', function () {
    const new_user = {
      "username": "username2",
      "first_name": "first name",
      "last_name": "last name",
      "password": "password"
    }
    return request(server)
      .post('/api/auth/register')
      .send(new_user)
      .then(response => {
            expect(response.status).toEqual(201)
        
      })
  })
})