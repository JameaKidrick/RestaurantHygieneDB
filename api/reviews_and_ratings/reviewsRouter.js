const express = require('express')
const reviewsDB = require('./reviewsModel')
const restaurantsDB = require('../restaurants/restaurantsModel');

const router = express.Router()

/******************************* Middleware *******************************/
const verifyToken = require('../authorization/authMiddleware');
const validateUserID = require('../middleware/validateUserID');

const validateRestaurantID = (req, res, next) => {
  const id = req.params.restaurant_id

  restaurantsDB.findByRestaurantId(id)
    .then(restaurant => {
      if(!restaurant[0]){
        res.status(404).json({ error: `There is no restaurant in the database with the id ${id}` })
      }else{
        next()
      }
    })
}

const validateReviewID = (req, res, next) => {
  const id = req.params.review_id

  reviewsDB.findById(id)
    .then(review => {
      if(!review){
        res.status(404).json({ error: `There is no review in the database with the id ${id}` })
      }else{
        req.user_id = review.user_id
        next()
      }
    })
}

const validateCreator = (req, res, next) => {
  if(req.decodeJwt.id !== req.user_id){
    res.status(401).json({ error: 'You are not authorized to alter this review' })
  }else{
    next()
  }
}

/******************************* Route Handlers *******************************/
// GET ALL REVIEWS
router.get('/', [verifyToken], (req, res) => {
  reviewsDB.find()
    .then(reviews => {
      res.status(200).json(reviews)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET LIST OF REVIEWS BY RESTAURANT'S ID
router.get('/restaurant/:restaurant_id', [verifyToken, validateRestaurantID], (req, res) => {
  reviewsDB.findByRestaurantId(req.params.restaurant_id)
    .then(reviews => {
      if(!reviews[0]){
        res.status(200).json({ message: 'There are no reviews for this restaurant.' })
      }else{
        res.status(200).json(reviews)
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC REVIEW BY REVIEW'S ID
router.get('/:review_id', [verifyToken, validateReviewID], (req, res) => {
  reviewsDB.findById(req.params.review_id)
    .then(review => {
      res.status(200).json(review)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC REVIEW BY USER'S AND REVIEW'S ID
router.get('/:review_id/user/:user_id', [verifyToken, validateReviewID, validateUserID], (req, res) => {
  reviewsDB.findUserReview(req.params.user_id, req.params.review_id)
    .then(review => {
      res.status(200).json(review)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET LIST OF REVIEWS BY USER'S ID
router.get('/user/:user_id', [verifyToken, validateUserID], (req, res) => {
  reviewsDB.findAllUserReviews(req.params.user_id)
    .then(reviews => {
      res.status(200).json(reviews)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET RATINGS BY RESTAURANT'S ID
router.get('/ratings/restaurant/:restaurant_id', [validateRestaurantID], (req, res) => {
  reviewsDB.averageRating(req.params.restaurant_id)
    .then(rating => {
      res.status(200).json(rating)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// POST NEW REVIEW
router.post('/restaurant/:place_id', [verifyToken], (req, res) => {
  const place_id = req.params.place_id

  if(!req.body.review){
    res.status(400).json({ error: 'Please add a review' })
  }else if(!req.body.rating){
    res.status(400).json({ error: 'Please add a rating' })
  }

  restaurantsDB.findByPlaceId(place_id)
    .then(restaurant => {
      if(restaurant.length === 0){
        return restaurantsDB.addRestaurant(place_id)
          .then(newRestaurant => {
            return newRestaurant
          })
      }else{
        return restaurant
      }
    })
    .then(restaurantFound => {
      reviewsDB.addReview(req.decodeJwt.id, restaurantFound[0].restaurant_id, req.body.rating, req.body.review)
        .then(review => {
          res.status(201).json({ message: 'Review successfully posted!', review })
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal server error', error })
        })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// UPDATE REVIEW
router.put('/:review_id', [verifyToken, validateReviewID, validateCreator], (req, res) => {

  if("id" in req.body || "user_id" in req.body || "restaurant_id" in req.body){
    return res.status(401).json({ error: 'You are not authorized to alter the id' })
  }

  reviewsDB.updateReview(req.params.review_id, req.body)
    .then(updatedReview => {
      res.status(201).json({ message: 'Review successfully updated!', updatedReview })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// DELETE REVIEW
router.delete('/:review_id', [verifyToken, validateReviewID, validateCreator], (req, res) => {
  reviewsDB.removeReview(req.params.review_id)
    .then(deletedReview => {
      res.status(201).json({ message: 'Review successfully deleted!', deletedReview })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

module.exports = router