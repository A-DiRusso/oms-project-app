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
});