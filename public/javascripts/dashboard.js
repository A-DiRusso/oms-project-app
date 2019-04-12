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

slider.addEventListener('change', pullDateFromSlider);


function pullDateFromSlider() {

    // get the max value (last day) of slider
    const startDay = parseInt(slider.getAttribute('max'));

    // what day user is on
    let day = parseInt(slider.value);

    // if this is the first time user is moving the slider
    if (allChanges.length === 0) {
        allChanges.push(startDay);
    }

    // push the current day user is on the allChanges
    allChanges.push(day);

    findDailyPurchaseTotals(day);


}

function findDailyPurchaseTotals(day) {

    const originalStockCell = originalStockCells[0];
    const cellToChange = simulatedCells[0];

    // previous day is day that slider was on right before current day
    const previousDay = allChanges[allChanges.length - 2];

    // this is how many days user "jumped" ahead or behind on slider
    // positive number if user is going backwards in time (closer to day 0) left direction on slider
    // negative number if user is going forwards in time (further from day 0) right direction on slider

    const allActiveDaysArray = [];

    // this for loop works only if user is going backwards in time
    for (let i = previousDay - 1; i >= day; i--) {

        allActiveDaysArray.push(i);


    }
    console.log(allActiveDaysArray);

    let allDaysPurchaseTotal = 0;

    // isolates the purchase total for that day from the purchase totals div
    const purchaseTotal = parseInt(purchasesDiv.childNodes[day].textContent.split(' ')[1]);

    // for each day in the days array
    allActiveDaysArray.forEach(day => {

        let dayPurchaseTotal = 0;

        // if loop is on day 0
        if (day === 0) {
            console.log('day 0!!!!!')
            // purchase total for day 0 (which is implied) is original stock - all days total
            dayPurchaseTotal = parseInt(originalStockCell.textContent) - allDaysPurchaseTotal - parseInt(cellToChange.textContent);
            console.log(`Day 0 purchase total: ${dayPurchaseTotal}`);

        } else {

            dayPurchaseTotal = parseInt(purchasesDiv.childNodes[day].textContent.split(' ')[1]);

        }
        // calculate number of purchases on that day for each item and add to total
        allDaysPurchaseTotal += dayPurchaseTotal
    });

    console.log(allDaysPurchaseTotal);

    changeCellValue(purchaseTotal, day)
}

function findCells() {

    // isolates the cell that needs to be changed
    const cellToChange = simulatedCells[0];
    const originalStockCell = originalStockCells[0];

    const targetedCells = {
        cellToChange: cellToChange,
        originalStockCell: originalStockCell
    }   

    return targetedCells;

}

function changeCellValue(dailyPurchaseTotal, day) {

    const targetedCells = findCells();

    const cellToChange = targetedCells.cellToChange;
    const originalCell = targetedCells.originalStockCell;


    const itemOriginalStock = parseInt(originalCell.textContent);

    // gets the current stock position (value that is currently in that cell)
    const currentStock = parseInt(cellToChange.textContent);

    // current day is day that slider is currently on
    const currentDay = allChanges[allChanges.length - 1];
    // previous day is day that slider was on right before current day
    const previousDay = allChanges[allChanges.length - 2];

    // if user is back to present day
    if (parseInt(day) === 0) {
        console.log('day 0!!!!!!!!!')
        cellToChange.textContent = itemOriginalStock;
    // if the current day selected on the slider is earlier on in time (less than)
    } else if (currentDay < previousDay) {
        // increase stock position by amount purchased that day
        // const dayDifference = Math.abs(currentDay - previousDay);
        cellToChange.textContent = currentStock + dailyPurchaseTotal;
    // else if current day selected on the slider is later on in time (greater than)
    } else if (currentDay > previousDay){
        const dayDifference = Math.abs(currentDay - previousDay);
        cellToChange.textContent = currentStock - dailyPurchaseTotal;
    }


}
