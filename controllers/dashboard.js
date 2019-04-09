const Item = require('../models/items');
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

module.exports = showDashboard;