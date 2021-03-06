/* eslint-disable no-console */

const mongoose = require('mongoose');
const config = require('../../server/config');

const User = require('../../server/models/user');
const Document = require('../../server/models/document');
const Role = require('../../server/models/role');

mongoose.connect(config.test.database, (err) => {
  if (err) {
    console.log('Mongoose connection error ', err);
  }
});

// Drop data from test database
mongoose.connection.on('connected', () => {
  User.remove({}, (err) => {
    if (err) {
      console.log('Error un-unseeding users from test database', err);
    } else {
      console.log('Successfully removed users from the test db');
    }
  });

  Document.remove({}, (err) => {
    if (err) {
      console.log('Eror un-seeding documents from test database');
    }
    else {
      console.log('Successfully removed documents from the test db');
    }
  });

  Role.remove({}, (err) => {
    if (err) {
      console.log('Error un-seeding roles from the test db');
    }
    else {
      console.log('Successfully removed roles from the test db');
    }
    process.exit();
  });
});
