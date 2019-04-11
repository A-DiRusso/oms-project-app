const Item = require('../models/items');
const Purchase = require('../models/purchases');



async function showDashboard(req, res) {
    const allItems = await Item.getAll();
    const itemsList = allItems.map(item => {
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
        <div class="col-sm border bg-secondary">
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
  let i = 0;
  console.log(req.body);
  
  const itemName = req.body.itemSelect.replace(/-/g, ' ');
  if (req.body.itemSelect === "random") {
    //find length of allItmes array - getAllItems
    const allItems = await Item.getAll();
    const numberOfItems = allItems.length;
    while (i < req.body.customerCount) {
      const randomItem = allItems[Math.floor(numberOfItems * Math.random())];
      const randomItemName = randomItem.name;
      const itemInstance = await Item.getByName(randomItemName);
      const itemID = itemInstance.id;
  
      await Item.adjustStock(-1, itemID);
  
      const date = '2019-04-10';
      await Purchase.newPurchase(itemID, 2, 1, date);
      i++;
    }
    //run while loop replacing itemid with random less than allItemsArray.length

  } else  {
    //specific/normal operation 
    const itemInstance = await Item.getByName(itemName);
    while (i < req.body.customerCount) {
      const itemID = itemInstance.id;
  
      await Item.adjustStock(-1, itemID);
  
      const date = '2019-04-10';
  
    
    // 2. needs to create a record of the purchase in purchases table
    
    await Purchase.newPurchase(itemID, 2, 1, date);
    i++;
    }
  }
 
  // retrieve sum of revenues for the day
  let sum = await Purchase.totalRevenue()
  req.session.sum = sum;
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

module.exports = {
  showDashboard,
  simulatePurchase,
  resetSim
  
}

