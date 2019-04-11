function furnitureItems() {

    const furnitureObjectsArray = [];

    const chair = {

        itemname: 'chair',
        sku: 'abc123',
        leadtime: 7,
        wholesale: 25.00,
        retail: 35.00,
        stock: 50,
        locationid: 1

    }
    const table = {

        itemname: 'table',
        sku: 'cde345',
        leadtime: 3,
        wholesale: 100.00,
        retail: 145.00,
        stock: 25,
        locationid: 1

    }
    const bench = {

        itemname: 'bench',
        sku: 'def786',
        leadtime: 1,
        wholesale: 75.00,
        retail: 125.00,
        stock: 26,
        locationid: 1

    }
    const mirror = {

        itemname: 'mirror',
        sku: 'ygh378',
        leadtime: 4,
        wholesale: 54.50,
        retail: 76.99,
        stock: 34,
        locationid: 1

    }

    const barStool = {

        itemname: 'bar stool',
        sku: 'vbc657',
        leadtime: 3,
        wholesale: 76.45,
        retail: 95.99,
        stock: 40,
        locationid: 1

    }
    const diningTable = {

        itemname: 'dining table',
        sku: 'cfd123',
        leadtime: 7,
        wholesale: 450.00,
        retail: 567.99,
        stock: 20,
        locationid: 1

    }
    const pantry = {

        itemname: 'pantry',
        sku: 'csd453',
        leadtime: 10,
        wholesale: 100.00,
        retail: 150.45,
        stock: 78,
        locationid: 1

    }

    const kitchenIsland = {

        itemname: 'kitchen island',
        sku: 'cer768',
        leadtime: 20,
        wholesale: 350.00,
        retail: 400.45,
        stock: 80,
        locationid: 1

    }

    furnitureObjectsArray.push(chair);
    furnitureObjectsArray.push(table);
    furnitureObjectsArray.push(bench);
    furnitureObjectsArray.push(mirror);
    furnitureObjectsArray.push(barStool);
    furnitureObjectsArray.push(diningTable);
    furnitureObjectsArray.push(pantry);
    furnitureObjectsArray.push(kitchenIsland);


    return furnitureObjectsArray;


}
module.exports = furnitureItems;