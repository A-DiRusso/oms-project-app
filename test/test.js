const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const Items = require('../models/items');

describe('item model', () => {
    it('should retrive all items', async () => {
        const allItems = await Items.getAll();
        expect(allItems).to.be.an.instanceOf(Array);
    });

    it ('should get by id', async () => {
        const anItem = await Items.getById(336);
        expect(anItem).to.be.instanceOf(Items);
    })
    it ('should get by name', async () => {
        const anItem = await Items.getByName('canned beans');
        expect(anItem).to.be.instanceOf(Items);
    })
});