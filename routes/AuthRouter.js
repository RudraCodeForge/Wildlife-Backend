const AuthController = require('../controllers/AuthController');
const express = require('express');
const AUTHROUTER = express.Router();
AUTHROUTER.post('/login', AuthController.LOGIN)
AUTHROUTER.post('/register', AuthController.REGISTER)
AUTHROUTER.post('/logout', AuthController.LOGOUT)
AUTHROUTER.post('/forgot-password', AuthController.FORGET_PASSWORD);
AUTHROUTER.post('/verify', AuthController.VERIFY);
module.exports = AUTHROUTER;