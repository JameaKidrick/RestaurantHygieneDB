const db = require('../../../data/dbConfig')
const server = require('../../server');
const request = require('supertest')

describe('Setting up token for authorization', function () {
  let token = ''

  describe('GET favorite restaurant(s) and info at /favorites', function () {
    beforeAll(async () => {
      await db.raw("TRUNCATE TABLE fave_restaurants RESTART IDENTITY CASCADE");

      await db.seed.run();

      return request(server)
        .post("/api/auth/register")
        .send({
          username: "username1",
          first_name: "first name 1",
          last_name: "last name 1",
          password: "password1",
        })
        .then((response) => {
          token = response.body.token;
        });
    });

    test('Should receive 400: token missing', function () {
      return request(server)
        .get('/api/favorites')
        .then(response => {
          expect(response.status).toEqual(400)
          expect(response.body.error).toBe('Please provide credentials')
        })
    })

    test('Should receive 200: retrieve all favorite restaurants in the database', function () {
      return request(server)
        .get('/api/favorites')
        .set("Authorization", token)
        .then(response => {
          expect(response.status).toEqual(200)
          expect(response.type).toMatch(/json/i);
          expect(response.body).toHaveLength(4)
          expect(response.body[2].restaurant_id).toBe(2)
        })
    })

    test('Should receive 404: favorite restaurant id does not exist in the database', function () {
      const id = 123

      return request(server)
        .get(`/api/favorites/${id}`)
        .set("Authorization", token)
        .then(response => {
          expect(response.status).toEqual(404)
          expect(response.body.error).toBe(`There is no favorite restaurant in the database with the id ${id}`)
        })
    })

    test('Should receive 200: retrieve specific favorite restaurant from database', function () {
      const id = 1

      return request(server)
        .get(`/api/favorites/${id}`)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(200)
          expect(response.type).toMatch(/json/i)
          expect(response.body.user_id).toBe(2)
        })
    })
    
    test('Should receive 404: user id does not exist in the database', function () {
      const user_id = 456

      return request(server)
        .get(`/api/favorites/user/${user_id}`)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(404)
          expect(response.body.error).toBe(`A user with the id ${user_id} does not exist in the database.`)
        })
    })

    test('Should receive 200: retrieve list of favorite restaurants', function () {
      const user_id = 2

      return request(server)
        .get(`/api/favorites/user/${user_id}`)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(200)
          expect(response.type).toMatch(/json/i)
          expect(response.body).toHaveLength(2)
        })
    })
  })

  describe('POST favorite restaurant at /favorites', function (){
    test('Should receive 400: missing place id', function () {
      const new_favorite = {
        restaurant_address: '123 Road Street, City, State',
        restaurant_name: 'New Restaurant',
      }

      return request(server)
        .post('/api/favorites')
        .send(new_favorite)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(400)
          expect(response.body.error).toBe(`Please include the place_id`)
        })
    })

    test('Should receive 400: missing restaurant name', function () {
      const new_favorite = {
        restaurant_address: '123 Road Street, City, State',
        place_id: 'MSOmm09UUmvkATESTMcxtMLreY5Wq'
      }

      return request(server)
        .post('/api/favorites')
        .send(new_favorite)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(400)
          expect(response.body.error).toBe(`Please include the restaurant name`)
        })
    })

    test('Should receive 201: create favorite restaurant without restaurant address', function () {
      const new_favorite = {
        restaurant_name: 'New Restaurant',
        place_id: 'MSOmm09UUmvkATESTMcxtMLreY5Wq'
      }

      return request(server)
        .post('/api/favorites')
        .send(new_favorite)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(201)
          expect(response.type).toMatch(/json/i)
          expect(response.body.message).toBe('New favorite restaurant was successfully added!')
        })
    })

    test('Should receive 201: create favorite restaurant for new restaurant', function () {
      const new_favorite = {
        restaurant_address: '123 Road Street, City, State',
        restaurant_name: 'New Restaurant 2',
        place_id: 'C5gLeEIYhXrhVTESTwUgFUmKjQvUS'
      }

      return request(server)
        .post('/api/favorites')
        .send(new_favorite)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(201)
          expect(response.type).toMatch(/json/i)
          expect(response.body.message).toBe('New favorite restaurant was successfully added!')
        })
    })

    test('Should receive 201: create favorite restaurant for existing restaurant with restaurant address', function () {
      const new_favorite = {
        restaurant_address: '123 Road Street, City, State',
        restaurant_name: 'New Restaurant',
        place_id: 'MSOmm09UUmvkATESTMcxtMLreY5Wq'
      }

      return request(server)
        .post('/api/favorites')
        .send(new_favorite)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(201)
          expect(response.type).toMatch(/json/i)
          expect(response.body.message).toBe('New favorite restaurant was successfully added!')
        })
    })
  })

  describe('DELETE favorite restaurant at /favorites/favorite_id', function () {
    test('Should receive 401: unauthorized to delete favorite restaurant', function () {
      const id = 3

      return request(server)
        .delete(`/api/favorites/${id}`)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(401)
          expect(response.body.error).toBe('You are not authorized to delete this favorite restaurant')
        })
    })

    test('Should receive 201: delete favorite restaurant from database', function () {
      const id = 7

      return request(server)
        .delete(`/api/favorites/${id}`)
        .set('Authorization', token)
        .then(response => {
          expect(response.status).toEqual(201)
          expect(response.type).toMatch(/json/i)
          expect(response.body.message).toBe('Favorite restaurant was successfully deleted!')
        })
    })
  })
})