const User = require('../models/user');
const Role = require('../models/role');

module.exports = {
  // [Restricted] supra admin role only
  getAll: (req,res) => {
    if (req.decoded.title == 'supra-admin') {
      User.find(function(err, users) {
        if (err) {
          res.send(err);
        }
        else {
          res.status(200).send(users);
        }
      });
    }
    else {
      res.status(401).send({
        success: false,
        message: 'Invalid operation. No access',
        status: '401: Unauthorised',
      });
    }

  },

// [Unrestricted]
  getUserById: (req,res) => {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        // Something happened and we can't find the user
        // 404 Not found
        res.status(404).send({
          error: err,
          success: false,
          status: '404: Resource Not Found'
        });
      }
      else {
        res.status(200).send(user);
      }
    });
  },

// [Restricted] Can only update your own documents
  updateUserById: (req,res) => {
    User.findById(req.params.user_id, function(err, user) {
      if (req.decoded.id == req.params.user_id) {
        // Only update if a change has happened
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.username) user.username = req.body.username;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.role) user.role = req.body.role;

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
      }
      else {
        res.json({
          success: false,
          error: err,
          message: 'Cannot update another users details'
        });
      }
    });
  },

// [Restricted] to admin or logged in user
  deleteUserById: (req, res) => {
    if ((req.decoded.id == req.params.user_id) || (req.decoded.title == 'supra-admin')) {
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
    }
    else {
      res.json({
        success: false,
        message: 'Cannot delete another user. Can only delete yourself',
        status: -1
      });
    }
  },
};
