const express = require('express')
const favesDB = require('./fave_restaurantsModel');
const restaurantsDB = require('../restaurants/restaurantsModel');

const router = express.Router()

/******************************* Middleware *******************************/
const validateUserID = require('../middleware/validateUserID');
const validateFaveID = (req, res, next) => {
  const id = req.params.favorite_id;

  favesDB.findByID(id).then((favorite) => {
    if (!favorite) {
      res.status(404).json({
        error: `There is no favorite restaurant in the database with the id ${id}`,
      });
    } else {
      req.user_id = favorite.user_id;
      next();
    }
  });
};

const validateCreator = (req, res, next) => {
  if (req.decodeJwt.id !== req.user_id) {
    res
      .status(401)
      .json({ error: "You are not authorized to delete this favorite restaurant" });
  } else {
    next();
  }
};

/******************************* Route Handlers *******************************/
// GET ALL JUNCTIONS
router.get('/', (req, res) => {
  favesDB.findAll()
    .then(favorites => {
      res.status(200).json(favorites)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC JUNCTION BY ID
router.get('/:favorite_id', [validateFaveID], (req, res) => {
  favesDB.findByID(req.params.favorite_id)
    .then(favorite => {
      res.status(200).json(favorite)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET ALL JUNCTIONS BY USER_ID
router.get('/user/:userid', [validateUserID], (req, res) => {
  favesDB.findByUserID(req.params.userid)
    .then(favorites => {
      res.status(200).json(favorites)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// ADD NEW JUNCTION
router.post('/', (req, res) => {
  let restaurant_address = null

  if(req.body.restaurant_address){
    restaurant_address = req.body.restaurant_address
  }

  if(!req.body.place_id){
    return res.status(400).json({ error: `Please include the place_id` })
  }else if(!req.body.restaurant_name){
    return res.status(400).json({ error: `Please include the restaurant name` })
  }

  restaurantsDB
    .findByPlaceId(req.body.place_id)
    .then((restaurant) => {
      if(!restaurant){
        return restaurantsDB.addRestaurant(req.body.place_id, req.body.restaurant_name, restaurant_address).then(newRestaurant => {
          return newRestaurant
        })
      }else{
        return restaurant
      }
    })
    .then(restaurantFound => {
      favesDB.addFavorite({user_id: req.decodeJwt.id, restaurant_id: restaurantFound.restaurant_id})
        .then(newFave => {
          res.status(201).json({ message: 'New favorite restaurant was successfully added!', newFave })
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal server error', error })
        })
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error", error });
    });
})

// DELETE JUNCTION
router.delete('/:favorite_id', [validateFaveID, validateCreator], (req, res) => {
  favesDB.removeFavorite(req.params.favorite_id)
    .then(deletedFave => {
      res.status(201).json({ message: 'Favorite restaurant was successfully deleted!', deletedFave })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

module.exports = router