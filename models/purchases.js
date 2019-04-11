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
    static totalRevenue() {
        return db.any(`
        select sum(retail) from items itms
        inner join purchases pchs
        on itms.id = pchs.item_id;
        `)
        .then(value => {
            return value[0].sum;
        })
        
    }

    static getAll() {
        return db.any(`
        select * from purchases
        
        `)
        .then(purchasesData => {
            const arrayOfPurchases = purchasesData.map(purchase => {
                return new Purchase(purchase.id, purchase.item_id, purchase.customer_id, purchase.location_id, purchase.purchase_date);
            })
            return arrayOfPurchases;

        })
    }



    static deleteAll() {
        return db.result(`
        delete from purchases
        `)
    }

}

module.exports = Purchase;