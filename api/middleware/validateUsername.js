const usersDB = require('../users/usersModel');

const validateUsername = (req, res, next) => {
  if(req.body.username){
    usersDB.findByUsername(req.body.username)
      .then(user => {
        if(user){
          return res.status(400).json({
            error:
              "There is already a user with that username in the database. Please choose a new username."
          });
        }else{
          next()
        }
      })
    }else{
    next()
  }
}

module.exports = validateUsername;