const simulateButton = document.querySelector('[data-simulate]');
const waitingDiv = document.querySelector('[data-waiting]');
const addItemButton = document.querySelector('[data-add-item]');
const moreItemsDiv = document.querySelector('[data-more-items]');
const slider = document.querySelector('.slider');
const purchasesDiv = document.querySelector('[data-hidden-purchases');
const simulatedCells = document.querySelectorAll('[data-simulated-stock]');
const modifiedCell = document.querySelector('[data-modified]');
const originalCell = document.querySelector('[data-sim-modified]');
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

    // isolate cell that contains original stock for that item
    console.log(modifiedCell);
    console.log(originalCell);
    const originalStockCell = originalCell;
    // isolate cell that contains simulated stock
    const cellToChange = modifiedCell;

    // previous day is day that slider was on right before current day
    const previousDay = allChanges[allChanges.length - 2];
    console.log(previousDay);
    // negative number if user is going forwards in time (further from day 0) right direction on slider

    const allActiveDaysArray = [];

    // if user moved backwards in time (left direction on slider, got closer to day 0)
    if (previousDay > day) {

        // this for loop works only if user is going backwards in time (left direction on slider)
        for (let i = previousDay - 1; i >= day; i--) {
    
            allActiveDaysArray.push(i);
    
    
        }
        let allDaysPurchaseTotal = 0;
    
        // for each day in the days array
        allActiveDaysArray.forEach(day => {
    
            let dayPurchaseTotal = 0;
    
            // if loop is on day 0
            if (day === 0) {
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
    
        changeCellValue(allDaysPurchaseTotal, day);



    // if user moved forwards in time (right direction on slider, got closer to last simulated day)
    } else if (previousDay < day) {
        
        for (let i = previousDay + 1; i <= day; i++) {
    
            allActiveDaysArray.push(i);
    
    
        }

        let allDaysPurchaseTotal = 0;

        allActiveDaysArray.forEach(day => {

            let dayPurchaseTotal = parseInt(purchasesDiv.childNodes[day].textContent.split(' ')[1]);

            allDaysPurchaseTotal -= dayPurchaseTotal;

        })

        console.log(allDaysPurchaseTotal)

        changeCellValue(allDaysPurchaseTotal, day);

    }

}

// function findCells() {

//     // isolates the cell that needs to be changed
//     const cellToChange = modifiedCell;
//     const originalStockCell = originalCell;

//     const targetedCells = {
//         cellToChange: cellToChange,
//         originalStockCell: originalStockCell
//     }   

//     return targetedCells;

// }

function changeCellValue(dailyPurchaseTotal, day) {

    const cellToChange = modifiedCell;
    // const originalStockCell = originalCell;

    // const targetedCells = findCells();

    // const cellToChange = targetedCells.cellToChange;

    // gets the current stock position (value that is currently in that cell)
    const currentStock = parseInt(cellToChange.textContent);
 
    cellToChange.textContent = currentStock + dailyPurchaseTotal;

}
