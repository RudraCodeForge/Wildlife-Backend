const express = require('express');
const USERROUTER = express.Router();
const UserController = require('../controllers/UserController');

USERROUTER.get('/', UserController.HOME);

module.exports = USERROUTER;