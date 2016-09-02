
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


// Middlewear run before any requests are processed
// Authenticate here
apiRouter.use(function(req, res, next) {
  console.log('Somebody just came to our app');

  next();
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





//  =================================== ================================

// Register our rotes so we can use them
// Prefix routes run by apiRouter instance with 'api'
app.use('/api', apiRouter);

// SERVER ==================================== =============================
// Start server
app.listen(port, function(){
  console.log('Listening on port ' + port);
});


// TODO: SignUp ==== Creates new unique user === POST/user OR POST/singup







// TODO: SignIn ===== Authenticate User
