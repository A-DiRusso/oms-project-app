const express = require('express');

const dashboardRouter =  express.Router();
const {
    showDashboard,
    simulatePurchase,
    resetSim,
    clearTable,
    createTable
} = require('../controllers/dashboard');

dashboardRouter.get('/', showDashboard);

dashboardRouter.post('/buy', simulatePurchase);

dashboardRouter.post('/reset', resetSim);

dashboardRouter.post('/cleartable', clearTable);

dashboardRouter.post('/createtable', createTable);

module.exports = dashboardRouter;