const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const usersRouter = require('./users/usersRouter');
const authRouter = require('./authorization/authRouter');
const cloudinaryRouter = require('./cloudinary/cloudinary')

const server = express();


server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

server.use('/api/users', usersRouter);
server.use('/auth', authRouter);
server.use('/api/upload', cloudinaryRouter);


server.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = server;