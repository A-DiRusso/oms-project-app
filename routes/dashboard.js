const express = require('express');

const dashboardRouter =  express.Router();
const {
    showDashboard,
    simulatePurchase,
    resetSim,
    clearTable,
    createTable,
    createTableFurniture,
    createTableChipotle,
    createTableBlockbuster
} = require('../controllers/dashboard');

dashboardRouter.get('/', showDashboard);

dashboardRouter.post('/buy', simulatePurchase);

dashboardRouter.post('/reset', resetSim);

dashboardRouter.post('/cleartable', clearTable);

dashboardRouter.post('/createtable', createTable);

dashboardRouter.post('/furniture', createTableFurniture);

dashboardRouter.post('/chipotle', createTableChipotle);

dashboardRouter.post('/blockbuster', createTableBlockbuster);

module.exports = dashboardRouter;