const db = require('../../../data/dbConfig');
const server = require('../../server');
const request = require('supertest');

describe('GET restaurant(s) and info at /restaurants', function () {
  beforeAll(async () => {
    await db.raw("TRUNCATE TABLE restaurants RESTART IDENTITY CASCADE");

    return db.seed.run();
  });

  test('Should receive 200: retrieve all restaurants in the database', function () {
    return request(server)
      .get('/api/restaurants')
      .then(response => {
        expect(response.status).toEqual(200)
        expect(response.type).toMatch(/json/i);
        expect(response.body).toHaveLength(3);
      })
  })

  test('Should receive 404: restaurant not found', function () {
    const id = 404

    return request(server)
      .get(`/api/restaurants/${id}`)
      .then(response => {
        expect(response.status).toEqual(404)
        expect(response.type).toMatch(/json/i);
        expect(response.body.error).toBe(`There is no restaurant in the database with the id ${id}`)
      })
  })

  test('Should receive 200: retrieve specified restaurant by restaurant id', function () {
    const id = 2

    return request(server)
      .get(`/api/restaurants/${id}`)
      .then(response => {
        expect(response.status).toEqual(200)
        expect(response.type).toMatch(/json/i);
        expect(response.body.place_id).toBe('ChIJVZ6MsNkDyokRs884W2r6gE8')
      })
  })

  test('Should receive 200: retrieve specified restaurant by place id', function () {
    const place_id = 'ChIJjWYOtykDyokR-kS0ikxSI84'

    return request(server)
      .get(`/api/restaurants/place/${place_id}`)
      .then(response => {
        expect(response.status).toEqual(200)
        expect(response.type).toMatch(/json/i);
        expect(response.body.restaurant_id).toEqual(1)
      })
  })

  test('Should receive 200: retrieve specified restaurant\'s hygiene rating by place id', function () {
    const place_id = 'ChIJGfoMiu77yYkR27U2LdS3y8c'

    return request(server)
      .get(`/api/restaurants/ratings/place/${place_id}`)
      .then(response => {
        expect(response.status).toEqual(200)
        expect(response.body).toBe(0)
      })
  })
})

describe('POST new restaurant at /restaurants', function () {
  test('Should receive 400: place_id not included', function () {
    const place = {
      place_id: ''
    }

    return request(server)
      .post(`/api/restaurants`)
      .send(place)
      .then(response => {
        expect(response.status).toEqual(400)
        expect(response.body.error).toBe('Please include the place_id.')
      })
  })

  test('Should receive 201: add a new restaurant to the database', function () {
    const place = {
      place_id: 'UOFstAXGBKm4IDuoASCP8iFj'
    }

    return request(server)
      .post(`/api/restaurants`)
      .send(place)
      .then(response => {
        expect(response.status).toEqual(201)
        expect(response.body.message).toBe('Restaurant successfully created!')
        expect(response.body.newRestaurant.restaurant_id).toBe(4)
      })
  })
})

describe('PUT specific restaurant at /restaurants/restaurant_id', function () {
  test('Should receive 201: update the specified restaurant in the database', function () {
    const id = 3
    const place = {
      place_id: 'PlAcEiDcHaNgEd'
    }

    return request(server)
      .put(`/api/restaurants/${id}`)
      .send(place)
      .then(response => {
        expect(response.status).toEqual(201)
        expect(response.body.message).toBe('Restaurant successfully updated!')
        expect(response.body.updatedRestaurant.restaurant_id).toBe(3)
      })
  })
})

describe('DELETE specific restaurant at /restaurants/restaurant_id', function () {
  test('Should receive 201: delete the specified restaurant from the database', function () {
    const id = 4

    return request(server)
      .delete(`/api/restaurants/${id}`)
      .then(response => {
        expect(response.status).toEqual(201)
        expect(response.body.message).toBe('Restaurant successfully deleted!')
        expect(response.body.deletedRestaurant.restaurant_id).toBe(4)
      })
  })
})