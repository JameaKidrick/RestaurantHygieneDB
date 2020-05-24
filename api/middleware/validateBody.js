const usersDB = require('../users/usersModel')

const validateBody = (req, res, next) => {
  const userInfo = req.body;

  if(req.route.path === '/register') {
    if(!userInfo.first_name) {
      return res.status(400).json({ error: 'Please provide a first name.' }) // ✅
    }else if(!userInfo.last_name) {
      return res.status(400).json({ error: 'Please provide a last name.' }) // ✅
    }
  }

  if(!userInfo.username) {
    res.status(400).json({ error: 'Please provide a username.' }) // ✅
  }else if(!userInfo.password) {
    res.status(400).json({ error: 'Please provide a password.' }) // ✅
  }else{
    usersDB.findByUsername(userInfo.username)
      .then(user => {
        if(user) {
          res.status(400).json({ error: 'There is already a user with that username in the database. Please choose a new username.' }) // ✅
        }else{
          req.user = userInfo
          next(); // ✅
        }
      })
  }
}

module.exports = validateBody;