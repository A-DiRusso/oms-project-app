const express = require('express');
const ensureAuthenticated = require('../auth').ensureAuthenticated;

const loginRouter =  express.Router();

loginRouter.get('/', ensureAuthenticated)



module.exports = loginRouter;