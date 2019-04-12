const simulateButton = document.querySelector('[data-simulate]');
const waitingDiv = document.querySelector('[data-waiting]');
const addItemButton = document.querySelector('[data-add-item]');
const moreItemsDiv = document.querySelector('[data-more-items]');
const slider = document.querySelector('.slider');
const purchasesDiv = document.querySelector('[data-hidden-purchases');
const simulatedCells = document.querySelectorAll('[data-simulated-stock]');
const originalStockCells = document.querySelectorAll('[data-original-stock]');

const allDivs = document.querySelectorAll('div');

allDivs.forEach(div => {

    div.addEventListener('mouseover', function() {

        if (div.classList[2] === 'bg-danger' || div.classList[2] === 'bg-warning' || div.classList[2] === 'darker-red') {
            div.style.opacity = '.5';
        }

    })
    div.addEventListener('mouseout', function() {

        if (div.classList[2] === 'bg-danger' || div.classList[2] === 'bg-warning' || div.classList[2] === 'darker-red') {
            div.style.opacity = '1';
        }

    })


})


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

allChanges = [];

slider.addEventListener('change', function() {
    
    
    // what day user is on
    let day = slider.value;
    console.log(day);
    
    // if this is the first time user is moving the slider
    if (allChanges.length === 0) {
        allChanges.push(parseInt(day) + 1);
    }

    // push the current day user is on the allChanges
    allChanges.push(parseInt(day));

    // isolates the purchase total for that day from the purchase totals div
    const purchaseTotal = parseInt(purchasesDiv.childNodes[day].textContent.split(' ')[1]);

    // isolates the cell that needs to be changed
    const cellToChange = simulatedCells[0];
    const originalStockCell = originalStockCells[0];

    const originalStockAll = originalStockCell.textContent.split(' ');

    const originalStockNum = parseInt(originalStockAll[8]);

    console.log(originalStockNum);

    // gets the current stock position (value that is currently in that cell)
    const currentStock = parseInt(cellToChange.textContent);

    // changes the value to reflect the previous day's stock position
    // console.log(allChanges[allChanges.length - 1]);
    // console.log(allChanges[allChanges.length - 2]);

    // if user is back to present day
    // if the current day selected on the slider is earlier on in time (less than)
    if (parseInt(day) === 0) {
        console.log('day 0!!!!!!!!!')
        cellToChange.textContent = originalStockNum;
    } else if (allChanges[allChanges.length - 1] < allChanges[allChanges.length - 2]) {
        // increase stock position by amount purchased that day
        const dayDifference = Math.abs(allChanges[allChanges.length - 1] < allChanges[allChanges.length - 2]);
        cellToChange.textContent = currentStock + purchaseTotal;
    // else if current day selected on the slider is later on in time (greater than)
    } else if (allChanges[allChanges.length - 1] > allChanges[allChanges.length - 2]){
        cellToChange.textContent = currentStock - purchaseTotal;
    }

})


function allChanges(day) {

    allChanges.push(day);
    return allChanges;


}
