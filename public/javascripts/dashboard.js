

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

allItemNames.forEach(itemName => {

    itemName.addEventListener('click', changeBuyPercentage);

})
    

// console.log(modifiedCell);

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

    localStorage.clear();



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

function getPurchaseTotals() {

    // pull everything out of local storage and put into an array of objects
    const allPurchases = [];

    const purchaseRecordsArray = Object.keys(localStorage);

    purchaseRecordsArray.forEach(record => {
        const purchaseObj = {};

        purchaseObj['purchase'] = JSON.parse(localStorage.getItem(record));
        allPurchases.push(purchaseObj);

    })

    const purchasesPerDayMoreInfo = {};

    allPurchases.forEach(purchaseRecord => {

        // if date is already a key in the more info object
        if (purchasesPerDayMoreInfo[purchaseRecord.purchase.date]) {

            purchasesPerDayMoreInfo[purchaseRecord.purchase.date].push(purchaseRecord.purchase.name);
        
        // if date not already a key in the more info object
        } else {
            purchasesPerDayMoreInfo[purchaseRecord.purchase.date] = [purchaseRecord.purchase.name];

        }
    })
    // returns all purchases sorted by date, regardless of position on slider (has just the item names)
    return purchasesPerDayMoreInfo;

}

// function findDailyPurchaseTotals(day) {

//     // isolate cell that contains original stock for that item
//     const originalStockCell = originalCell;
//     // isolate cell that contains simulated stock
//     const cellToChange = modifiedCell;

//     // previous day is day that slider was on right before current day
//     const previousDay = allChanges[allChanges.length - 2];
//     console.log(previousDay);
//     // negative number if user is going forwards in time (further from day 0) right direction on slider


//     // pull everything out of local storage and put into an array of objects
//     const allPurchases = [];

//     const purchaseRecordsArray = Object.keys(localStorage);

//     purchaseRecordsArray.forEach(record => {
//         const purchaseObj = {};

//         purchaseObj['purchase'] = JSON.parse(localStorage.getItem(record));
//         allPurchases.push(purchaseObj);

//     })

//     console.log(allPurchases[0].purchase);

//     const purchasesPerDay = {};

//     allPurchases.forEach(purchaseRecord => {
//         if (purchasesPerDay[purchaseRecord.purchase.date]) {
//             purchasesPerDay[purchaseRecord.purchase.date] += 1
//         } else {
//             purchasesPerDay[purchaseRecord.purchase.date] = 1;
//         }

//     })
//     // {The Lion King: 4}
//     console.log(purchasesPerDay);

    





//     const allActiveDaysArray = [];

//     // if user moved backwards in time (left direction on slider, got closer to day 0)
//     if (previousDay > day) {

//         // this for loop works only if user is going backwards in time (left direction on slider)
//         for (let i = previousDay - 1; i >= day; i--) {
    
//             allActiveDaysArray.push(i);
    
    
//         }
//         let allDaysPurchaseTotal = 0;
    
//         // for each day in the days array
//         allActiveDaysArray.forEach(day => {
    
//             let dayPurchaseTotal = 0;
    
//             // if loop is on day 0
//             if (day === 0) {
//                 // purchase total for day 0 (which is implied) is original stock - all days total
//                 dayPurchaseTotal = parseInt(originalStockCell.textContent) - allDaysPurchaseTotal - parseInt(cellToChange.textContent);
//                 console.log(`Day 0 purchase total: ${dayPurchaseTotal}`);
    
//             } else {
//                 // need to change this so it reads from localStorage
//                 dayPurchaseTotal = parseInt(purchasesDiv.childNodes[day].textContent.split(' ')[1]);
    
//             }
//             // calculate number of purchases on that day for each item and add to total
//             allDaysPurchaseTotal += dayPurchaseTotal
//         });
    
//         console.log(allDaysPurchaseTotal);
    
//         changeCellValue(allDaysPurchaseTotal, day);



//     // if user moved forwards in time (right direction on slider, got closer to last simulated day)
//     } else if (previousDay < day) {
        
//         for (let i = previousDay + 1; i <= day; i++) {
    
//             allActiveDaysArray.push(i);
    
    
//         }

//         let allDaysPurchaseTotal = 0;

//         allActiveDaysArray.forEach(day => {

//             let dayPurchaseTotal = parseInt(purchasesDiv.childNodes[day].textContent.split(' ')[1]);

//             allDaysPurchaseTotal -= dayPurchaseTotal;

//         })

//         console.log(allDaysPurchaseTotal)

//         changeCellValue(allDaysPurchaseTotal, day);

//     }

// }

function getAllDates() {

    const startDate = new Date();

    const numOfDaysToSimulate = parseInt(slider.getAttribute('max'));

    let count = 2;

    const datesObject = {1: startDate.toISOString().slice(0, 10)};

    for (let i = 0; i < numOfDaysToSimulate - 1; i++) {

        startDate.setDate(startDate.getDate() + 1);
        const nextDate = startDate.toISOString().slice(0, 10);

        datesObject[count] = nextDate;

        count++

    }

    return datesObject;
}

function getSliderDates(day) {

    // day = 1

    const allActiveDaysArray = [];
    // previousDay = 0
    const previousDay = allChanges[allChanges.length - 2];

    // if user moved backwards in time (left direction on slider, got closer to day 0
    // 1 > 0
    if (previousDay > day) {

        // this for loop works only if user is going backwards in time (left direction on slider)
        for (let i = previousDay; i > day; i--) {
            // i = previousDay
            // i = 1
            allActiveDaysArray.push(i);
        } 
    // 0 < 1
    } else if (previousDay < day) {

        for (let i = previousDay + 1; i <= day; i++) {
            // i = 1
            allActiveDaysArray.push(i);
    
        }

    }

    return allActiveDaysArray;
}

function calculatePurchaseTotals(sliderDay) {

    // current day that the user has switched to on the slider
    // day = 1
    const day = sliderDay;

    // previous day is day that slider was on right before current day
    // previousDay = 0
    const previousDay = allChanges[allChanges.length - 2];
    // console.log(previousDay);

    // all item purchase records grouped by each date of simulation
    const allPurchaseRecords = getPurchaseTotals();
    // console.log(allPurchaseRecords);
    // console.log(allPurchaseRecords);
    // gets all possible dates in simulation
    const allDates = getAllDates();
    // console.log(allDates);
    // gets just the dates included in most recent move of slider
    const sliderDates = getSliderDates(day);
    // sliderDates = 1
    console.log(sliderDates);

    const itemNamesPurchasedPerDay = [];
    
    // for each date included in slider move
    sliderDates.forEach(date => {
        // date = 1

        let purchasesThatDay = [];
        // if on day 0
        if (date === 0) {
            // get purchase totals for day 1
            // purchasesThatDay = [0];
            purchasesThatDay = allPurchaseRecords[allDates[1]];
            // day 0 holds purchase totals for day 1 now
        } else {
            // otherwise, get the purchase records for the current slider date
            // purchasesThatDay = allPurchaseRecords[allDates[1]]
            // purchasesThatDay = allPurchaseRecords[2019-04-14]
            purchasesThatDay = allPurchaseRecords[allDates[date]];
            //  purchasesThatDay = ['chair']
        }
        itemNamesPurchasedPerDay.push(purchasesThatDay);
    });
    // ['chair']
    console.log(itemNamesPurchasedPerDay);

    // an array of objects with the purchase QTYs of each item per day inluded in the slider move
    const itemTotalsPerDay = [];

    // loop through each day in array
    itemNamesPurchasedPerDay.forEach(sliderDay => {
        // inside of that one array [] = 'chair'

        const itemTotals = {};
        
        
        // loop through items purchased that day
        // item is 'chair'
        sliderDay.forEach(item => {

            // if item already exists as key value pair in the object, increment by 1
            if (itemTotals[item]) {
                // console.log(itemTotals);
                itemTotals[item] += 1;
            // else establish new key value pair
            } else {
                // console.log(itemTotals);
                itemTotals[item] = 1;
            }
        })
        // [{'chair': 1}]
        itemTotalsPerDay.push(itemTotals);

    })
    // [{'chair': 1}]
    // console.log('--------------- itemTotalsPerDay ----------------');
    console.log(itemTotalsPerDay);
    // console.log('--------------- itemTotalsPerDay ----------------');

    // console.log(itemTotalsPerDay);
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
                changeCellValue(item, itemTotal, day);
            // if slider is going to the right (towards last simulation day)
            // 0 < 1
            } else if (previousDay < day) {
                // call changeCellValue with that item, negative of that item's total, and the current slider day
                changeCellValue(item, -itemTotal, day);
            } else if (previousDay > day) {
                // item = bench, itemTotal = 1, day = 2
                changeCellValue(item, itemTotal, day);
            }
        }

    })


}


function changeCellValue(purchasedItem, itemTotal, day) {

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
            // console.log('this is running');
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

function changeBuyPercentage(e) {

    console.log(e.target.textContent);
    optionsDiv.innerHTML = '';

    optionsDiv.innerHTML = `
    <form action="/adjustitem" method="POST">
        <h3>Increase purchase likelihood for ${e.target.textContent}</h3>
        <input type="hidden" name="item" value="${e.target.textContent}">
        <select name="percentLikelihood">
            <option name="10" value="10">10%</option>
            <option name="20" value="20">20%</option>
            <option name="50" value="50">50%</option>
        </select>
    
        <button type="submit">Submit</button>

    </form>
    `

}

// sendPost();

getPurchaseRecords();

