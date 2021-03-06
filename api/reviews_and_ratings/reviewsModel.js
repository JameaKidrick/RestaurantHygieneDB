// ✅ ALL TESTS PASSED (./tests/reviewsModel.test) ✅

const db = require('../../data/dbConfig');

module.exports = {
  find,
  findByRestaurantId,
  findById,
  findUserReview,
  findAllUserReviews,
  averageRating,
  addReview,
  updateReview,
  removeReview
}

// GET ALL REVIEWS
function find () {
  return db('reviews')
}

// GET LIST OF REVIEWS BY RESTAURANT'S ID
function findByRestaurantId(id) {
  return db('reviews')
    .select('reviews.id', 'reviews.user_id', 'reviews.restaurant_id', 'reviews.rating', 'reviews.review', 'reviews.created_at', 'users.username')
    .join('users', 'users.user_id', '=', 'reviews.user_id')
    .where({ restaurant_id:id })
}

// GET SPECIFIC REVIEW BY REVIEW'S ID
function findById(id) {
  return db('reviews')
    .select('id', 'user_id', 'restaurant_id', 'rating', 'review')
    .where({ id })
    .first()
}

// GET SPECIFIC REVIEW BY USER'S AND REVIEW'S ID
function findUserReview(user_id, review_id) {
  return db('reviews')
    .where({ user_id })
    .andWhere({ id:review_id })
    .first()
}

// GET LIST OF REVIEWS BY USER'S ID
function findAllUserReviews(user_id) {
  return db('reviews')
    .select('reviews.id', 'reviews.user_id', 'reviews.restaurant_id', 'reviews.rating', 'reviews.review', 'reviews.created_at', 'restaurants.place_id', 'restaurants.restaurant_name', 'restaurants.restaurant_address')
    .join('restaurants', 'restaurants.restaurant_id', '=', 'reviews.restaurant_id')
    .where({ user_id })
}

// GET RATINGS BY RESTAURANT'S ID
function averageRating(restaurant_id) {
  return db('reviews')
    .select('rating')
    .join('restaurants', 'restaurants.restaurant_id', '=', 'reviews.restaurant_id')
    .where({ 'reviews.restaurant_id':restaurant_id })
    .then(ratings => {
      let sum = ratings.reduce((acc, curr) => {
        return acc + curr.rating}, 0
      )
      return Math.floor(sum/ratings.length * 10) / 10
    })
}

// POST NEW REVIEW
function addReview(user_id, restaurant_id, rating, review) {
  return db('reviews')
    .insert({ user_id, restaurant_id, rating, review }, 'id')
    .then(ids => {
      return findById(ids[0])
    })
}

// UPDATE REVIEW
function updateReview(id, changes){
  return db('reviews')
    .update(changes)
    .where({ id })
    .then(update => {
      return findById(id)
        .then(review => {
          return review
        })
    })
}

// DELETE REVIEW
function removeReview(id){
  return findById(id)
    .then(review => {
      return db('reviews')
        .delete()
        .where({ id })
        .then(deleted => {
          return review
        })
    })
}