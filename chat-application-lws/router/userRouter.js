// external imports
const router = require("express").Router();

// internal imports
const {getUsers, addUser, removeUser} = require('../controller/userController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const avatarUpload = require('../middleware/users/avatarUpload');
const {addUserValidators, addUserValidationHandler} = require('../middleware/users/userValidators');
const {checkLogin} = require('../middleware/common/checkLogin');

// login users
router.get('/', decorateHtmlResponse("Users"), checkLogin, getUsers);

// add users
router.post('/', checkLogin, avatarUpload, addUserValidators, addUserValidationHandler, addUser);

// remove user 
router.delete('/:id', removeUser);

module.exports = router;