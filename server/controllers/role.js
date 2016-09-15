const Role = require('../models/role');

module.exports = {

  // roleRouter.route('/roles')

  // Create a role
  create: (req, res) => {
    const role = new Role();

    role.title = req.body.title;
    role.permission = req.body.permission;

    role.save(function(err) {
      if (err) {
        if (err.code === 11000) {
          res.json({
            success: false,
            message: 'Please provide a unique title',
          });
        } else {
          res.send(err);
        }
      } else {
        res.status(201).send({
          success: true,
          message: 'Role created successfully',
          status: '201: Resource Created',
        });
      }
    });
  },

// Get all roles
  getAll: (req, res) => {
    Role.find()
    .exec((err, roles) => {
      if (err) {
        res.status(404).send({
          error: err,
          message: 'Error ocurred while fetching roles',
          status: '404: Resource Not Found',
        });
      } else {
        res.status(200).send(roles);
      }
    });
  },

// roleRouter.route('/roles/:role_id')
  updateRoleById: (req, res) => {
    if (req.decoded.title === 'supra-admin') {
      Role.findById(req.params.role_id, (err, role) => {
        if (err) {
          res.send(err);
        }
        // Only update if a change has happened
        if (req.body.title) role.title = req.body.title;
        if (req.body.permission) role.permission = req.body.permission;

        // Then save the role
        role.save((err) => {
          // If there's an error, tell us
          if (err) {
            res.send({
              error: err,
              message: 'Error updating role',
            });
          } else {
            res.status(200).send({
              success: true,
              message: 'Role details updated successfully',
            });
          }
        });
      });
    } else {
      res.status(401).send({
        message: 'Unauthorised to update roles',
        status: '401: Unauthorised',
      });
    }
  },

  deleteRoleById: (req, res) => {
    if (req.decoded.title === 'supra-admin') {
      Role.remove({
        _id: req.params.role_id,
      }, function (err) {
        if (err) {
          res.send({
            error: err,
            message: 'Error deleting role',
          });
        } else {
          res.status(200).send({
            success: true,
            message: 'Role deleted successfully',
          });
        }
      });
    } else {
      res.status(401).send({
        message: 'Not authorised to delete role',
        status: '401: Unauthorised',
      });
    }
  },

  getRoleById: (req, res) => {
    Role.findById(req.params.role_id, (err, role) => {
      if (err) {
        res.send({
          error: err,
          message: 'Error fetching role',
        });
      } else if (!role) {
        res.status(404).send({
          message: 'No role by that id found',
          status: '404: Resource Not Found',
        });
      } else {
        res.status(200).send(role);
      }
    });
  },
};
