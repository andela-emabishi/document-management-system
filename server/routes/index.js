/* eslint-disable no-console */

const jwt = require('jsonwebtoken');
const config = require('../config');

const users = require('./user');
const documents = require('./documents');
const roles = require('./roles');
const search = require('./search');

// Require mongoose model
const User = require('../models/user');

module.exports = (apiRouter) => {
  apiRouter.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the DOCHERO api',
    });
  });

// signup
  apiRouter.route('/users')
    .post((req, res) => {
      const user = new User();

      // Pass details of model instance to request
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;
      user.title = req.body.title;

      user.save((err) => {
        if (err) {
          if (err.code === 11000) {
            res.json({
              message: 'Please provide a unique username',
            });
          } else {
            res.send(err);
          }
        } else {
          // Generate the token on signup
          const token = jwt.sign({
            firstname: user.firstname,
            username: user.username,
            id: user._id,
            title: user.title,
          }, config.development.superSecret, {
            // Token will expire in a day
            expiresIn: 86400,
          });
          res.status(201).send({
            message: 'User created successfully',
            status: '201: Resource created',
            user: user,
            token: token,
          });
        }
      });
    });

  // If they have the correct password, give them a token
  apiRouter.post('/users/login', (req, res) => {
    // Find the user
    User.findOne({
      username: req.body.username,
    }).select('username password title').exec((err, user) => {
      if (err) {
        throw err;
      }
      // No user with that username was found
      if (!user) {
        res.status(404).send({
          message: 'User not found',
          status: '404: Resource Not Found',
        });
      }
      // If a user with that username exists
      else {
        if (user) {
          // Check if password matches
          const validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.status(401).send({
              message: 'Wrong password. Failed to authenticate',
              status: '401: Failed to authenticate',
            });
          }
          // If username exists and password is right
          // Create a token
          else {
            const token = jwt.sign({
              firstname: user.firstname,
              username: user.username,
              id: user._id,
              title: user.title,
            }, config.development.superSecret, {
              // Token will expire in a day
              expiresIn: 86400,
            });

            // Return an object of the information along with the token
            res.send(200).status({
              message: 'Enjoy your token! You\'ve just been logged in',
              token: token,
              user: user,
            });
          }
        }
      }
    });
  });

  // Route middlewear to verify a token before routing a user
  // Runs everytime a request is made
  apiRouter.use((req, res, next) => {
    // Authenticate them
    // Check for token
    const token = req.body.token || req.param('token') || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, config.development.superSecret, (err, decoded) => {
        if (err) {
          res.status(401).send({
            message: 'Failed to authenticate token',
          });
        }
        // Everything went well, we found and verified the token
        else {
          req.decoded = decoded;

          next();
        }
      });
    }
    // No token was found
    else {
      res.status(401).send({
        message: 'No token provided',
        status: '401: Unauthorised',
      });
    }
  });

  users(apiRouter);
  documents(apiRouter);
  roles(apiRouter);
  search(apiRouter);

  return apiRouter;
};
