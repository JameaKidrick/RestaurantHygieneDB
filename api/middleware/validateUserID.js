const usersDB = require('../users/usersModel');

const validateUserID = (req, res, next) => {
  const id = req.params.userid;

  usersDB.findById(id)
    .then(user => {
      if(!user) {
        res.status(404).json({ error: `A user with the id ${id} does not exist in the database.` }) // ✅
      }else{
        req.user = user;
        next(); // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error})
    })
}

module.exports = validateUserID;