
/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),

  //  Secret to use in creating 3rd part of token
  superSecret = 'iloveexistentialquestionslikewhydoweexist',

  port = process.env.PORT || 3000,

  //  Require mongoose model
  User = require('../models/user');

   // Connect to database
mongoose.connect('mongodb://localhost/27017/dochero');
// mongoose.connect('mongodb://dochero:dochero@ds019826.mlab.com:19826/dochero');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, Authorisation');
  next();
});

// Use morgan to log all requests to the console
app.use(morgan('dev'));

//  =================================== ===================================
// ROUTES

// Route for the home page
app.get('/', function(req, res){
  res.send('Welcome to the homepage!');
});

// Instanciate express router
var apiRouter = express.Router();


// Authenticate
// Make sure someone is who they say they are.
// If they have the correct password, give them a token
apiRouter.post('/login', function(req, res) {

  // Find the user
  // Select the password
  User.findOne({
    username: req.body.username
  }).select('username password').exec(function(err, user) {
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
    // If a user with that usernmame exists
    else {
      if (user) {

        // Check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Wrong password. Failed to authenticate'
          });
        }
        // If username exists and password is right
        // Create a token
        else {
          var token = jwt.sign({
            name: user.name,
            username: user.username
          }, superSecret, {
            // Token will expire in a day
            expiresIn: 86400
          });

          // Return an object of the information along with the token
          res.json({
            success: true,
            message: 'Enjoy your token! You\'ve just been logged in',
            token: token
          });
        }
      }
    }
  });
});



// middlewear for all routes parsed by the instance apiRouter.
// Execute this just before processing any request

// Route middlewear to verify a token before routing a user
// Runs everytime request is made
apiRouter.use(function(req, res, next) {
  console.log('Someone just came to our app');
  console.log('let\s verify that they have a token we can decode');

  // Authenticate them
  // Chck for token
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'Failed to authenticate token'
        });
      }
      // Everything went well, we found and verified the token
      else {
        // console.log('===================================');
        // console.log(res.status(404));
        //
        // console.log('====================================');
        console.log('Token owner');
        console.log(decoded);

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


apiRouter.get('/', function(req, res) {
  res.json({
    message: 'Hooray! Welcome to the DOCHERO api'
  });
});

// On routes that end in users
apiRouter.route('/users')

// Create a new user

  .post(function(req, res) {
    var user = new User();

    // Pass details of model instance to request
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

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
        res.json({
          success: true,
          message: 'User created successfully'
        });
      }
    });
  })

  // Get all Users
  .get(function(req, res) {
    User.find(function(err, users) {
      if(err) {
        res.send(err);
      }
      else {
        res.json(users);
      }
    });
  });

apiRouter.route('/users/:user_id')
// GET a single user using their id
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        // Something happened and we can't find the user
        res.send(err);
      }
      else {
        res.json(user);
      }
    });
  })

  // Update a user's attributes
  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }
      // Only update if a change has happened
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;
      if (req.body.username) user.username = req.body.username;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      // Then save the user details
      user.save(function(err) {
        // If there's an error, tell us
        if (err) {
          res.send(err);
        }
        // Everything went well
        else {
          res.json({
            success: true,
            message: 'User details updated successfully'
          });
        }
      });

    });
  })
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err) {
      if (err) {
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'User deleted successfully'
        });
      }
    });
  });





//  =================================== ================================

// Register our rotes so we can use them
// Prefix routes run by apiRouter instance with 'api'
app.use('/api', apiRouter);

// SERVER ==================================== =============================
// Start server
app.listen(port, function(){
  console.log('Listening on port ' + port);
});

// TODO: SignIn ===== Authenticate User
