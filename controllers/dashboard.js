const Item = require('../models/items');
const Purchase = require('../models/purchases');
const User = require('../models/users');
const furniture = require('../presets/furniture');
const chipotle = require('../presets/chipotle');
const blockbuster = require('../presets/blockbuster');


// renders dashboard with relevant interpolations
async function showDashboard(req, res) {
   
  // gets all purchase records from the session
    let purchaseTotals = {};
    
    if (req.session.purchaseTotals) {
      purchaseTotals = req.session.purchaseTotals;
    }
    
    // gets all item instances
    const allItems = await Item.getAllByUser(req.session.userid);

    let simulateView = 'class="d-none"';
    let tableMessage = 'Add items or select a preset table to get started'

    if (allItems.length) {

      simulateView = 'class="d-block"';
      tableMessage = '';
    }

    // generates add items button
    let addItemsButton = '<button type="submit" class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#addItemsModal">Add Items</button>';
  

    // sets simulated cell styling depending on purchase totals
    const itemsList = allItems.map(item => {

      // get purchase total for that particular item
      const itemPurchaseTotal = purchaseTotals[item.id];
      // set background color to a variable
      let bgColor = '';
      let txtColor = '';
      let modified = '';
      let simModified = '';
      let itemModified = '';
      if (itemPurchaseTotal > 100) {
        bgColor = 'darker-red';
        txtColor = 'text-light';
        modified = 'data-modified';
        simModified = 'data-sim-modified';
        itemModified = 'data-item-changed';
      // else if there are no purchase records for that item (nothing purchased yet)
      } else if (itemPurchaseTotal > 50 && itemPurchaseTotal <= 100) {
      
        bgColor = 'bg-danger';
        modified = 'data-modified';
        simModified = 'data-sim-modified';
        itemModified = 'data-item-changed';
      
      } else if (itemPurchaseTotal > 0 && itemPurchaseTotal <= 50) {

        bgColor = 'bg-warning';
        modified = 'data-modified';
        simModified = 'data-sim-modified';
        itemModified = 'data-item-changed';

      } else if (!itemPurchaseTotal) {
        // txtColor = 'text-secondary'
        // bgColor = 'bg-light';
      }

      return `
      <tr>
        <td ${itemModified} data-item-name class="border">${item.name}</td>
        <td class="border">${item.sku}</td>
        <td class="border">${item.leadTime}</td>
        <td class="border">${item.wholesale}</td>
        <td class="border">${item.retail}</td>
        <td data-original-stock ${simModified} class="border">${item.stock}</td>
        <td data-simulated-stock ${modified} class="border ${bgColor} ${txtColor}">${item.simulatedStock}</td>
        <td class="border">${item.location_id}</td>
      </tr>
      `
       });

    const allItemsNoSpaces = allItems.map(item => item.name.replace(/ /g, '-'));

    // puts item choices in the select item to simulate dropdown 
    const itemChoices = allItemsNoSpaces.map(item => {
      return `
      <option name=${item} value=${item}>${item.replace(/-/g, ' ')}</option>

      `
    });

    let sum = 0;
    let soldStockSum = 0;
    let profit = 0;
    let userName = await User.getByEmail(req.session.email);

    if (req.session.sum) {
      sum = req.session.sum;
      soldStockSum = req.session.soldStockSum;
      profit = ("$" + (parseFloat(req.session.sum.substring(1).replace(',', '')) - parseFloat(req.session.soldStockSum.substring(1).replace(',', ''))).toFixed(2).replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,"));
    } else {
      soldStockSum = '';
      sum = '';
      profit = '';
    }

    let maxDayHTML = '';
    let maxValue = '';
    let startValue = '';

       if (req.session.purchaseTotalsPerDay) {
        maxDayHTML = `Day ${Object.keys(req.session.purchaseTotalsPerDay).length}`;
        maxValue = Object.keys(req.session.purchaseTotalsPerDay).length;
        startValue = Object.keys(req.session.purchaseTotalsPerDay).length;
       }

       if (req.session.email) {
         console.log("----------------")
         console.log(req.session);
         console.log("----------------")

         res.render('dashboard', {
           locals: {
              userName: userName.firstName,
              passUserName: req.session.displayName,
              additems: addItemsButton,
              items: itemsList.join(''),
              choices: itemChoices.join(''),
              revenueTotal: sum,
              soldStockTotalCost: soldStockSum,
              profit: profit,
              purchaseTotalsPerDay: '',
              name: userName,
              maxday: maxDayHTML,
              maxvalue: `max=${maxValue}`,
              startvalue: `value=${startValue}`,
              simulateView: simulateView,
              tablemessage: tableMessage
           }
         });

       } else {
         res.redirect('/login');
       }
}

// sends purchase records to be put in local storage on the front end
async function sendPurchaseRecords(req, res) {

  // gets all purchase records from database
  const allPurchases = await Purchase.getAll();

  // creates array of promises with the item name and date for each purchase record
  const arrayOfPromises = allPurchases.map(async purchase => {

    const theItem = await Item.getById(purchase.itemID);

    const purchaseObject = {};

    purchaseObject['name'] = theItem.name;
    purchaseObject['date'] = purchase.purchaseDate.toISOString().slice(0, 10);

    // stringify for local storage
    const stringifyPurchaseObject = JSON.stringify(purchaseObject);

    return stringifyPurchaseObject;

  })

  // fulfill all promises, then send the formatted purchase records
  Promise.all(arrayOfPromises).then((data) => {

    res.send(data);
  })

}

// simulates purchases, for all inventory and single item
async function simulatePurchase(req, res) {

  // 1. needs to deduct x amount of stock from whatever item was just purchased

  // number of days to simulate, as entered by user
  const numOfDays = req.body.numOfDays;

  // item to simulate, as selected by user from select item to simulate dropdown
  const itemName = req.body.itemSelect.replace(/-/g, ' ');

  // if user has chosen random simulation
  if (req.body.itemSelect === "random") {
    
    // get all item instances from database
    const allItems = await Item.getAllByUser(req.session.userid);

    // gets total number of items to simulate
    const numberOfItems = allItems.length;

    // checks to see if there are any items with increased likelihood of purchase
    let itemToIncreaseChance = '';
    let percentageToIncrease = 0;

    for (item in req.session.itemLikelihood) {
      itemToIncreaseChance = item;
      percentageToIncrease = req.session.itemLikelihood[item];
    }

    let day = 0;
    const date = new Date();

    const allOptions = [];

    for (let i = 0; i < numberOfItems; i++) {
      // converts all item options to numbers
      allOptions.push(i);
    }

    // if item has increased likelihood to purchase, push that item to all options array x number of days
    for (let i = 0; i < parseInt(percentageToIncrease); i += 10) {


      for (let i = 0; i < allItems.length; i++) {
        
        if (allItems[i].name === itemToIncreaseChance) {
          allOptions.push(i);
        }
      }


    }

    // ---------------------- RANDOM PURCHASE SIMULATION -----------------------

    // keep loop going for each day
    while (day < numOfDays) {

      let customerCounter = 0;

      // while customers coming in is still less than user entered total customers per day
      while (customerCounter < req.body.customerCount) {

        const randomItem = allOptions[Math.floor(allOptions.length * Math.random())];
        // console.log(randomItem);
        const randomItemName = allItems[randomItem].name;
        const itemInstance = await Item.getByName(randomItemName, req.session.userid);
        const itemID = itemInstance.id;
    
        await Item.adjustStock(-1, itemID);
        
        // converts to UTC (London time)
        // create record of purchase in purchase's table
        await Purchase.newPurchase(itemID, 2, 1, date.toISOString().slice(0, 10));
        // increment customer counter
        customerCounter++;
        // increment date
        
      }
      // increment to next date
      date.setDate(date.getDate() + 1);
      day++;

    }

    // ---------------------- END RANDOM PURCHASE SIMULATION -----------------------


  } else  {

    const itemInstance = await Item.getByName(itemName, req.session.userid);

    let day = 0;
    const date = new Date();

    // ---------------------- SINGLE ITEM PURCHASE SIMULATION -----------------------


    // keep loop going for each day
    while (day < numOfDays) {

      let customerCounter = 0;

      // while customers coming in is still less than user entered total customers per day
      
      while (customerCounter < req.body.customerCount) {
        const itemID = itemInstance.id;
    
        await Item.adjustStock(-1, itemID);
    
        
        
        // 2. needs to create a record of the purchase in purchases table
        
        await Purchase.newPurchase(itemID, 2, 1, date.toISOString().slice(0, 10));
        customerCounter++;
      }
      
      date.setDate(date.getDate() + 1);
      day++;

    }

    // ---------------------- END SINGLE ITEM PURCHASE SIMULATION -----------------------
  }


  // --------- SAVE PURCHASE TOTALS IN LOCAL STORAGE -----------------

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

  // isolate just the dates
  const purchasesPerDate = allPurchases.map(purchase => {
    const purchaseDate = purchase.purchaseDate.toISOString().slice(0, 10)
    return purchaseDate;

  })

  const purchaseTotalsPerDay = {};

  purchasesPerDate.forEach(date => {
    if (purchaseTotalsPerDay[date]) {
      purchaseTotalsPerDay[date] += 1
    } else {
      purchaseTotalsPerDay[date] = 1;
    }
  })




  // save total amount of purchases for first frequencyObject key in sessions
  req.session.purchaseTotals = frequencyObject;
  req.session.purchaseTotalsPerDay = purchaseTotalsPerDay;

  // retrieve sum of sold stock costs for the day
  let soldStockSum = await Purchase.sumSoldStockCost()
  req.session.soldStockSum = soldStockSum;

  req.session.save(() => {
    res.redirect('/');
  })
}

// resets table back to present day default stock levels
async function resetSim(req, res) {

  // delete all purchase records and clear relevant purchase/item sessions
  await Purchase.deleteAll();
  req.session.sum = '';
  req.session.purchaseTotals = {};
  req.session.purchaseTotalsPerDay = '';
  req.session.itemLikelihood = {};

  req.session.soldStockSum = '';
  req.session.save();

  // needs to update numbers in simulated stock column to match original stock
  const allItems = await Item.getAllByUser(req.session.userid);
  

  // each of the items in allItems needs to call resetStock
  const arrayOfPromises = allItems.map(async item => {
    // call reset stock on each item
    return await item.resetStock()
  })
  // fulfill all promises then redirect to dashboard
  await Promise.all(arrayOfPromises);

  res.redirect('/');
}

// clears table of items and simulations run
async function clearTable(req, res) {
  // clear table needs to reset simulation, which wipes sessions clean
  // resetSim(req, res);
  req.session.sum = '';
  req.session.purchaseTotals = {};
  req.session.purchaseTotalsPerDay = '';
  req.session.itemLikelihood = {};

  req.session.soldStockSum = '';
  req.session.save();

  // also needs to wipe clean all data that is in the items table
  await Purchase.deleteAll();
  await Item.deleteAll(req.session.userid);

  res.redirect('/');
}

// creates table based on user inputs in add items modal
async function createTable(req, res) {
  // needs to add each item entered in the form to sql table items
  // all form input is stored in req.body object
  

  // if there is only one item being added
  if (typeof req.body.itemname === 'string') {
    console.log(req.body);
    const itemObject = req.body;
    itemObject.userid = `${req.session.userid}`;
    itemObject.locationid = '1';
    console.log(itemObject);
    await Item.addItem(itemObject);

  } else {

    // loop through however many items user wants to add
    for (let i = 0; i < req.body.itemname.length; i++) {
  
      const itemObject = {};
  
      itemObject.itemname = req.body.itemname[i];
      itemObject.sku = req.body.sku[i];
      itemObject.leadtime = req.body.leadtime[i];
      itemObject.wholesale = req.body.wholesale[i];
      itemObject.retail = req.body.retail[i];
      itemObject.stock = req.body.stock[i];
      itemObject.locationid = '1';
      itemObject.userid = req.session.userid;
  
  
      await Item.addItem(itemObject);
  
    }

  }

  // redirect to dashboard
  res.redirect('/');
}

// preset table
async function createTableFurniture(req, res) {
  await Purchase.deleteAll();
  await Item.deleteAll(req.session.userid);

  // create a bunch of preset objects for furniture;
  const furnitureArray = furniture();

  for (let i = 0; i < furnitureArray.length; i++) {

    furnitureArray[i].userid = req.session.userid;

    await Item.addItem(furnitureArray[i]);

  }
  
  res.redirect('/');


}

// preset table
async function createTableChipotle(req, res) {
  await Purchase.deleteAll();
  await Item.deleteAll(req.session.userid);

  const chipotleArray = chipotle();

  for (let i = 0; i < chipotleArray.length; i++) {

    chipotleArray[i].userid = req.session.userid;
    await Item.addItem(chipotleArray[i]);

  }
  res.redirect('/');
}

// preset table
async function createTableBlockbuster(req, res) {
  await Purchase.deleteAll();
  await Item.deleteAll(req.session.userid);

  const blockbusterArray = blockbuster();

  for (let i = 0; i < blockbusterArray.length; i++) {

    blockbusterArray[i].userid = req.session.userid;
    await Item.addItem(blockbusterArray[i]);

  }
  res.redirect('/');
}

// stores increased purchase likelihood for an item in sessions
async function adjustPurchasePercentage(req, res) {

  const itemLikelihood = {};

  itemLikelihood[req.body.item] = req.body.percentLikelihood;

  req.session.itemLikelihood = itemLikelihood;

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
  createTableBlockbuster,
  sendPurchaseRecords,
  adjustPurchasePercentage
}

