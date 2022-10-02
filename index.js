const PORT = 3000;
const express = require('express');
const server = express();
const { client } = require('./db');
const apiRouter = require('./api');
const morgan = require('morgan');

// morgan('dev') is a function that logs incoming requests
// logs the method, route, HTTP response code and time it took to form
server.use(morgan('dev'));

// express.json() is a function that reads incoming JSON from requests
// requires request's header to "Content-Type: application/json"
server.use(express.json());

server.use('/api', apiRouter);

client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});