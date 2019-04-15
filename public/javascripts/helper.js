function relevantPurchaseRecords(dates, allPurchases, allDates) {

    const itemNamesPurchasedPerDay = [];
    // for each date included in slider move
    dates.forEach(date => {
        // date = 1

        let purchasesThatDay = [];
        // if on day 0
        if (date === 0) {

            // get purchase totals for day 1
            purchasesThatDay = allPurchases[allDates[1]];
            // day 0 holds purchase totals for day 1 now
        } else {
            // otherwise, get the purchase records for the current slider date
            // purchasesThatDay = allPurchaseRecords[allDates[1]]
            // purchasesThatDay = allPurchaseRecords[2019-04-14]
            purchasesThatDay = allPurchases[allDates[date]];
            //  purchasesThatDay = ['chair']
        }
        itemNamesPurchasedPerDay.push(purchasesThatDay);
    });

    return itemNamesPurchasedPerDay;

}

// gets just the dates included in slider move
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
// gets all dates included in the simulation
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

function purchaseTotals(purchasesArray) {

    const itemTotalsPerDay = [];

    // loop through each day in array
    purchasesArray.forEach(sliderDay => {
        // inside of that one array [] = 'chair'

        const itemTotals = {};
        
        
        // loop through items purchased that day
        sliderDay.forEach(item => {

            // if item already exists as key value pair in the object, increment by 1
            if (itemTotals[item]) {
                itemTotals[item] += 1;
            // else establish new key value pair
            } else {
                itemTotals[item] = 1;
            }
        })
        // [{'chair': 1}]
        itemTotalsPerDay.push(itemTotals);

    })
    return itemTotalsPerDay;
}

function getPurchaseTotalsFromLocalStorage() {

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
