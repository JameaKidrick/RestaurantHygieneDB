const db = require('../../data/dbConfig')

module.exports = {
  findAll,
  findByID,
  findByUserID,
  addFavorite,
  removeFavorite
}

// GET ALL JUNCTIONS
function findAll() {
  return db('fave_restaurants')
    .join('restaurants', 'restaurants.restaurant_id', '=', 'fave_restaurants.restaurant_id')
}

// GET SPECIFIC JUNCTION BY ID
function findByID(id) {
  return db('fave_restaurants')
    .join('restaurants', 'restaurants.restaurant_id', '=', 'fave_restaurants.restaurant_id')
    .where({ id })
    .first()
}

// GET ALL JUNCTIONS BY USER_ID
function findByUserID(user_id) {
  return db('fave_restaurants')
    .join('restaurants', 'restaurants.restaurant_id', '=', 'fave_restaurants.restaurant_id')
    .where({ user_id })
}

// ADD NEW JUNCTION
function addFavorite(info) {
  console.log(info)
  return db('fave_restaurants')
    .insert(info, 'id')
    .then(ids => {
      return findByID(ids[0])
    })
}

// DELETE JUNCTION
function removeFavorite(id) {
  return findByID(id)
    .then(favorite => {
      return db('fave_restaurants')
        .delete()
        .where({ id })
        .then(deleted => {
          return favorite
        })
    })
}