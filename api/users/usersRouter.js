const express = require('express');

const router = express.Router();

const usersDB = require('./usersModel');

/******************************* Middleware *******************************/
const validateUserID = require('../middleware/validateUserID');



/******************************* Route Handlers *******************************/
// GET ALL USERS IN DATABASE
router.get('/', (req, res) => {
  usersDB.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC USER BY ID
router.get('/:userid', [validateUserID], (req, res) => {
  const user = req.user
  // usersDB.findById(req.params.userid)
  //   .then(user => {
  //     res.status(200).json(user)
  //   })
  //   .catch(error => {
  //     res.status(500).json({ error: 'Internal server error', error})
  //   })
  return res.status(200).json(user)
})

// UPDATE A USER'S INFORMATION BY USER ID
router.put('/:userid', [validateUserID], (req, res) => {
  const user = req.user;
  let changes = req.body;

  // ERROR HANDLING: Username already exists in the database
  usersDB.update(user.user_id, changes)
    .then(updatedUser => {
      res.status(201).json({ message: 'User information successfully updated.', 'user': updatedUser})
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// DELETE A USER BY USER ID
router.delete('/:userid', [validateUserID], (req, res) => {
  const user = req.user

  usersDB.remove(user.user_id)
    .then(deletedUser => {
      res.status(201).json({ message: 'User has been successfully deleted.', deletedUser})
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error})
    })
})

module.exports = router;