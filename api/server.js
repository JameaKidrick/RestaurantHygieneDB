const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
// const session = require('express-session');
// const KnexSessionStorage = require('connect-session-knex')(session);

/******************************* Routers *******************************/
const usersRouter = require('./users/usersRouter');
const authRouter = require('./authorization/authRouter');
const locatorRouter = require('./locator/locatorRouter');
const reviewsRouter = require('./reviews_and_ratings/reviewsRouter');
const restaurantsRouter = require('./restaurants/restaurantsRouter');

/******************************* Middleware *******************************/
const verifyToken = require('../api/authorization/authMiddleware');

const server = express();
// const knexConnection = require('../data/dbConfig');

// const sessionConfiguration = {
//   name: 'session',
//   secret: process.env.JWT_SECRET,
//   cookie: {
//     maxAge: 1000 * 60 * 60, // valid for 10 hours (in milliseconds)
//     secure: process.env.DATABASE_ENV === 'production' ? true : false,
//     httpOnly: true
//   },
//   resave: false,
//   saveUninitialized: true,
//   store: new KnexSessionStorage({
//     knex: knexConnection,
//     clearInterval: 1000 * 60 * 10,
//     tablename: 'user_sessions',
//     sidfieldname: 'id',
//     createTable: true
//   })
// }

server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
// server.use(session(sessionConfiguration));

server.use('/api/users', [verifyToken], usersRouter);
server.use('/api/auth', authRouter);
server.use('/api/locate', locatorRouter);
server.use('/api/reviews', reviewsRouter);
server.use('/api/restaurants', restaurantsRouter);


server.get('/', (req, res) => {
  res.send('Hello World!')
  // res.json({ api: 'up', session: req.session });
})

module.exports = server;