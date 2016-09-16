const UserController = require('../controllers/user');

module.exports = (router) => {
  router.route('/users')
  .get(UserController.getAll);

  router.route('/users/:user_id')
  .get(UserController.getUserById)
  .put(UserController.updateUserById)
  .delete(UserController.deleteUserById);

  router.route('/users/me/role')
  .get(UserController.getRole);
};
