const express = require('express');

const dashboardRouter =  express.Router();
const {
    showDashboard,
    simulatePurchase,
    resetSim
} = require('../controllers/dashboard');

dashboardRouter.get('/', showDashboard);

dashboardRouter.post('/buy', simulatePurchase);

dashboardRouter.post('/reset', resetSim);

module.exports = dashboardRouter;