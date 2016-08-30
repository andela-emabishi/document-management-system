const express = require('express');

const UserController = require('../controllers/user');
const RoleController = require('../controllers/role');

const router = express.Router();

router.route('/users')
  .post(UserController.createUser),
  .get(UserController.getUser)

router.route('/users/:id')
  .get(UserController.getUserById),
  .put(UserController.updateUserAttributes),
  .delete(UserController.deleteUser);

router.route('/users/login')
  .post(UserController.login);

router.route('/user/logout')
  .post(UserController.logout);

router.route('/users/roles')
  .get(RoleController.getAllRoles);

route.route('/users/roles/:id')
  .get(RoleController.getRoleById);

module.exports = router;
