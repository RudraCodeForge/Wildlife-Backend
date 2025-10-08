const AuthController = require('../controllers/AuthController');
const authenticate = require("../middleware/authenticate"); 
const express = require('express');
const AUTHROUTER = express.Router();
AUTHROUTER.post('/login', AuthController.LOGIN)
AUTHROUTER.post('/register', AuthController.REGISTER)
AUTHROUTER.post('/logout', AuthController.LOGOUT)
AUTHROUTER.post('/forgot-password', AuthController.FORGET_PASSWORD);
AUTHROUTER.get('/verify', authenticate,AuthController.VERIFY);
AUTHROUTER.get('/email-verification/:token', AuthController.EMAIL_VERIFICATION);
module.exports = AUTHROUTER;