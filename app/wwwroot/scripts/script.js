const convertButton = document.getElementById('convertButton');
const inputAmount = document.getElementById('inputAmount');
const inputFrom = document.getElementById('inputFrom');
const inputTo = document.getElementById('inputTo');
const outputResult = document.getElementById('outputResult');

document.addEventListener('DOMContentLoaded', saveConversionHistory(null, "", "", 0, false));
document.addEventListener('DOMContentLoaded', retrieveRates());
document.addEventListener('DOMContentLoaded', updateLatestPull());

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
                    saveConversionHistory(amount, fromCurrency, toCurrency, data.result, true)              
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

function saveConversionHistory(amount, from, to, result, addRow) {
    var responseData = "";
    const maxConversions = 5;
    // Send a POST request to the controller endpoint
    if(result == "0"){result = "";}
    fetch(`/convertHistory?amount=${amount}&from=${from}&to=${to}&result=${result}&addRow=${addRow}`) 
    .then(response => response.json())
    .then(data => {
        console.log(data.toString());
        // Conversion saved successfully
        console.log('Conversion saved');
        responseData = data.result;   
        console.log(responseData)
        var historyTable = document.getElementById('conversionHistory').getElementsByTagName('tbody')[0];
        historyTable.innerHTML = '';
        var cells = responseData.split(",");     
        
        var newContent = cells.slice(cells.length - 4, cells.length).join('</td><td>');
        newContent = "<td>" + newContent + "</td>";
        console.log('cell length: ' + cells.length);
        
        for (let i = 4; i <= cells.length; i += 4) {
            var newRowIndex = 0;        
            var newRow = historyTable.insertRow(historyTable.rows.length);
            for (let j = i - 4; j < i; j++) {
                var newCell = newRow.insertCell();
                newCell.innerText = cells[j];
            }                          
        }
                     
    })
    .catch(error => {
        // Error making the request
        console.error('Request error:', error);
    });
}



function retrieveRates() {
    const currenciesUsed = ["CAD", "USD", "GBP", "EUR", "CNY"];
    var responseData = "";
    const maxConversions = 5;

    var tableBody = document.querySelector("#exchangeRates tbody");
    tableBody.innerHTML = ""; // Clear existing table body

    currenciesUsed.forEach((fromCurrency) => {
        var tableRow = document.createElement("tr");
        var tableHeader = document.createElement("th");
        tableHeader.textContent = fromCurrency;
        tableRow.appendChild(tableHeader);
        currenciesUsed.forEach((toCurrency) => {
            var cookieName = `${fromCurrency}-${toCurrency}`;
            var cookieValue = getCookie(cookieName);
            if (cookieValue != ""){
        
                var tableData = document.createElement("td");
                tableData.textContent = cookieValue; // Assuming `data.result` contains the exchange rate
                tableRow.appendChild(tableData);
            } 
            else {
                fetch(`/generateExchangeRates?from=${fromCurrency}&to=${toCurrency}`)
                    .then(response => response.json())
                    .then(data => {
                        setTimeCookie();
                        console.log(data.toString());
                        // Conversion saved successfully
                        console.log(`Exchange rate saved: from=${fromCurrency}&to=${toCurrency} result = ${data.result}`);
                        
                        var tableData = document.createElement("td");
                        tableData.textContent = data.result; // Assuming `data.result` contains the exchange rate
                        tableRow.appendChild(tableData);

                        var cookieName = `${fromCurrency}-${toCurrency}`;
                        var cookieValue = data.result;      
                        document.cookie = `${cookieName}=${cookieValue}; expires=Thu, 1 Jan 2025 12:00:00 UTC; path=/`;
                    })
                    .catch(error => {
                        // Error making the request
                        console.error('Request error:', error);
                    });
            }
        });
        

        tableBody.appendChild(tableRow);
    });
}
// Helper function to get the value of a cookie
function getCookie(name) {
    var cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? cookieValue.pop() : "";
}

// Helper function to set a cookie
function setCookie(name, value) {
    document.cookie = name + "=" + value;
}

function setTimeCookie(){
    setCookie("timeSet", new Date().toLocaleString());
}

function updateLatestPull() {
    const latestPullElement = document.getElementById('latestPull');
    const formattedDate = getCookieDatetime();
    latestPullElement.textContent = `Latest Exchange Rates as Per: ${formattedDate}`;
  }

function getCookieDatetime() {
    const cookie = getCookie("timeSet");

    return cookie;
  }
  