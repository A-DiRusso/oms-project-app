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
          ${item.location_id}
        </div>
        </div>
        `
       });  
       res.render('dashboard', {
           locals: {
               items: itemsList.join('')
           }
       });
}

async function simulatePurchase(req, res) {
console.log(req);
 // 1. needs to deduct x amount of stock from whatever item was just purchased
  let i = 0;
  while(i < 5) {
  const itemID = 2;

  await Item.adjustStock(-1, 5);

  const date = '2019-04-10';

  
  // 2. needs to create a record of the purchase in purchases table
  await Purchase.newPurchase(itemID, 2, 1, date);
  i++
}
res.redirect('/');

}

module.exports = {
  showDashboard,
  simulatePurchase,
  
}

