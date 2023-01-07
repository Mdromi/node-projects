// external imports
const router = require("express").Router();
const { check } = require("express-validator");

// internal imports
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/userController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");
const avatarUpload = require("../middleware/users/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middleware/users/userValidators");

const { checkLogin, requireRole } = require("../middleware/common/checkLogin");

// users page
router.get(
  "/",
  decorateHtmlResponse("Users"),
  checkLogin,
  requireRole(["admin"]),
  getUsers
);

// add user
router.post(
  "/",
  checkLogin,
  requireRole(["admin"]),
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

// remove user
router.delete("/:id", checkLogin, requireRole(["admin"]), removeUser);

module.exports = router;