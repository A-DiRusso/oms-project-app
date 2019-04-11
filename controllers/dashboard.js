const Item = require('../models/items');
const Purchase = require('../models/purchases');



async function showDashboard(req, res) {

    console.log(req.session);

    const purchasesTotals = req.session.purchaseTotals;
    const allItems = await Item.getAll();

    let addItemsButton = '';
    // determine whether or not to show add items button
    if (allItems.length === 0) {
      addItemsButton = `<button type="submit" class="btn btn-primary" data-toggle="modal" data-target="#addItemsModal">Add Items</button>`
    }
    const itemsList = allItems.map(item => {

      // get purchase total for that particular item
      const itemPurchaseTotal = purchasesTotals[item.id];
      // set background color to a variable
      let bgColor = '';
      if (itemPurchaseTotal > 0) {
        bgColor = 'bg-danger';
      // else if there are no purchase records for that item (nothing purchased yet)
      } else if (!itemPurchaseTotal) {
        bgColor = 'bg-secondary';

      }
      console.log('&&&&&&&&&&&&&&&&&');
      console.log(itemPurchaseTotal);
      console.log('&&&&&&&&&&&&&&&&&');

      return `
      <div class="row text-center text-white">
      <div class="col-sm border bg-secondary">
        ${item.name}
      </div>
      <div class="col-sm border bg-secondary">
        ${item.sku}
      </div>
      <div class="col-sm border bg-secondary">
        ${item.leadTime}
      </div>
      <div class="col-sm border bg-secondary">
        ${item.wholesale}
      </div>
      <div class="col-sm border bg-secondary">
        ${item.retail}
      </div>
      <div class="col-sm border bg-secondary">
        ${item.stock}
      </div>
      <div class="col-sm border ${bgColor}">
        ${item.simulatedStock}
      </div>
      <div class="col-sm border bg-secondary">
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

       if (req.session.sum) {
          sum = req.session.sum;
          soldStockSum = req.session.soldStockSum;
          profit = ("$" + (parseFloat(req.session.sum.substring(1).replace(',', '')) - parseFloat(req.session.soldStockSum.substring(1).replace(',', ''))).toFixed(2).replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,"));
       } else {
          soldStockSum = '';
          sum = '';
          profit = '';
       }
       // commas are breaking this formula. how to fix?
       console.log(profit);
       res.render('dashboard', {
           locals: {
              additems: addItemsButton,
              items: itemsList.join(''),
              choices: itemChoices.join(''),
              revenueTotal: req.session.sum,
              soldStockTotalCost: req.session.soldStockSum,
              profit: profit
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

      console.log(`Next day`);
      day++;

    }
    //find length of allItmes array - getAllItems
    //run while loop replacing itemid with random less than allItemsArray.length

  } else  {

    console.log('getting to else block');
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
  const itemObject = req.body;
  await Item.addItem(itemObject);

  // redirect to dashboard
  res.redirect('/');

}

module.exports = {
  showDashboard,
  simulatePurchase,
  resetSim,
  clearTable,
  createTable
}

