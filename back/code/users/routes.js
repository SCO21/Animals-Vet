const express = require('express');
const router = express.Router();
const UsersController =  require('./users.controller')

router.post('/register', UsersController.register);
router.post('/auth', UsersController.auth);


module.exports = router;