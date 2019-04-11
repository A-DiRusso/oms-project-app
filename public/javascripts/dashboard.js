const simulateButton = document.querySelector('[data-simulate]');
const waitingDiv = document.querySelector('[data-waiting]');
const addItemButton = document.querySelector('[data-add-item]');
const moreItemsDiv = document.querySelector('[data-more-items]');


simulateButton.addEventListener('click', function() {

    console.log('button clicked');

    const h2 = document.createElement('h2');
    h2.textContent = 'Calculating....';

    waitingDiv.append(h2);

})


addItemButton.addEventListener('click', function() {

    const newItemDiv = document.createElement('div');
    newItemDiv.innerHTML= `
    <div class="form-row">
          <div class="form-group col-md-4">
            <label for="itemname" class="sr-only" >Item Name</label>
            <input name="itemname" type="text" class="form-control" id="itemname" placeholder="Chair">
          </div>
          <div class="form-group col-md">
            <label for="sku" class="sr-only">SKU</label>
            <input name="sku" type="text" class="form-control" id="sku" placeholder="ABC123">
          </div>

          <div class="form-group col-md">
            <label for="leadtime" class="sr-only">Lead Time</label>
            <input name="leadtime"type="number" class="form-control" id="leadtime" placeholder="days">
          </div>
          <div class="form-group col-md">
            <label for="wholesale" class="sr-only">Wholesale</label>
            <input name="wholesale" type="text" class="form-control" id="wholesale" placeholder="$3.00">
          </div>
          <div class="form-group col-md">
            <label for="retail" class="sr-only">Retail</label>
            <input name="retail" type="text" class="form-control" id="wholesale" placeholder="$6.00">
          </div>
          <div class="form-group col-md">
            <label for="stock" class="sr-only">Current Stock</label>
            <input name="stock" type="number" class="form-control" id="stock" placeholder="50">
          </div>
          <div class="form-group col-md">
            <label for="locationid" class="sr-only">Location ID</label>
            <input name="locationid" type="number" class="form-control" id="locationid" placeholder="2">
          </div>
        </div>
    `;
    moreItemsDiv.append(newItemDiv);


})
