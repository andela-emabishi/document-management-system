/* eslint-disable no-console */

const jwt = require('jsonwebtoken');
const config = require('../config');

const users = require('./user');
const documents = require('./documents');
const roles = require('./roles');


// Require mongoose model
const User = require('../models/user');

module.exports = function(apiRouter) {

  apiRouter.get('/', function(req, res) {
    res.json({
      message: 'Welcome to the DOCHERO api'
    });
  });

// signup
  apiRouter.route('/signup')
    .post(function(req, res) {
      var user = new User();

      // Pass details of model instance to request
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;
      user.title = req.body.title;

      user.save(function(err) {
        if (err) {
          if (err.code == 11000) {
            return res.json({
              success: false,
              message: 'Please provide a unique username'
            });
          }
          // It's another error
          else {
            res.send(err);
          }
        }
        // No error
        else {
          res.status(201).send({
            success: true,
            message: 'User created successfully',
            status: '201: Resource created'
          });
        }
      });
    });


  // If they have the correct password, give them a token
  apiRouter.post('/login', function(req, res) {

    // Find the user
    // Select the password
    User.findOne({
      username: req.body.username
    }).select('username password title').exec(function(err, user) {
      if (err) {
        throw err;
      }

      // No user with that username was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found'
        });
      }
      // If a user with that username exists
      else {
        if (user) {
          // console.log('I am here', user);
          // Check if password matches
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.status(401).send({
              success: false,
              message: 'Wrong password. Failed to authenticate',
              status: '401: Failed to authenticate'
            });
          }
          // If username exists and password is right
          // Create a token
          else {
            var token = jwt.sign({
              firstname: user.firstname,
              username: user.username,
              id: user._id,
              title: user.title
            }, config.development.superSecret, {
              // Token will expire in a day
              expiresIn: 86400
            });

            // Return an object of the information along with the token
            res.json({
              success: true,
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
  apiRouter.use(function(req, res, next) {

    // Authenticate them
    // Check for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, config.development.superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token',
          });
        }
        // Everything went well, we found and verified the token
        else {
          // console.log('Token owner');
          // console.log(decoded);
          req.decoded = decoded;

          next();
        }
      });
    }
    // No token was found
    // Return 403 Access Forbidden and an error message
    else {
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  });

  users(apiRouter);
  documents(apiRouter);
  roles(apiRouter);

  return apiRouter;
};
