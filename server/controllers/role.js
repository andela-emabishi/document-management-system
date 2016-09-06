const Role = require('../models/role');

module.exports = {

  // roleRouter.route('/roles')

  // Create a role
  create: function(req, res) {
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
  },

// Get all roles
  getAll: function(req, res) {
    Role.find(function(err, roles) {
      if (err) {
        res.send(err);
      }
      else {
        res.send(roles);
      }
    });
  },

// roleRouter.route('/roles/:role_id')
  updateRoleById: function(req, res) {
    Role.findById(req.params.role_id, function(err, role) {
      if (err) {
        res.send(err);
      }
      // Only update if a change has happened
      if (req.body.title) role.title = req.body.title;
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
  },

  deleteRoleById: function(req, res) {
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
  },

  getRoleById: function(req, res) {
    Role.findById(req.params.role_id, function(err, role) {
      if (err) {
        res.send(err);
      }
      else {
        res.send(role);
      }
    });
  }
};
