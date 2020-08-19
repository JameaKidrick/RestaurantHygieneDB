const db = require('../../../data/dbConfig')
const server = require('../../server');
const supertest = require('supertest');
const request = require('supertest')

describe('Setting up token for authorization', function () {
  let token = ''

  describe('GET favorite restaurant(s) and info at /favorites', function () {
    // beforeAll(async () => {
    //   await db.raw("TRUNCATE TABLE reviews RESTART IDENTITY CASCADE");
    //   await db.raw("TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE");

    //   await db.seed.run();

    //   return request(server)
    //     .post("/api/auth/register")
    //     .send({
    //       username: "username4",
    //       first_name: "first name 4",
    //       last_name: "last name 4",
    //       password: "password4",
    //     })
    //     .then((response) => {
    //       token = response.body.token;
    //     });
    // });

    test.todo('Should receive 400: token missing')
    test.todo('Should receive 200: retrieve all favorite restaurants in the database')

    test.todo('Should receive 404: favorite restaurant id does not exist in the database')
    test.todo('Should receive 200: retrieve specific favorite restaurant from database')
    
    test.todo('Should receive 404: user id does not exist in the database')
    test.todo('Should receive 200: retrieve list of favorite restaurants')
  })

  describe('POST favorite restaurant at /favorites', function (){
    test.todo('Should receive 400: missing place id')
    test.todo('Should receive 400: missing restaurant name')
    test.todo('Should receive 201: create favorite restaurant without restaurant address')
    test.todo('Should receive 201: create favorite restaurant for new restaurant')
    test.todo('Should receive 201: create favorite restaurant for existing restaurant with restaurant address')
  })

  describe('DELETE favorite restaurant at /favorites/favorite_id', function () {
    test.todo('Should receive 401: unauthorized to delete favorite restaurant')
    test.todo('Should receive 201: delete favorite restaurant from database')
  })
})