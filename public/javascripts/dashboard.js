// query selectors
const simulateButton = document.querySelector('[data-simulate]');
const waitingDiv = document.querySelector('[data-waiting]');
const addItemButton = document.querySelector('[data-add-item]');
const moreItemsDiv = document.querySelector('[data-more-items]');
const slider = document.querySelector('.slider');
const purchasesDiv = document.querySelector('[data-hidden-purchases');
const simulatedCells = document.querySelectorAll('[data-simulated-stock]');
const modifiedCell = document.querySelectorAll('[data-modified]');
const originalCells = document.querySelectorAll('[data-sim-modified]');
const originalStockCells = document.querySelectorAll('[data-original-stock]');
const whatDayDiv = document.querySelector('[data-what-day]');
const resetButton = document.querySelector('[data-reset-sim]');
const modifiedItems = document.querySelectorAll('[data-item-changed]');
const allItemNames = document.querySelectorAll('[data-item-name]');
const optionsDiv = document.querySelector('[data-show-options]');
const allDivs = document.querySelectorAll('div');

// -------------- event listeners ------------------



// attaches event listener to item names for purchase likelihood changes
allItemNames.forEach(itemName => {

    itemName.addEventListener('click', changeBuyPercentage);

})

// text styling based on background color
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

// clears local storage and prints "calculating" text to page
simulateButton.addEventListener('click', function() {

    localStorage.clear();



    const h2 = document.createElement('h2');
    h2.textContent = 'Calculating....';

    waitingDiv.append(h2);

})

// adds another item form to the add items modal
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

// global object that keeps track of slider value changes
allChanges = [];

// looks for a change in slider value
slider.addEventListener('change', pullDateFromSlider);

// -------------------- functions ------------------------

// gets the day that user changed to on the slider
function pullDateFromSlider() {

    // get the max value (last simulated day) from slider
    const startDay = parseInt(slider.getAttribute('max'));

    // what day user has switched to
    let day = parseInt(slider.value);
    // console.log(day);

    if (day != startDay && day != 0) {
        
        whatDayDiv.textContent = `Day ${day}`;
    } else {
        
        whatDayDiv.textContent = ``;
    }

    // if this is the first time user is moving the slider
    if (allChanges.length === 0) {
        // push the starting (max) value to the array to start with
        allChanges.push(startDay);
    }

    // push the current day user is on the allChanges
    allChanges.push(day);
    // console.log(allChanges);

    calculatePurchaseTotals(day);


}

function calculatePurchaseTotals(sliderDay) {

    // current day that the user has switched to on the slider
    const day = sliderDay;

    // previous day is day that slider was on right before current day
    const previousDay = allChanges[allChanges.length - 2];
    // console.log(previousDay);

    // all item purchase records grouped by each date of simulation
    const allPurchaseRecords = getPurchaseTotalsFromLocalStorage();

    // gets all possible dates in simulation
    const allDates = getAllDates();

    // gets just the dates included in most recent move of slider
    const sliderDates = getSliderDates(day);

    // purchase records just for dates included in move of slider
    const relevantPurchases = relevantPurchaseRecords(sliderDates, allPurchaseRecords, allDates);

    // an array of objects with the purchase QTYs of each item per day inluded in the slider move
    const itemTotalsPerDay = purchaseTotals(relevantPurchases);

    console.log(itemTotalsPerDay);

    // for each day
    // for each object in item totals per day
    itemTotalsPerDay.forEach(itemTotalsThatDay => {
        // for each item total that day
        // item = chair
        for (item in itemTotalsThatDay) {
            // isolate the item total
            // chair: 1, therefore itemTotal = 1
            const itemTotal = itemTotalsThatDay[item];
            // if the slider is going to the left and slider value is at day 0 now
            if (previousDay > day && day === 0) {
                // call changeCellValue with that item, that item's total, and the current slider day
                changeCellValue(item, itemTotal);
            // if slider is going to the right (towards last simulation day)
            // 0 < 1
            } else if (previousDay < day) {
                // call changeCellValue with that item, negative of that item's total, and the current slider day
                changeCellValue(item, -itemTotal);
            } else if (previousDay > day) {
                // item = bench, itemTotal = 1, day = 2
                changeCellValue(item, itemTotal);
            }
        }

    })


}

// changes cell value according to purchased item and total inventory purchased that day
function changeCellValue(purchasedItem, itemTotal) {

    let simulatedCell = '';

    const changedCells = modifiedItems;

    for (let i = 0; i < allItemNames.length; i++) {
        // if item name in table equals the purchased item
        // allItemNames[1].textContent = 'chair', purchasedItem = 'chair'
        if (allItemNames[i].textContent === purchasedItem) {
            // slide over to the right and find the correct simulated cell for that item in the table
            //simulatedCells[1]
            simulatedCell = simulatedCells[i];
        }

    }
    // set that simulated cell's value equal to its current value + purchase QTY
    // simulatedCell.textContent = 25 - 1 = 24
    simulatedCell.textContent = parseInt(simulatedCell.textContent) + itemTotal;


    // handle background color
    changedCells.forEach(cell => {

        const cellToChangeColor = cell.parentElement.children[6];

        const bgToRemove = cellToChangeColor.classList[1];
        

        cellToChangeColor.classList.remove(bgToRemove);


        const originalStock = parseInt(cell.parentElement.children[5].textContent);
        const simulatedStock = parseInt(cell.parentElement.children[6].textContent);




        if (originalStock - simulatedStock > 100) {
            cellToChangeColor.classList.add('darker-red');
            cellToChangeColor.classList.add('text-light');
        } else if (originalStock - simulatedStock > 50 && originalStock - simulatedStock <= 100) {
            cellToChangeColor.classList.add('bg-danger');
            cellToChangeColor.classList.remove('text-light');
        } else if (originalStock - simulatedStock > 0 && originalStock - simulatedStock <= 50) {
            cellToChangeColor.classList.add('bg-warning');
            cellToChangeColor.classList.remove('text-light');
        } else if (originalStock - simulatedStock === 0) {
            cellToChangeColor.classList.remove(cellToChangeColor.classList[1]);
            cellToChangeColor.classList.remove('text-light');
        }

    })

    
}

// gets purchase records out of local storage
function getPurchaseRecords() {


    fetch('/purchaserecords')
    .then(function(response) {
        return response.json()
    })
    .then(purchaseData => {
        let count = 0;
        purchaseData.forEach(purchase => {
            localStorage.setItem(`purchase #${count}`, purchase);
            count++;
        })
    })
}

// pop up form for changing likelihood of purchase for an item 
function changeBuyPercentage(e) {

    console.log('This is e.target.textContent: ', + e.target.textContent);
    optionsDiv.innerHTML = '';

    optionsDiv.innerHTML = `
        <form action="/adjustitem" method="POST">
        <input type="hidden" name="item" value="${e.target.textContent}">
        <select name="percentLikelihood">
            <option value="" disabled selected>Increase purchase likelihood for ${e.target.textContent}</option>
            <option name="10" value="10">10%</option>
            <option name="20" value="20">20%</option>
            <option name="50" value="50">50%</option>
        </select>
        
        <button type="submit">Submit</button>
        
        </form>
    `
    
    
}

getPurchaseRecords();




