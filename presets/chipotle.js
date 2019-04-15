function chipotleItems() {

    const chipotleObjectsArray = [];

    const beans = {

        itemname: 'canned beans',
        sku: 'abc123',
        leadtime: 2,
        wholesale: .30,
        retail: 1.00,
        stock: 15000,
        locationid: 1

    }
    const rice = {

        itemname: 'rice (lbs)',
        sku: 'cde345',
        leadtime: 1,
        wholesale: .25,
        retail: 1.20,
        stock: 25000,
        locationid: 1

    }
    const chicken = {

        itemname: 'chicken (lbs)',
        sku: 'def786',
        leadtime: 3,
        wholesale: 2.00,
        retail: 3.00,
        stock: 14030,
        locationid: 1

    }
    const salsa = {

        itemname: 'mild salsa (lbs)',
        sku: 'ygh378',
        leadtime: 3,
        wholesale: .50,
        retail: 1.00,
        stock: 15100,
        locationid: 1

    }

    const lettuce = {

        itemname: 'lettuce head',
        sku: 'vbc657',
        leadtime: 2,
        wholesale: .45,
        retail: .65,
        stock: 9010,
        locationid: 1

    }
    const cheese = {

        itemname: 'cheese (lbs)',
        sku: 'cfd123',
        leadtime: 2,
        wholesale: 1.20,
        retail: 1.30,
        stock: 14124,
        locationid: 1

    }
    const steak = {

        itemname: 'steak (lbs)',
        sku: 'csd453',
        leadtime: 10,
        wholesale: 4.50,
        retail: 5.50,
        stock: 13498,
        locationid: 1

    }

    const hotSalsa = {

        itemname: 'hot salsa (lbs)',
        sku: 'cer768',
        leadtime: 3,
        wholesale: .35,
        retail: .75,
        stock: 18907,
        locationid: 1

    }

    chipotleObjectsArray.push(beans);
    chipotleObjectsArray.push(rice);
    chipotleObjectsArray.push(chicken);
    chipotleObjectsArray.push(salsa);
    chipotleObjectsArray.push(lettuce);
    chipotleObjectsArray.push(cheese);
    chipotleObjectsArray.push(steak);
    chipotleObjectsArray.push(hotSalsa);


    return chipotleObjectsArray;


}
module.exports = chipotleItems;