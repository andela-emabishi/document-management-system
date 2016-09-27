/* eslint-disable no-console */

const mongoose = require('mongoose');
const config = require('../../server/config');
const seedData = require('./seeddata');

const User = require('../../server/models/user');
const Document = require('../../server/models/document');
const Role = require('../../server/models/role');


mongoose.connect(config.test.database, (err) => {
  if (err) {
    console.log('Mongoose connection error ', err);
  }
});

// After a successful connection
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ', config.test.port);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ', err);
});

// Seed data to test database
mongoose.connection.on('connected', () => {
  Document.create(seedData.documents, (err) => {
    if (err) {
      console.log('Eror seeding documents into test database');
    }
    else {
      console.log('Successfully seeded documents into the test db');
    }
  });

  Role.create(seedData.roles, (err) => {
    if (err) {
      console.log('Error seeding roles into the test db');
    }
    else {
      console.log('Successfully seeded roles into the test db');
    }
  });

  User.create(seedData.users, (err) => {
    if (err) {
      console.log('Error seeding users into test database', err);
    }
    else {
      console.log('Successfully seeded users into the test db');
    }
    process.exit();
  });
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});
