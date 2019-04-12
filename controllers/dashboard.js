const Item = require('../models/items');
const Purchase = require('../models/purchases');
const User = require('../models/users');
const furniture = require('../presets/furniture');
const chipotle = require('../presets/chipotle');
const blockbuster = require('../presets/blockbuster');



async function showDashboard(req, res) {

    console.log(req.session);

    let purchaseTotals = {};
    
    if (req.session.purchaseTotals) {
      purchaseTotals = req.session.purchaseTotals;
    }
    

    const allItems = await Item.getAll();

    let addItemsButton = '<button type="submit" class="btn btn-primary" data-toggle="modal" data-target="#addItemsModal">Add Items</button>';
  
    const itemsList = allItems.map(item => {

      // get purchase total for that particular item
      const itemPurchaseTotal = purchaseTotals[item.id];
      // set background color to a variable
      let bgColor = '';
      let txtColor = '';
      if (itemPurchaseTotal > 100) {
        bgColor = 'darker-red';
      // else if there are no purchase records for that item (nothing purchased yet)
      } else if (itemPurchaseTotal > 50 && itemPurchaseTotal <= 100) {
      
        bgColor = 'bg-danger';
      
      } else if (itemPurchaseTotal > 0 && itemPurchaseTotal <= 50) {

        bgColor = 'bg-warning';

      } else if (!itemPurchaseTotal) {
        txtColor = 'text-secondary'
        bgColor = 'bg-light';
      }

      console.log('&&&&&&&&&&&&&&&&&');
      console.log(itemPurchaseTotal);
      console.log('&&&&&&&&&&&&&&&&&');

      return `
      <div class="row text-center text-white">
      <div class="col-sm border bg-light text-secondary">
        ${item.name}
      </div>
      <div class="col-sm border bg-light text-secondary">
        ${item.sku}
      </div>
      <div class="col-sm border bg-light text-secondary">
        ${item.leadTime}
      </div>
      <div class="col-sm border bg-light text-secondary">
        ${item.wholesale}
      </div>
      <div class="col-sm border bg-light text-secondary">
        ${item.retail}
      </div>
      <div class="col-sm border bg-light text-secondary">
        ${item.stock}
      </div>
      <div class="col-sm border ${bgColor} ${txtColor}">
        ${item.simulatedStock}
      </div>
      <div class="col-sm border bg-light text-secondary">
        ${item.location_id}
      </div>
      </div>
      `
       });
       const allItemsNoSpaces = allItems.map(item => item.name.replace(/ /g, '-'));

       const itemChoices = allItemsNoSpaces.map(item => {
         return `
          <option name=${item} value=${item}>${item.replace(/-/g, ' ')}</option>

         `
       });
       let sum = 0;
       let soldStockSum = 0;
       let profit = 0;
       let userName = await User.getByEmail(req.session.email);
       console.log('$$$$$$$$$$$$$$$$')
       console.log(req.session)
       console.log(userName)
       console.log('$$$$$$$$$$$$$$$$')

       if (req.session.sum) {
          sum = req.session.sum;
          soldStockSum = req.session.soldStockSum;
          profit = ("$" + (parseFloat(req.session.sum.substring(1).replace(',', '')) - parseFloat(req.session.soldStockSum.substring(1).replace(',', ''))).toFixed(2).replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,"));
       } else {
          soldStockSum = '';
          sum = '';
          profit = '';
       }

       res.render('dashboard', {
           locals: {
              additems: addItemsButton,
              items: itemsList.join(''),
              choices: itemChoices.join(''),
              revenueTotal: sum,
              soldStockTotalCost: soldStockSum,
              profit: profit,
              name: userName
           }
       });
}

async function simulatePurchase(req, res) {

  // 1. needs to deduct x amount of stock from whatever item was just purchased

  // number of days to simulate, as entered by user
  const numOfDays = req.body.numOfDays;
  
  const itemName = req.body.itemSelect.replace(/-/g, ' ');

  if (req.body.itemSelect === "random") {
    
    const allItems = await Item.getAll();
    const numberOfItems = allItems.length;

    let day = 0;

    // keep loop going for each day
    while (day < numOfDays) {


      let customerCounter = 0;
      // while customers coming in is still less than user entered total customers per day
      while (customerCounter < req.body.customerCount) {
        const randomItem = allItems[Math.floor(numberOfItems * Math.random())];
        const randomItemName = randomItem.name;
        const itemInstance = await Item.getByName(randomItemName);
        const itemID = itemInstance.id;
    
        await Item.adjustStock(-1, itemID);
    
        const date = '2019-04-10';
        await Purchase.newPurchase(itemID, 2, 1, date);
        customerCounter++;
      }

      day++;

    }
    //find length of allItmes array - getAllItems
    //run while loop replacing itemid with random less than allItemsArray.length

  } else  {

    //specific/normal operation 
    const itemInstance = await Item.getByName(itemName);

    let day = 0;

    // keep loop going for each day
    while (day < numOfDays) {

      let customerCounter = 0;

      // while customers coming in is still less than user entered total customers per day
      
      while (customerCounter < req.body.customerCount) {
        const itemID = itemInstance.id;
    
        await Item.adjustStock(-1, itemID);
    
        const date = '2019-04-10';
    
      
      // 2. needs to create a record of the purchase in purchases table
      
        await Purchase.newPurchase(itemID, 2, 1, date);
        customerCounter++;
      }

      day++;

    }
  }

  // retrieve sum of revenues for the day
  let sum = await Purchase.totalRevenue();
  req.session.sum = sum;

  // get all purchases to see which items have decreased in inventory
  const allPurchases = await Purchase.getAll();

  // isolate just the item IDs
  const allPurchasedItems = allPurchases.map(purchase => {
    return purchase.itemID;
  })

  // get total amount of purchases for each item id
  const frequencyObject = {};

  allPurchasedItems.forEach(id => {
    // if that id exists in frequencyObject already
    if (frequencyObject[id]) {
      // increment the value by one
      frequencyObject[id] += 1;
    } else {
      // initialize that key value pair
      frequencyObject[id] = 1;
    }
  })

  console.log('^^^^^^^^^^^^^^^^^^^^^^^');
  console.log(frequencyObject);
  console.log('^^^^^^^^^^^^^^^^^^^^^^^');

  // save total amount of purchases for first frequencyObject key in sessions
  req.session.purchaseTotals = frequencyObject;

  // retrieve sum of sold stock costs for the day
  let soldStockSum = await Purchase.sumSoldStockCost()
  req.session.soldStockSum = soldStockSum;

  req.session.save(() => {
    res.redirect('/');
  })
}

async function resetSim(req, res) {

  await Purchase.deleteAll();
  req.session.sum = '';
  req.session.purchaseTotals = {};

  req.session.soldStockSum = '';
  req.session.save();

  // needs to update numbers in simulated stock column to match original stock
  const allItems = await Item.getAll();

  // each of the items in allItems needs to call resetStock
  const arrayOfPromises = allItems.map(async item => {
    return await item.resetStock()
  })

  Promise.all(arrayOfPromises).then(values => {
    
    res.redirect('/');
    
  })
}


async function clearTable(req, res) {
  // needs to wipe clean all data that is in the items table
  await Purchase.deleteAll();
  await Item.deleteAll();

  res.redirect('/');
}

async function createTable(req, res) {
  // needs to add each item entered in the form to sql table items
  // all form input is stored in req.body object

  console.log(req.body);

  // loop through however many items user wants to add
  for (let i = 0; i < req.body.itemname.length; i++) {

    const itemObject = {};

    itemObject.itemname = req.body.itemname[i];
    itemObject.sku = req.body.sku[i];
    itemObject.leadtime = req.body.leadtime[i];
    itemObject.wholesale = req.body.wholesale[i];
    itemObject.retail = req.body.retail[i];
    itemObject.stock = req.body.stock[i];
    itemObject.locationid = req.body.locationid[i];

    console.log('^^^^^^^^^^^^^^^^^^^')
    console.log(itemObject);
    console.log('^^^^^^^^^^^^^^^^^^^')

    await Item.addItem(itemObject);

  }


  // const itemObject = req.body;
  // await Item.addItem(itemObject);

  // redirect to dashboard
  res.redirect('/');
}

async function createTableFurniture(req, res) {

  // create a bunch of preset objects for furniture;
  const furnitureArray = furniture();

  console.log(furnitureArray);

  for (let i = 0; i < furnitureArray.length; i++) {

    await Item.addItem(furnitureArray[i]);

  }

  res.redirect('/');


}

async function createTableChipotle(req, res) {

  const chipotleArray = chipotle();

  for (let i = 0; i < chipotleArray.length; i++) {

    await Item.addItem(chipotleArray[i]);

  }
  res.redirect('/');
}

async function createTableBlockbuster(req, res) {

  const blockbusterArray = blockbuster();

  for (let i = 0; i < blockbusterArray.length; i++) {

    await Item.addItem(blockbusterArray[i]);

  }
  res.redirect('/');
}

module.exports = {
  showDashboard,
  simulatePurchase,
  resetSim,
  clearTable,
  createTable,
  createTableFurniture,
  createTableChipotle,
  createTableBlockbuster
}

