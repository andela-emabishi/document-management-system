/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),

  port = process.env.PORT || 3000,

    //  Require mongoose model
  Document = require('../models/document');

  // Connect to database
mongoose.connect('mongodb://localhost/27017/dochero');

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


app.get('/documents', function(req, res) {
  res.send('You\'re viewing a document');
});

var documentRouter = express.Router();

documentRouter.route('/documents')

  .post(function(req, res) {
    var document = new Document();

    document.title = req.body.title;
    document.content = req.body.content;
    document.privacy = req.body.privacy;

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

  });

// Register routes to be run by express
app.use('/api', documentRouter);

// SERVER ==================================== =============================
// Start server
app.listen(port, function(){
  console.log('Listening on port ' + port);
});
