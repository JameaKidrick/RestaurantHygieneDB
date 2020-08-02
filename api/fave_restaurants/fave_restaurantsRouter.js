const favesDB = require('./fave_restaurantsModel');
const express = require('express')

const router = express.Router()

/************************ USER MUST BE LOGGED IN TO ACCESS ALL ROUTES ************************/

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
  // CHECK FOR NONEXISTENT ID
router.get('/:jxn_id', (req, res) => {
  favesDB.findByID(req.params.jxn_id)
    .then(favorite => {
      res.status(200).json(favorite)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET ALL JUNCTIONS BY USER_ID
  // CHECK FOR NONEXISTENT USER ID
  // CURRENT LOGGED IN USER MUST MATCH USER SEARCHED
router.get('/user/:user_id', (req, res) => {
  favesDB.findByUserID(req.params.user_id)
    .then(favorites => {
      res.status(200).json(favorites)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// ADD NEW JUNCTION
  // CURRENT LOGGED IN USER MUST MATCH USER SEARCHED
  // IF RESTAURANT IS NOT WITHIN DATABASE, ADD TO DATABASE FIRST
router.post('/', (req, res) => {
  favesDB.addFavorite(req.body)
    .then(newFave => {
      res.status(201).json({ message: 'New favorite restaurant was successfully added!', newFave })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// DELETE JUNCTION
  // CHECK FOR NONEXISTENT ID
router.delete('/:jxn_id', (req, res) => {
  favesDB.removeFavorite(req.params.jxn_id)
    .then(deletedFave => {
      res.status(201).json({ message: 'Favorite restaurant was successfully deleted!', deletedFave })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

module.exports = router