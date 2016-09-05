
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
  User = require('../models/user'),
  Document = require('../models/document'),
  Role = require ('../models/role');

   // Connect to database
mongoose.connect('mongodb://localhost:27017/27017');
// TODO: FIX above to below
// mongoose.connect('mongodb://localhost:27017/dochero');

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

app.get('/documents', function(req, res) {
  res.send('You\'re viewing a document');
});

// Instanciate express router
var apiRouter = express.Router();

// SIGNUP
apiRouter.route('/signup')
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
  });

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
            firstname: user.firstname,
            username: user.username,
            id: user._id
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

//  ================================ ===================================
//  =============================== ====================================
// ======================= =======  DOCUMENT routes =============================
// Only perform after login

var documentRouter = express.Router();

// For all routes that end in documents
documentRouter.route('/documents')

  .post(function(req, res) {
    var document = new Document();

    document.title = req.body.title;
    document.content = req.body.content;
    document.privacy = req.body.privacy;
    document._creatorId = req.decoded.id;

    document.save(function(err) {
      if (err) {
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'Document created successfully'
        });
      }
    });
  })

  // Get all Documents
  // TODO: Should be authenticated
  .get(function(req, res) {
    Document.find(function(err, documents) {
      if(err) {
        res.send(err);
      }
      else {
        res.json(documents);
      }
    });
  });


// GET all public or private documents
// Set 'public' in route as param to enable get private docs. Document.find({privacy: req.params.public})
documentRouter.route('/documents/access/public')
  .get(function(req, res) {
    Document.find({privacy: 'public'})
      .exec(function(err, documents) {
        if (err) {
          res.send(err);
          res.json({
            success: false,
            message: 'Cannot get private documents that are not the logged in users'
          });
        }
        else {
          res.send(documents);
        }
      });
  });

documentRouter.route('/documents/:document_id')
  .get(function(req, res) {
    Document.findById(req.params.document_id, function(err, document) {
      if (err) {
        // Something happened and we can't find the user
        res.send(err);
      }
      else {
        res.json(document);
      }
    });
  })

  .put(function(req, res) {
    Document.findById(req.params.document_id, function(err, document) {
      if (err) {
        res.send(err);
      }
      // Only update if a change has happened
      if (req.body.title) document.title = req.body.title;
      if (req.body.content) document.content = req.body.content;
      if (req.body.privacy) document.privacy = req.body.privacy;

      // Then save the user details
      document.save(function(err) {
        // If there's an error, tell us
        if (err) {
          res.send(err);
        }
        // Everything went well
        else {
          res.json({
            success: true,
            message: 'Document details updated successfully'
          });
        }
      });
    });
  })

  .delete(function(req, res) {
    Document.remove({
      _id: req.params.document_id
    }, function(err) {
      if (err) {
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'Document deleted successfully'
        });
      }
    });
  });

//  Find documents by creator id -
// You can only find your documents
// TODO: Find your documents and all public documents
documentRouter.route('/users/:creator_id/documents')
  .get(function(req, res) {
    Document.find({_creatorId: req.decoded.id})
      .exec(function (err, documents) {
        if (err) {
          res.send(err);
          return;
        }
        // documents is an array of documents
        else if (documents[0] == null) {
          res.json({
            message: 'No documents were found for that user'
          });
        } else {
          res.send(documents);
        }
      });
  });

  // GET all documents created on a specific date (query: date, limit)
  // TODO: Enable document fetch using date part of createdAt field
documentRouter.route('/documents/:date/:limit')
    .get(function(req, res) {
      Document.find({
        createdAt : req.params.date
      }).limit(parseInt(req.params.limit))
      .exec(function(err,documents) {
        if (err) {
          res.send(err);
        }
        else {
          res.send(documents);
        }
      });
    });

// A route that (query: limit) returns all the documents in order of the dates they were created (ascending or descending).
 // It should also return results based on the limit.
 // TODO: Merge with documents/date/limit route? If date param is null, fetch all documents regardless of created date
 // TODO: FIX
documentRouter.route('/documents/:limit')
   .get(function(req, res) {
     Document.find({})
     .limit(parseInt(req.params.limit))
     .exec(function(err,documents) {
       if (err) {
         res.send(err);
       }
       else {
         res.send(documents);
       }
     });
   });

// TODO: FIX
documentRouter.route('/documents/:search_string')
  .get(function(req, res) {
    Document.find({
      title: req.params.search_string,
      // content: req.param.search_string
    }).exec(function(err, documents) {
      if (err) {
        res.send(err);
      }
      else {
        res.send(documents);
      }
    });
  });


//  =================================== ================================
// ROLE routes
var roleRouter = express.Router();

roleRouter.route('/roles')

  // Create a role
  .post(function(req, res) {
    var role = new Role();

    role.title = req.body.title;
    role.permission = req.body.permission;

    role.save(function(err) {
      if (err) {
        if (err.code == 11000) {
          return res.json({
            success: false,
            message: 'Please provide a unique title'
          });
        }
        else {
          res.send(err);
        }
      }
      else {
        res.json({
          success: true,
          message: 'Role created successfully'
        });
      }
    });
  })
  // Get all roles
  .get(function(req, res) {
    Role.find(function(err, roles) {
      if (err) {
        res.send(err);
      }
      else {
        res.send(roles);
      }
    });
  });

roleRouter.route('/roles/:role_id')
  // Edit a role by it's id
  .put(function(req, res) {
    Role.findById(req.params.role_id, function(err, role) {
      if (err) {
        res.send(err);
      }
      // Only update if a change has happened
      if (req.body.title) role.firstname = req.body.title;
      if (req.body.permission) role.permission = req.body.permission;

      // Then save the role
      role.save(function(err) {
        // If there's an error, tell us
        if (err) {
          res.send(err);
        }
        // Everything went well
        else {
          res.json({
            success: true,
            message: 'Role details updated successfully'
          });
        }
      });

    });
  })
  .delete(function(req, res) {
    Role.remove({
      _id: req.params.role_id
    }, function(err) {
      if (err) {
        return res.send(err);
      }
      else {
        res.json({
          success: true,
          message: 'Role deleted successfully'
        });
      }
    });
  });


// Register our rotes so we can use them
// Prefix routes run by apiRouter instance with 'api'
app.use('/api', apiRouter);


// ===================================== ==================================
// Register routes to be run by express
app.use('/api', documentRouter);

// Register roleRouter routes
app.use('/api', roleRouter);

// SERVER ==================================== =============================
// Start server
app.listen(port, function(){
  console.log('Listening on port ' + port);
});
