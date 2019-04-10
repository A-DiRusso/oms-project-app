const express = require('express');

const dashboardRouter =  express.Router();
const {
    showDashboard,
    simulatePurchase,
    redirectToDashboard
} = require('../controllers/dashboard');

dashboardRouter.get('/', showDashboard);

dashboardRouter.post('/buy', simulatePurchase);


module.exports = dashboardRouter;