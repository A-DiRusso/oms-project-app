const simulateButton = document.querySelector('[data-simulate]');
const waitingDiv = document.querySelector('[data-waiting]');

console.log(simulateButton);


simulateButton.addEventListener('click', function() {

    console.log('button clicked');

    const h2 = document.createElement('h2');
    h2.textContent = 'Calculating....';

    waitingDiv.append(h2);

})



