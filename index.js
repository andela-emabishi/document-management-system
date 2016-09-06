/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./server/config');
const routes = require('./server/routes/');

const apiRouter = express.Router();

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', routes(apiRouter));

// Configure to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorisation');
  next();
});

// Use morgan to log all requests to the console
app.use(morgan('dev'));

mongoose.connect(config.database, (err) => {
  if (err) {
    console.log('connection error', err);
  } else {
    console.log('Mongoose has interfaced with mongo successfully');
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.log('Connection error', err);
  } else {
    console.log('Server is now listening at port: ', config.port);
  }
});

module.exports = app;
