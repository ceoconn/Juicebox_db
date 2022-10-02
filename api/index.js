const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
const postsRouter = require('./posts');

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;