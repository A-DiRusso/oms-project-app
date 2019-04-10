const db = require('./conn');

class Item {
    constructor(id, name, sku, lead_time, wholesale, retail, stock, location_id) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.leadTime = lead_time;
        this.wholesale = wholesale;
        this.retail = retail;
        this.stock = stock;
        this.location_id = location_id;
    }

    static getAll() {
        return db.any(`
            select * from items
        `)
        .then(itemsData => {
            const arrayOfInstances = itemsData.map(item => new Item (item.id,
                    item.name,
                    item.sku,
                    item.lead_time,
                    item.wholesale,
                    item.retail,
                    item.stock,
                    item.location_id
            ))
            return arrayOfInstances;
        });
    }

    static adjustStock(qty, itemID) {

        // delete/add qty to specific item's stock
        return db.result(`
        UPDATE items
        SET stock = stock + ${qty}
        WHERE id=${itemID}
        `)


    }

    static getByName(name) {
        return db.one(`
        Select * from items
        where name ilike '${name}'
        `)
        .then(item => {
            const itemInstance = new Item(item.id,
                item.name,
                item.sku,
                item.lead_time,
                item.wholesale,
                item.retail,
                item.stock,
                item.location_id

            )
            return itemInstance;
        })
    }

}

module.exports = Item;