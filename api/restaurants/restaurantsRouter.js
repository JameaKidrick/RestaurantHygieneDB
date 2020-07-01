const express = require('express');
const restaurantsDB = require('./restaurantsModel');

const router = express.Router();

// ALL ROUTERS REQUIRE USER TO BE SIGNED IN

// GET ALL RESTAURANTS
router.get('/', (req, res) => {
  restaurantsDB.find()
    .then(restaurants => {
      res.status(200).json(restaurants)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC RESTAURANT BY RESTAURANT_ID
router.get('/:restaurant_id', (req, res) => {
  restaurantsDB.findByRestaurantId(req.params.restaurant_id)
    .then(restaurant => {
      res.status(200).json(restaurant)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC RESTAURANT BY PLACE_ID
router.get('/places/place_id', (req, res) => {
  restaurantsDB.findByPlaceId(req.params.place_id)
    .then(restaurant => {
      res.status(200).json(restaurant)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET RATINGS BY RESTAURANT'S PLACE_ID
router.get('/ratings/place/:place_id', (req, res) => {
  reviewsDB.averageRatingByPlace_Id(req.params.place_id)
    .then(rating => {
      res.status(200).json(rating)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// ADD NEW RESTAURANT
router.post('/', (req, res) => {
  restaurantsDB.addRestaurant(req.body.place_id)
    .then(newRestaurant => {
      res.status(201).json({ message: 'Restaurant successfully created!', newRestaurant })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// UPDATE RESTAURANT
router.put('/:restaurant_id', (req, res) => {
  restaurantsDB.updateRestaurant(req.params.restaurant_id, req.body)
    .then(updatedRestaurant => {
      res.status(201).json({ message: 'Restaurant successfully updated!', updatedRestaurant })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// DELETE RESTAURANT
router.delete('/:restaurant_id', (req, res) => {
  restaurantsDB.removeRestaurant(req.params.restaurant_id)
    .then(deletedRestaurant => {
      res.status(201).json({ message: 'Restaurant successfully deleted!', deletedRestaurant})
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

module.exports = router;