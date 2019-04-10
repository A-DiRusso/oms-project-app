// pull in database connection
const db = require('./conn');

class Purchase {

    constructor(id, item_id, customer_id, location_id, purchase_date) {
        this.id = id;
        this.itemID = item_id;
        this.customerID = customer_id;
        this.locationID = location_id;
        this.purchaseDate = purchase_date;


    }

    static newPurchase(itemID, customerID, locationID, date) {
        // needs to add purchase record to purchases table
        return db.result(`
        INSERT INTO purchases (item_id, customer_id, location_id, purchase_date) 
        VALUES (${itemID}, ${customerID}, ${locationID}, '${date}')
        `)
    }


}

module.exports = Purchase;