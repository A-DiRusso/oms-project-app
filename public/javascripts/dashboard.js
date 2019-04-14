

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

const allDivs = document.querySelectorAll('div');

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

    console.log('button clicked');
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

    // get the max value (last day) of slider
    const startDay = parseInt(slider.getAttribute('max'));

    // what day user is on
    let day = parseInt(slider.value);

    if (day != startDay && day != 0) {
        
        whatDayDiv.textContent = `Day ${day}`;
    } else {
        
        whatDayDiv.textContent = ``;
    }

    // if this is the first time user is moving the slider
    if (allChanges.length === 0) {
        allChanges.push(startDay);
    }

    // push the current day user is on the allChanges
    allChanges.push(day);

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

    const allActiveDaysArray = [];

    const previousDay = allChanges[allChanges.length - 2];

    // if user moved backwards in time (left direction on slider, got closer to day 0)
    if (previousDay > day) {

        // this for loop works only if user is going backwards in time (left direction on slider)
        for (let i = previousDay - 1; i >= day; i--) {
    
            allActiveDaysArray.push(i);
        } 
    } else if (previousDay < day) {

        for (let i = previousDay + 1; i <= day; i++) {
    
            allActiveDaysArray.push(i);
    
        }

    }

    return allActiveDaysArray;
}

function calculatePurchaseTotals(sliderDay) {

    const day = sliderDay;

    // previous day is day that slider was on right before current day
    const previousDay = allChanges[allChanges.length - 2];

    // all item purchase records grouped by each date of simulation
    const allPurchaseRecords = getPurchaseTotals();
    const allDates = getAllDates();

    const sliderDates = getSliderDates(day);


    // an array with arrays of just the item names purchased on each date
    // console.log('--------------- allPurchaseRecords ----------------');
    // console.log(allPurchaseRecords);
    // console.log('--------------- allPurchaseRecords ----------------');
    // this is undefined at day 0
    const itemNamesPurchasedPerDay = [];
    
    // for each date that the slider passed over
    sliderDates.forEach(date => {

        let purchasesThatDay = [];

        if (date === 0) {
            purchasesThatDay = [0];
        } else {

            purchasesThatDay = allPurchaseRecords[allDates[date]];
        }
        console.log(date);
        // pushs an array with the item names of
        itemNamesPurchasedPerDay.push(purchasesThatDay);
    });
    // console.log('--------------- itemNamesPurchasedPerDay ----------------');
    // console.log(itemNamesPurchasedPerDay);
    // console.log('--------------- itemNamesPurchasedPerDay ----------------');

    // an array with the purchase QTYs of each item per day
    const itemTotalsPerDay = [];

    // loop through each day in array
    itemNamesPurchasedPerDay.forEach(day => {

        // console.log(day);

        const itemTotals = {};
        
        // if user is on Day 0
        // item totals purchased is original stock - all totals for previous days added together
        // if (!day) {

        //     itemTotals[item] += 1;
        // }
        
        // loop through items purchased during that day
        day.forEach(item => {

            // if user is at Day 0
            // if (item === 0) {

            //     const allChangedItems = modifiedItems;

            //     allChangedItems.forEach(changedItem => {

            //         let originalStockCell = '';

            //         for(let i = 0; i < allItemNames.length; i++) {

            //             if (allItemNames[i] === changedItem) {

            //                 originalStockCell = originalStockCells[i];

            //             }

            //         }

            //         console.log(changedItem.textContent);
            //         console.log(originalStockCell.textContent);
            //         console.log(itemTotals);
            //         console.log(itemTotals[changedItem.textContent]);
            //         console.log(parseInt(originalStockCell.textContent) - itemTotals[changedItem]);
            //         itemTotals[changedItem] += parseInt(originalStockCell.textContent) - itemTotals[changedItem]

            //     })

            if (itemTotals[item]) {
                // console.log(itemTotals);
                itemTotals[item] += 1;
            } else {
                // console.log(itemTotals);
                itemTotals[item] = 1;
            }
        })

        itemTotalsPerDay.push(itemTotals);

    })
    // console.log('--------------- itemTotalsPerDay ----------------');
    // console.log(itemTotalsPerDay);
    // console.log('--------------- itemTotalsPerDay ----------------');

    // console.log(itemTotalsPerDay);

    itemTotalsPerDay.forEach(itemTotalsThatDay => {

        for (item in itemTotalsThatDay) {

            const itemTotal = itemTotalsThatDay[item];
            if (previousDay > day) {
                
                changeCellValue(item, itemTotal, day);
            // if slider is going to the right (towards last simulation day)
            } else if (previousDay < day) {
                changeCellValue(item, -itemTotal, day);
            }
        }

    })


}


function changeCellValue(purchasedItem, itemTotal, day) {

    let simulatedCell = '';

    const changedCells = modifiedItems;

    // if day is 0, loop through all modified cells and changed simulated cells to be = to original stock value
    if (day === 0) {

        const modifiedCells = modifiedItems;

        modifiedCells.forEach(cell => {
            const originalStock = parseInt(cell.parentElement.children[5].textContent);
            const cellToChange = cell.parentElement.children[6];

            cellToChange.textContent = originalStock
        })


    } else {

        for (let i = 0; i < allItemNames.length; i++) {
    
    
            if (allItemNames[i].textContent === purchasedItem) {
                simulatedCell = simulatedCells[i];
            } else {
            }
    
        }
    
        simulatedCell.textContent = parseInt(simulatedCell.textContent) + itemTotal;

    }

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
            console.log('this is running');
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

getPurchaseRecords();

