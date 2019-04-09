const express = require('express');

const dashboardRouter =  express.Router();
const showDashboard = require('../controllers/dashboard');

dashboardRouter.get('/', showDashboard);


module.exports = dashboardRouter;