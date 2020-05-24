const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersDB = require('../users/usersModel');

const router = express.Router();

function getJwtToken(id, username){
  const payload = {
    id,
    username
  }

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn:'1d'
  }

  return jwt.sign({payload}, secret, options)
}

/******************************* Middleware *******************************/
const validateBody = require('../middleware/validateBody');



/******************************* Route Handlers *******************************/

router.post('/register', [validateBody], (req, res) => {
  const hash = bcrypt.hashSync(req.user.password, 10);
  req.user.password = hash;

  usersDB.add(req.user)
    .then(store => {
      usersDB.findById(store)
        .then(newUser => {
          const token = getJwtToken(newUser.user_id, newUser.username)
          res.status(201).json({ 'username':newUser.username, 'user_id':newUser.user_id, token })
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal server error', error })
        })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

module.exports = router