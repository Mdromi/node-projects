// external imports
const router = require("express").Router();

// internal imports
const {getInbox} = require('../controller/inboxController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const {checkLogin} = require('../middleware/common/checkLogin');

// inbox page
router.get('/', decorateHtmlResponse("Inbox"), checkLogin, getInbox);


module.exports = router;