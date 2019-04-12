function blockbusterItems() {

    const blockbusterObjectsArray = [];

    const pointBreak  = {

        itemname: 'Point Break',
        sku: 'abc123',
        leadtime: 20,
        wholesale: 3.30,
        retail: 8.00,
        stock: 10,
        locationid: 1

    }
    const jurassicPark = {

        itemname: 'Jurassic Park',
        sku: 'cde345',
        leadtime: 19,
        wholesale: 3.00,
        retail: 9.50,
        stock: 50,
        locationid: 1

    }
    const titanic = {

        itemname: 'Titanic',
        sku: 'def786',
        leadtime: 39,
        wholesale: 5.00,
        retail: 10.00,
        stock: 90,
        locationid: 1

    }
    const clueless = {

        itemname: 'Clueless',
        sku: 'ygh378',
        leadtime: 30,
        wholesale: 2.50,
        retail: 7.00,
        stock: 5,
        locationid: 1

    }

    const theLionKing = {

        itemname: 'The Lion King',
        sku: 'vbc657',
        leadtime: 23,
        wholesale: 4.45,
        retail: 8.65,
        stock: 300,
        locationid: 1

    }
    const pulpFiction = {

        itemname: 'Pulp Fiction',
        sku: 'cfd123',
        leadtime: 29,
        wholesale: 1.20,
        retail: 11.30,
        stock: 124,
        locationid: 1

    }
    const groundhogDay = {

        itemname: 'Groundhog Day',
        sku: 'csd453',
        leadtime: 12,
        wholesale: 4.50,
        retail: 15.50,
        stock: 98,
        locationid: 1

    }

    const scream = {

        itemname: 'Scream',
        sku: 'cer768',
        leadtime: 13,
        wholesale: 1.30,
        retail: 13.13,
        stock: 13,
        locationid: 1

    }

    blockbusterObjectsArray.push(pointBreak);
    blockbusterObjectsArray.push(jurassicPark);
    blockbusterObjectsArray.push(titanic);
    blockbusterObjectsArray.push(clueless);
    blockbusterObjectsArray.push(theLionKing);
    blockbusterObjectsArray.push(pulpFiction);
    blockbusterObjectsArray.push(groundhogDay);
    blockbusterObjectsArray.push(scream);


    return blockbusterObjectsArray;


}
module.exports = blockbusterItems;