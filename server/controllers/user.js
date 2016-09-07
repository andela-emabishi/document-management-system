const User = require('../models/user');

module.exports = {
  // [Restricted] supra admin role only
  getAll: (req,res) => {
    // if (req.decoded.role == 'supra-admin') {
    //   User.find(function(err, users) {
    //     if(err) {
    //       res.send(err);
    //     }
    //     else {
    //       res.json(users);
    //     }
    //   });
    // }
    // else {
    //   res.json({
    //     success: false,
    //     message: 'Invalid operation',
    //     status: -1
    //   });
    // }
    User.find(function(err, users) {
  if(err) {
    res.send(err);
  }
  else {
    res.json(users);
  }
});
  },

  getUserById: (req,res) => {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        // Something happened and we can't find the user
        res.send(err);
      }
      else {
        res.json(user);
      }
    });
  },

// TODO:
// Restricted to logged in user
  updateUserById: (req,res) => {
    // User.findById(req.params.user_id, function(err, user) {
    //   if (err) {
    //     res.send(err);
    //   }
    //   // Only update if a change has happened
    //   if (req.body.firstname) user.firstname = req.body.firstname;
    //   if (req.body.lastname) user.lastname = req.body.lastname;
    //   if (req.body.username) user.username = req.body.username;
    //   if (req.body.email) user.email = req.body.email;
    //   if (req.body.password) user.password = req.body.password;
    //   if (req.body.role) user.role = req.body.role;
    //
    //   // Then save the user details
    //   user.save(function(err) {
    //     // If there's an error, tell us
    //     if (err) {
    //       res.send(err);
    //     }
    //     // Everything went well
    //     else {
    //       res.json({
    //         success: true,
    //         message: 'User details updated successfully'
    //       });
    //     }
    //   });
    // });
    User.findById(req.params.user_id)
    // .where(req.decoded.id).equals(req.params.user_id)
    .exec(function(err, user) {
      if (err) {
        res.send(err);
      }
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
    });
  },

// TODO: Restrict to admin or logged in user
  deleteUserById: (req, res) => {
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
  },
};
