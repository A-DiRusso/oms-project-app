const express = require('express');
const ensureAuthenticated = require('../auth').ensureAuthenticated;

const loginRouter =  express.Router();
const {showLoginPage, verifyUser} = require('../controllers/login');

// loginRouter.get('/', ensureAuthenticated);
loginRouter.get('/', showLoginPage);
loginRouter.post('/', verifyUser);


module.exports = loginRouter;


