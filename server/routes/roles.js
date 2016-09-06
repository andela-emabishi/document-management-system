const RoleController = require('../controllers/role');

module.exports = function(router) {
  router.route('/roles')
  .post(RoleController.create)
  .get(RoleController.getAll);

  router.route('/roles/:role_id')
  .get(RoleController.getRoleById)
  .put(RoleController.updateRoleById)
  .delete(RoleController.deleteRoleById);
};
