const express = require('express');
const USERROUTER = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require("../middleware/authenticate"); 

USERROUTER.get('/', UserController.HOME);
USERROUTER.get('/profile', authenticate,UserController.PROFILE);

module.exports = USERROUTER;