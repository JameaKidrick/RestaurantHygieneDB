const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const usersRouter = require('./users/usersRouter');
const authRouter = require('./authorization/authRouter');
const locatorRouter = require('./locator/locatorRouter');

const server = express();


server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);
server.use('/api/locate', locatorRouter);


server.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = server;