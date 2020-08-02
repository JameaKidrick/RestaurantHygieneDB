const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  // if(req.session && req.session.username){
  //   next()
  // }else{
  //   res.status(401).json({ error: 'Invalid credentials' })
  // }

  if(token){
    const secret = process.env.JWT_SECRET

    jwt.verify(token, secret, (err, decodedToken) => {
      if(err){
        res.status(401).json({ error: 'Invalid credentials: token' })
      }else{
        req.decodeJwt = decodedToken.payload
        next()
      }
    })
  }else{
    res.status(400).json({ error: 'Please provide credentials' })
  }
}

module.exports = verifyToken;