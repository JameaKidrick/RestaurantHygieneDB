const db = require('../../data/dbConfig');

module.exports = {
  find,
  findByRestaurantId,
  findByPlaceId,
  averageRatingByPlace_Id,
  addRestaurant,
  updateRestaurant,
  removeRestaurant
}

// GET ALL RESTAURANTS
function find () {
  return db('restaurants')
}

// GET SPECIFIC RESTAURANT BY RESTAURANT_ID
function findByRestaurantId(id) {
  return db('restaurants')
    .where({ restaurant_id:id })
}

// GET SPECIFIC RESTAURANT BY PLACE_ID
function findByPlaceId(id) {
  return db('restaurants')
    .where({ place_id:id })
}

// GET RATINGS BY RESTAURANT'S PLACE_ID
function averageRatingByPlace_Id(place_id) {
  return db('restaurants')
  .select('rating')
  .join('reviews', 'reviews.restaurant_id', '=', 'restaurants.restaurant_id')
  .where({ 'restaurants.place_id':place_id })
  .then(ratings => {
    let sum = ratings.reduce((acc, curr) => {
      return acc + curr.rating}, 0
    )
    return Math.floor(sum/ratings.length * 10) / 10
  })
}

// ADD NEW RESTAURANT
function addRestaurant(place_id) {
  return db('restaurants')
    .insert({ place_id }, 'restaurant_id')
    .then(ids => {
      return findByRestaurantId(ids[0])
    })
}

// UPDATE RESTAURANT
function updateRestaurant(restaurant_id, changes) {
  return db('restaurants')
    .update(changes)
    .where({ restaurant_id })
    .then(restaurant => {
      return findByRestaurantId(restaurant_id)
    })
}

// DELETE RESTAURANT
function removeRestaurant(restaurant_id) {
  return findByRestaurantId(restaurant_id)
    .then(restaurant => {
      return db('restaurants')
        .delete()
        .where({ restaurant_id })
        .then(deleted => {
          return restaurant
        })
    })
}