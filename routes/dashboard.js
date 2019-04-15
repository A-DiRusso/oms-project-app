const express = require('express');
const ensureAuthenticated = require('../auth').ensureAuthenticated;

const dashboardRouter =  express.Router();
const {
    showDashboard,
    simulatePurchase,
    resetSim,
    clearTable,
    createTable,
    createTableFurniture,
    createTableChipotle,
    createTableBlockbuster,
    sendPurchaseRecords,
    adjustPurchasePercentage
} = require('../controllers/dashboard');

dashboardRouter.get('/', //ensureAuthenticated,
showDashboard);

dashboardRouter.post('/buy', simulatePurchase);

dashboardRouter.get('/purchaserecords', sendPurchaseRecords);

dashboardRouter.post('/reset', resetSim);

dashboardRouter.post('/cleartable', clearTable);

dashboardRouter.post('/createtable', createTable);

dashboardRouter.post('/furniture', createTableFurniture);

dashboardRouter.post('/chipotle', createTableChipotle);

dashboardRouter.post('/blockbuster', createTableBlockbuster);

dashboardRouter.post('/adjustitem', adjustPurchasePercentage);

module.exports = dashboardRouter;

