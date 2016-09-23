const User = require('../models/user');
const Document = require('../models/document');

module.exports = {
  // [Restricted] supra admin role only
  getAll: (req, res) => {
    if (req.decoded.title === 'supra-admin') {
      User.find((err, users) => {
        if (err) {
          res.status(500).send({
            error: err,
          });
        } else if (!users) {
          res.status(404).send({
            message: 'No users were found',
            status: '404: Resource Not Found',
            users: [],
          });
        } else {
          res.status(200).send(users);
        }
      });
    } else {
      res.status(401).send({
        message: 'Invalid operation. No access',
        status: '401: Unauthorised',
      });
    }
  },

  getUserById: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) {
        res.status(500).send({
          error: err,
          message: '500: Server Error',
        });
      } else if (!user) {
        res.status(404).send({
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
              message: 'User details updated successfully',
              user: user,
            });
          }
        });
      } else {
        res.status(401).send({
          error: err,
          message: 'Cannot update another users details',
          status: '401: Unauthorised',
        });
      }
    });
  },

// [Restricted] to admin or logged in user.
// Once a user is deleted, all their documents are deleted.
  deleteUserById: (req, res) => {
    if ((req.decoded.id === req.params.user_id) || (req.decoded.title === 'supra-admin')) {
      // Remove all documents by user
      Document.remove({ _creatorId: req.params.user_id })
      .exec((err) => {
        if (err) {
          res.status(500).send({
            error: err,
            message: 'Failed to delete documents.',
            status: '500: Server Error',
          });
        } else {
          // Then delete the user
          User.remove({ _id: req.params.user_id })
          .exec(() => {
            if (err) {
              res.status(500).send({
                error: err,
                message: 'Could not delete user details',
                status: '500: Server Error',
              });
            } else {
              res.status(200).send({
                message: 'User and document details deleted successfully',
              });
            }
          });
        }
      });
    } else {
      res.status(401).send({
        message: 'Unauthorised to delete user.',
        status: '401: Not authorised',
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
