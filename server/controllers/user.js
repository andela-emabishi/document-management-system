const User = require('../models/user');

module.exports = {
  // [Restricted] supra admin role only
  getAll: (req, res) => {
    if (req.decoded.title === 'supra-admin') {
      User.find((err, users) => {
        if (err) {
          res.status(404).send({
            success: false,
            error: err,
            status: '404: Resource Not Found',
          });
        } else {
          res.status(200).send(users);
        }
      });
    } else {
      res.status(401).send({
        success: false,
        message: 'Invalid operation. No access',
        status: '401: Unauthorised',
      });
    }
  },

// [Unrestricted]
  getUserById: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) {
        res.send({
          error: err,
        });
      } else if (!user) {
        res.status(404).send({
          success: false,
          message: 'No user by that id found',
          status: '404: Resource Not Found',
        });
      } else {
        res.status(200).send(user);
      }
    });
  },

// [Restricted] A user can only update their own documents
  updateUserById: (req, res) => {
    User.findById(req.params.user_id)
    .exec((err, user) => {
      if (req.decoded.id === req.params.user_id) {
        // Only update if a change has happened
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.username) user.username = req.body.username;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.role) user.role = req.body.role;

        // Then save the user details
        user.save(() => {
          if (err) {
            res.send(err);
          } else {
            res.status(200).send({
              success: true,
              message: 'User details updated successfully',
            });
          }
        });
      } else {
        res.status(401).send({
          success: false,
          error: err,
          message: 'Cannot update another users details',
          status: '401: Unauthorised',
        });
      }
    });
  },

// [Restricted] to admin or logged in user.
// TODO: Once a user is deleted, all their notes should be too.
  deleteUserById: (req, res) => {
    if ((req.decoded.id === req.params.user_id) || (req.decoded.title === 'supra-admin')) {
      User.remove({
        _id: req.params.user_id,
      }, (err) => {
        if (err) {
          res.send({
            error: err,
            message: 'Error deleting user',
            status: '500: Server Error',
          });
        } else {
          res.status(200).send({
            success: true,
            message: 'User deleted successfully',
          });
        }
      });
    } else {
      res.status(401).send({
        success: false,
        message: 'Cannot delete another user. Can only delete yourself',
        status: '401: Unauthorised',
      });
    }
  },

  getRole: (req, res) => {
    if (req.decoded.title) {
      res.status(200).send({
        title: req.decoded.title,
      });
    } else {
      res.status(404).send({
        message: 'No role found',
        status: '404: Resource Not Found',
      });
    }
  },
};
