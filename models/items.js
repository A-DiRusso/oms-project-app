const db = require('./conn');

class Item {
    constructor(id, name, sku, lead_time, wholesale, retail, location_id) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.leadTime = lead_time;
        this.wholesale = wholesale;
        this.retail = retail;
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
                    item.location_id
            ))
            return arrayOfInstances;
        });
    }
}

module.exports = Item;