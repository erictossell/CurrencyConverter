const convertButton = document.getElementById('convertButton');
const inputAmount = document.getElementById('inputAmount');
const inputFrom = document.getElementById('inputFrom');
const inputTo = document.getElementById('inputTo');
const outputResult = document.getElementById('outputResult');

convertButton.addEventListener('click', () => {
    var amount = parseFloat(inputAmount.value);
    const fromCurrency = inputFrom.value;
    const toCurrency = inputTo.value;
    var errorMsg = "";
    if(inputAmount.value == null || inputAmount.value == ""){
        errorMsg= "No amount value entered.";
    }
    else if(isNaN(amount)){
        errorMsg = "Invalid amount value. \nPlease enter a valid integer or decimal.";
    }
    else if(amount < 0){
        amount = amount * -1;
    }

    if(errorMsg != ""){
        console.log(errorMsg); 
        document.getElementById('outputResult').innerText = `${errorMsg}`; 
        document.getElementById('outputResult').style.color = 'red';
        document.getElementById('outputResult').style.fontSize = 'smaller';      
    }
    else{
        document.getElementById('outputResult').style.color = 'green';
        document.getElementById('outputResult').style.fontSize = 'big';  
        
        // Make an HTTP request to the server-side endpoint
        fetch(`/api/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
            .then(response => response.json())
            .then(data => {
                    console.log(data); 
                    document.getElementById('outputResult').innerText = `${data.result}`;
                    saveConversionHistory(amount, toCurrency, fromCurrency, data.result)               
            })
            .catch(error => {
                console.error(error); // Log any errors
                document.getElementById('outputResult').innerText = `${data.error}`;
                // Handle any errors
            });
    }    
});

function formatDecimal(input) {
    // Remove any non-numeric characters except decimal point
    input.value = input.value.replace(/[^0-9.]/g, '');
    
    // Remove leading zeros
    input.value = input.value.replace(/^0+/, '');
    
    // Limit decimal places to 4
    var decimalIndex = input.value.indexOf('.');
    if (decimalIndex !== -1 && input.value.length > decimalIndex + 5) {
        input.value = input.value.slice(0, decimalIndex + 5);
    }
}

function saveConversionHistory(amount, from, to, result) {

    // Create an object with the conversion data
    var conversionData = {
        amount: amount,
        from: from,
        to: to,
        result: result
    };

    var responseRetrieved = false;
    var responseData = "";

    // Send a POST request to the controller endpoint
    fetch('/convertHistory', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversionData)
    })
    .then(response => {
        // Handle the response from the server
        if (response.ok) {
            // Conversion saved successfully
            console.log('Conversion saved');
            responseData = response;
            responseRetrieved = true;
        } else {
        // Error saving conversion
        console.error('Error saving conversion');
        }
    })
    .catch(error => {
        // Error making the request
        console.error('Request error:', error);
    });

    if(responseRetrieved){
        var historyTable = document.getElementById('conversionHistory');
    
        // Create a new row
        var newRow = historyTable.insertRow();
        
        // Create cells for each column
        var amountCell = newRow.insertCell();
        var fromCell = newRow.insertCell();
        var toCell = newRow.insertCell();
        var resultCell = newRow.insertCell();
        
        // Set the content of each cell
        amountCell.textContent = amount;
        fromCell.textContent = from;
        toCell.textContent = to;
        resultCell.textContent = result;
    
        // Append the new row to the table
        historyTable.appendChild(newRow);
    }

  
}
    