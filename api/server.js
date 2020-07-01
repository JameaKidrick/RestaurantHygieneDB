const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

/******************************* Routers *******************************/
const usersRouter = require('./users/usersRouter');
const authRouter = require('./authorization/authRouter');
const locatorRouter = require('./locator/locatorRouter');
const reviewsRouter = require('./reviews_and_ratings/reviewsRouter');
const restaurantsRouter = require('./restaurants/restaurantsRouter');

/******************************* Middleware *******************************/
const verifyToken = require('../api/authorization/authMiddleware');

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

server.use('/api/users', [verifyToken], usersRouter);
server.use('/api/auth', authRouter);
server.use('/api/locate', locatorRouter);
server.use('/api/reviews', reviewsRouter);
server.use('/api/restaurants', restaurantsRouter);


server.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = server;