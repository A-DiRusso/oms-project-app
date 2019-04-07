const express = require('express');

const mainRouter =  express.Router();

//EVERYTHING down to module.exports can/should be changed*****************
const { loadMainPage,
    deleteAStore,
    deleteAnItem,
    addStore,
    addItem} = require('../controllers/main');


mainRouter.post('/delete/store/:id',deleteAStore);

mainRouter.post('/delete/item', deleteAnItem);

mainRouter.post('/item/add/:storeID', addItem);

mainRouter.post('/store/add/', addStore);

mainRouter.post('/',loadMainPage);


module.exports = mainRouter;