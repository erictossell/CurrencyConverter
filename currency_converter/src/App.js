import React, { useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import config from './config';
import Cleave from 'cleave.js/react';


function Head(){
  return(
    <head>
    <title>Currency Converter</title>
    <link rel="stylesheet" type="text/css" href="/styles/styles.css" />
    <link id="Link1" rel="icon" href="/images/favicon.ico" type="image/png" />
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"></meta>
  </head>
  );
}

function Header() {
  return (
    <header>
      <h1>Currency Converter</h1>
    </header>
  );
}

function ExchangeRateTable() {
  const apiUrl = process.env.NODE_ENV === 'production' ? config.production.apiUrl : config.development.apiUrl;

  const [currenciesUsed, setCurrenciesUsed] = useState([
    "CAD",
    "USD",
    "GBP",
    "EUR",
    "CNY",
  ]);
  currenciesUsed.forEach((c) => {
    console.log("EXCHANGE RATE: " + c);
  });
  const [cookieVals, setCookieVals] = useState([]); // Initialize as an empty array
  const promises = [];

  currenciesUsed.forEach((c) => {
    console.log("EXCHANGE RATE after CU cookie: " + c);
  });

  useEffect(() => {
    // Call UpdateExchangeRateTable when the component is mounted
  //  UpdateExchangeRateTable("JPY");
  }, []); // The empty dependency array ensures this runs only once on mount


  const dataMatrix = Array(currenciesUsed.length)
    .fill(null)
    .map(() => Array(currenciesUsed.length).fill(null));

  function getCookieValue(cookieName) {
    const name = cookieName + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  function generateTableWithCookie() {
    var i = 0;
    console.log("GENERATE TABLE WITH COOKIE");
    const tableBody = document.querySelector("#exchangeRates tbody");
    let currencies = currenciesUsed;
    const cookieValueCU = getCookieValue("CurrenciesUsed");
    if(cookieValueCU !== null && cookieValueCU !== undefined){
      currencies = cookieValueCU.split(",");
    }
    
    

    tableBody.innerHTML = ""; // Clear existing table body
    const cookieName = `CurrencyExchange`; // Use a consistent cookie name
    const cookieValue = getCookie(cookieName);

    // Create the header row with currenciesUsed
    const headerRow = document.createElement("tr");
    const emptyHeader = document.createElement("th"); // Empty cell for the top-left corner
    headerRow.appendChild(emptyHeader);

    currencies.forEach((toCurrency) => {
      const tableHeader = document.createElement("th");
      tableHeader.textContent = toCurrency;
      headerRow.appendChild(tableHeader);
    });

    tableBody.appendChild(headerRow);
    const values = cookieValue.split(",");
    currencies.forEach((fromCurrency) => {
      const tableRow = document.createElement("tr");
      const tableHeader = document.createElement("th");
      tableHeader.textContent = fromCurrency;
      tableRow.appendChild(tableHeader);
      currencies.forEach((toCurrency) => {
          const tableData = document.createElement("td");
                   
          var symbol = values[i].split(/\d/)[0];
          var val = values[i].split(/^ *[^\d]+/)[1]; // Convert to a number
          const number = parseFloat(val);
          const roundedDec = number.toFixed(2);

          tableData.textContent = symbol + roundedDec.toString();
          console.log(
            "Adding table data: " + values[i] + " i = " + i.toString()
          );
          tableRow.appendChild(tableData);
        i++;
      });
      tableBody.appendChild(tableRow);
    });
    // No need to wait for promises, as this is the case where there's a cookie
  }

  function generateTableWithoutCookie() {
    const dataMatrix = Array(currenciesUsed.length)
      .fill(null)
      .map(() => Array(currenciesUsed.length).fill(null));
    const tableBody = document.querySelector("#exchangeRates tbody");
    tableBody.innerHTML = ""; // Clear existing table body
    const cookieName = `CurrencyExchange`; // Use a consistent cookie name
    const updatedCookieVals = []; // Copy the existing cookieVals array
    const requests = [];

    currenciesUsed.forEach((fromCurrency, fromIndex) => {
      currenciesUsed.forEach((toCurrency, toIndex) => {
        const request = fetch(
          `${apiUrl}/generateExchangeRates?from=${fromCurrency}&to=${toCurrency}`
        )
          .then((response) => response.json())
          .then((data) => {
            var result = data.result;   
            console.log("RESULT  B4 = " + result);                   
            var symbol = data.result.split(/\d/)[0];
            var val = data.result.split(/^ *[^\d]+/)[1]; // Convert to a number
            val = parseFloat(val);
            val = val.toFixed(2);
            result = symbol + val;
            console.log("RESULT = " + result);
            dataMatrix[fromIndex][toIndex] = result;
            return result;
          })
          .catch((error) => {
            console.error("Request error:", error);
            const errorResult = "Error";
            dataMatrix[fromIndex][toIndex] = errorResult;
            return errorResult;
          });

        requests.push(request);
      });
    });
    
    Promise.all(requests).then(() => {
      // Create the header row with currenciesUsed
      const headerRow = document.createElement("tr");
      const emptyHeader = document.createElement("th"); // Empty cell for the top-left corner
      headerRow.appendChild(emptyHeader);

      currenciesUsed.forEach((toCurrency) => {
        const tableHeader = document.createElement("th");
        tableHeader.textContent = toCurrency;
        headerRow.appendChild(tableHeader);
      });

      tableBody.appendChild(headerRow);

      dataMatrix.forEach((rowData, fromIndex) => {
        const tableRow = document.createElement("tr");
        const tableHeader = document.createElement("th");
        tableHeader.textContent = currenciesUsed[fromIndex];
        tableRow.appendChild(tableHeader);

        rowData.forEach((cellData) => {
          const tableData = document.createElement("td");
          var symbol = cellData.split(/\d/)[0];
          var val = cellData.split(/^ *[^\d]+/)[1]; // Convert to a number
          console.log("VALUE====" + val);
          const number = parseFloat(val);
          const roundedDec = number.toFixed(2);
          
          tableData.textContent = symbol + roundedDec.toString();

        //  tableData.textContent = cellData;
          tableRow.appendChild(tableData);
          updatedCookieVals.push(cellData);
        });

        tableBody.appendChild(tableRow);
      });

      if (updatedCookieVals.length > 0) {
        document.cookie = `${cookieName}=${updatedCookieVals.join(
          ","
        )}; expires=Thu, 1 Jan 2025 12:00:00 UTC; path=/`;
      }
    });
  }

  const cookieName = `CurrencyExchange`;
  const cookieValue = getCookie(cookieName);

  const cookieName2 = `CurrenciesUsed`;
  const cookieValue2 = getCookie(cookieName2);

  if (cookieValue !== null &&
    cookieValue.split(",").length ===
      currenciesUsed.length * currenciesUsed.length) {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("generate table with cookie 1");
      generateTableWithCookie();
    });
  }
  else if (cookieValue2 !== null && cookieValue2.split(',').length > 5) {
    document.addEventListener("DOMContentLoaded", function () {
      generateTableWithCookie();
      console.log("generate table with cookie 2");
    });
  }
  else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("generate table with cookie 3");
      generateTableWithoutCookie();
    });
  }

  function createAndSetCookie(currencies) {
    const cookieName = "CurrenciesUsed";
    const cookieValue = currencies.join(",");
    const expirationDate = new Date("2025-01-01").toUTCString();
    document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate}; path=/`;
  }

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null; // Cookie not found
  }

  const CURRENCY_COOKIE = "currenciesExchange";

  function loadExchangeCookie(currencyCodes) {
    var currencyExchange = getCookie(CURRENCY_COOKIE);
    if (currencyExchange != null) {
      var currencyCodes = currencyExchange.split(","); // Split the string into an array of codes
      // Loop through the currency codes
      currencyCodes.forEach(function (code) {
        code = code.trim(); // Trim whitespace
        if (!currenciesUsed.includes(code)) {
          currenciesUsed.push(code);
        }
      });
    }
  }

  // function updateCookie(cookieName, newValue, expirationDate) {
  //   // Set the updated cookie with the new value and optional expiration date
  //   document.cookie = `${cookieName}=${newValue}${expirationDate ? `; expires=${expirationDate}` : ''}; path=/`;
  // }

  function UpdateExchangeRateTable(newCurrency) {
    var currencies = currenciesUsed;
    var found = false;
    currencies.forEach((c) => {
      if(c == newCurrency){
        found = true;
      }
    })
    if(!found){
      currencies.push(newCurrency);
      setCurrenciesUsed(currencies);
  
      currenciesUsed.forEach((c) => {
        console.log("Update table: " + c);
      });
      createAndSetCookie(currenciesUsed);
      generateTableWithoutCookie();
    }

  }

  function UpdateSelectOptions(newCurrency) {
   
  }

  function setCurrencyInCookie(currencies) {
    const cookieName = "CurrencyExchange";
    const cookieValue = currencies.join(", "); // Convert the array to a comma-separated string
    document.cookie = `${cookieName}=${cookieValue}; expires=Thu, 1 Jan 2025 12:00:00 UTC; path=/`;
  }

  function getCurrencyFromCookie() {
    const cookieName = "CurrencyExchange"; // Replace with the actual cookie name
    const cookieValue = getCookie(cookieName);

    if (cookieValue) {
      // Split the cookie value and return it as an array
      return cookieValue.split(",").map((currency) => currency.trim());
    } else {
      return null; // Return null if the cookie is not found or empty
    }
  }

  function AddCurrencyDropdown() {
    const [newCurrency, setNewCurrency] = useState("JPY");

    const HandleAddClick = () => {
      UpdateExchangeRateTable(newCurrency.toUpperCase());
      UpdateSelectOptions(newCurrency.toUpperCase());
    };


    return (
      <span>
        <p>
          <select
            id="inputCurr"
            class="selectbox"
            className="selectbox"
            name="currencyAdd"
            onChange={(e) => setNewCurrency(e.target.value)}
          >
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="BGN">BGN - Bulgarian Lev</option>
            <option value="CZK">CZK - Czech Republic Koruna</option>
            <option value="DKK">DKK - Danish Krone</option>
            <option value="HUF">HUF - Hungarian Forint</option>
            <option value="PLN">PLN - Polish Zloty</option>
            <option value="RON">RON - Romanian Leu</option>
            <option value="SEK">SEK - Swedish Krona</option>
            <option value="CHF">CHF - Swiss Franc</option>
            <option value="ISK">ISK - Icelandic Króna</option>
            <option value="NOK">NOK - Norwegian Krone</option>
            <option value="HRK">HRK - Croatian Kuna</option>
            <option value="RUB">RUB - Russian Ruble</option>
            <option value="TRY">TRY - Turkish Lira</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="BRL">BRL - Brazilian Real</option>
            <option value="HKD">HKD - Hong Kong Dollar</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
            <option value="ILS">ILS - Israeli New Sheqel</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="KRW">KRW - South Korean Won</option>
            <option value="MXN">MXN - Mexican Peso</option>
            <option value="MYR">MYR - Malaysian Ringgit</option>
            <option value="NZD">NZD - New Zealand Dollar</option>
            <option value="PHP">PHP - Philippine Peso</option>
            <option value="SGD">SGD - Singapore Dollar</option>
            <option value="THB">THB- Thai Baht</option>
            <option value="ZAR">ZAR - South African Rand</option>
          </select>{" "}
          <button onClick={HandleAddClick}  id ="btn" >Add</button>
        </p>
      </span>
    );
  }

  return (
    <span className="cardER" id="cardER">
      <AddCurrencyDropdown />
      <table id="exchangeRates">
        <thead>
          <tr></tr>
        </thead>
        <tbody></tbody>
      </table>
    </span>
  );
}


function ConverterForm() {
  
  const apiUrl = process.env.NODE_ENV === 'production' ? config.production.apiUrl : config.development.apiUrl;
  const [formData, setFormData] = useState([]);
  const [selectKey, setSelectKey] = useState(0); 
      // Define a function to update the state based on the 'CurrenciesUsed' cookie
    const updateCurrenciesUsedFromCookie = () => {
        const savedCurrencies = Cookies.get('CurrenciesUsed');
        // Check if the cookie exists and is not empty
        if (savedCurrencies) {
          console.log("Updating currencies....");
          setCurrenciesUsed(savedCurrencies.split(','));
        }
      };

  useEffect(() => {
    // Call your fetchData function here
    fetchData();
 
    // Call the update function initially when the component mounts
    updateCurrenciesUsedFromCookie();
    // Set up an event listener to react to changes in the 'CurrenciesUsed' cookie
    window.addEventListener('storage', updateCurrenciesUsedFromCookie);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', updateCurrenciesUsedFromCookie);
    };
    // You can also provide a dependency array to control when this effect runs
  }, []);

  // Define the fetchData function
  const fetchData = () => {
    const cookieValue = Cookies.get('ConversionHistory');
    console.log(cookieValue);
    if (cookieValue) {
      const cookieDataArray = cookieValue.split(',');

      const mappedData = [];
      for (let i = 0; i < cookieDataArray.length; i += 4) {
        const dataObject = {
          amount: cookieDataArray[i],
          from: cookieDataArray[i + 1],
          to: cookieDataArray[i + 2],
          result: cookieDataArray[i + 3]
        };
        mappedData.push(dataObject);
      }
      setFormData(mappedData);
    }
  };

  
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('CAD');
  const [toCurrency, setToCurrency] = useState('USD');
  const [errorMsg, setErrorMsg] = useState('');
  const [outputResult, setOutputResult] = useState('00.00');
  const [currenciesUsed, setCurrenciesUsed] = useState([ "CAD",
  "USD",
  "GBP",
  "EUR",
  "CNY",]);

  useEffect(() => {
    const cookieValueCU = getCookieValue("CurrenciesUsed");
    if(cookieValueCU !== null && cookieValueCU !== undefined){
      setCurrenciesUsed(cookieValueCU.split(","));
    }  
  }, []); 


  function getCookieValue(cookieName) {
    const name = cookieName + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }
  

  const saveConversionHistory = (amount, fromCurrency, toCurrency, outputResult) => { 
      console.log("SAVE CONV HISTORY");
      // Read the existing cookie data
      var cookieName = "ConversionHistory";
      var responseData = '';
      var cookieValue = decodeURIComponent(getCookieValue(cookieName));
      console.log("COOK: " + cookieValue);

      if (cookieValue !== null && cookieValue !== "null") {
          responseData = cookieValue;
          if (responseData.split(',').length == 20) {
              var responseArray = responseData.split(',');
             // Take the next 4 elements from the end of the array
                        // Remove the last 4 elements
              responseArray.splice(-4);

              // Add the variables to the beginning
              responseArray.unshift(amount, fromCurrency, toCurrency, outputResult);

              // Join the modified array back into a string
              responseData = responseArray.join(',');
          }
          else{
              responseData =  cookieValue + `,${amount},${fromCurrency},${toCurrency},${outputResult},`;  
          }
    
        }
        else{
          responseData =  `${amount},${fromCurrency},${toCurrency},${outputResult},`;  
      }
      responseData = responseData.replace(/,$/, ''); // Remove the trailing comma using a regular expression

   
      // Set the updated data back into the cookie
    document.cookie = `${cookieName}=${encodeURIComponent(responseData)}; expires=Thu, 1 Jan 2025 12:00:00 UTC; path=/`;  
    fetchData();
  }
  

  const handleConvertClick = () => {
    let parsedAmount = parseFloat(amount); // Use let, not const
    parsedAmount = parsedAmount.toFixed(2);
    let newErrorMsg = '';
    let newOutputResult = '';

    

    if (amount === null || amount === '') {
      newErrorMsg = 'No amount value entered.';
    } else if (isNaN(parsedAmount)) {
      newErrorMsg = 'Invalid amount value. Please enter a valid integer or decimal.';
    } else if (parsedAmount < 0) {
      parsedAmount *= -1;
    }
    console.log(parsedAmount);

      
    let from = document.getElementById('inputFrom').value;
    console.log("FROM AT CLICK: " + from);
    let to = document.getElementById('inputTo').value;
    console.log("FROM AT CLICK: " + to);
    setFromCurrency(from);
    setToCurrency(to);
    parsedAmount = amount.replace(/,/g, '');

    if (newErrorMsg !== '') {
      console.log(newErrorMsg);
      setErrorMsg(newErrorMsg);
      setOutputResult(newErrorMsg);
    } else {
      let answerOut = "";
      // Make an HTTP request to the server-side endpoint
      fetch(`${apiUrl}/api/convert?amount=${parsedAmount}&from=${from}&to=${to}`)
        .then((response) => response.json())
        .then((data) => {
          var symbol = data.result.split(/\d/)[0]; // Replace 'symbol' with the correct property name
          console.log("SPLIT: " + data.result.split(/\d/)[0]);
          let parsedOutput = parseFloat(data.result.split(/[^0-9.]+/)[1]);
          if (!isNaN(parsedOutput)) {
            parsedOutput = parsedOutput.toFixed(2);
          } else {
            // Handle the case where parsing is not successful
            console.error("Failed to parse the value.");
          }
          answerOut =  symbol + parsedOutput;

          parsedAmount = parsedAmount;
          console.log(parsedOutput);
          document.getElementById('outputResult').style.color = 'green';
          document.getElementById('outputResult').style.fontSize = 'big';
          
          // Perform a second fetch to get the symbol
          return fetch(`${apiUrl}/generateExchangeRates?from=${to}&to=${from}`);
        })
        .then((symbolResponse) => symbolResponse.json())
        .then((symbolData) => {
          var symbol = symbolData.result.split(/\d/)[0]; // Replace 'symbol' with the correct property name
          console.log(`Symbol: ${symbol}`);      
          // Use the symbol as needed
          var fullOuput = answerOut;
          setOutputResult(fullOuput);           
          console.log("save conv history..");
          saveConversionHistory(symbol + parsedAmount, from, to, fullOuput);
        })
        .catch((error) => {
          console.error(error); // Log any errors
          newOutputResult = `${error}`; // Update with appropriate error handling
          setOutputResult(newOutputResult);
          document.getElementById('outputResult').style.color = 'red';
          document.getElementById('outputResult').style.fontSize = 'small';
        });
    }
    
  };

  const handleClickExchangeImg = () => {
    const selectFrom = document.getElementById("inputFrom");
    const selectTo = document.getElementById("inputTo"); 
    
    // Check if both selects have options selected
    if (selectFrom.selectedIndex !== -1 && selectTo.selectedIndex !== -1) {
      // Swap the selected options
      const optionFrom = selectFrom.options[selectFrom.selectedIndex];
      const optionTo = selectTo.options[selectTo.selectedIndex];
  
      // Swap the text and values
      const tempText = optionFrom.text;
      const tempValue = optionFrom.value;
      optionFrom.text = optionTo.text;
      optionFrom.value = optionTo.value;
      optionTo.text = tempText;
      optionTo.value = tempValue;
    }
  };


  
  
  return (
      <span className="card">
        <label htmlFor="inputAmount"  id="inputAmountLbl">Amount:</label>
        <Cleave className="input-numeral" placeholder="0.00" options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}}
         onChange={(e) => setAmount(e.target.value)} htmlFor="inputAmount"  id="inputAmount"/>
        <div id="inputsDiv">
          <label htmlFor="inputFrom" className="centerLabel">From:</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            id="inputFrom"
            name="from"
            class="selectbox"
            className="selectbox"
            key={selectKey} // Key to trigger re-render
            onClick={() => updateCurrenciesUsedFromCookie()}
          >
            {currenciesUsed.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <button onClick={handleClickExchangeImg} id ="exchangeImgBtn">
            <img src="/images/exchange.png" alt="Exchange Image" id="exchangeImg"></img>
          </button>

          <label htmlFor="inputTo" className="centerLabel">To:</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            id="inputTo"
            class="selectbox"
            className="selectbox"
            name="to"
            key={selectKey} // Key to trigger re-render
                onClick={() => updateCurrenciesUsedFromCookie()}
          >
            {currenciesUsed.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <button type="button" id="convertButton" onClick={handleConvertClick}>Convert:</button>
        <span id="outputResult" className="result">{outputResult} </span>
        <hr />
        <p id="convHistLabel">Conversion History</p>
        <table id="conversionHistory">
          <thead>
            <tr>
              <th>Amount</th>
              <th>From</th>
              <th>To</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody> {formData.map((data, index) => (
            <tr key={index}>
              <td>{data.amount}</td>
              <td>{data.from}</td>
              <td>{data.to}</td>
              <td>{data.result}</td>
            </tr>))}
          </tbody>
        </table>
      </span>
  );
}

function Footer() {
  return (
    <footer>
        <p>         
            Written in C# and .NET (with React + Javascript) by David Wagner - 2023 <br />
            <br />
            <a href="https://github.com/devdavidwagner/CurrencyConverter">
              <img src="/images/GitHub-Mark.png" alt="GitHub" width="20" height="20" style={{ verticalAlign: 'middle' }} /> Github Repository
            </a>
            <a href="https://www.linkedin.com/in/david-karl-wagner/">
              <img src="/images/LinkedIn-Mark.PNG" alt="LinkedIn" width="20" height="20" style={{ verticalAlign: 'middle', paddingLeft: '25px' }} /> My LinkedIn
            </a>
      </p>
    </footer>
  );
}

function App() {
  return (
  <div id="alphaDiv">
      <Head />
      <Header />
      <ConverterForm />
        <div className="content2">
          <ExchangeRateTable />
        </div>
      <Footer />
  </div>
  );
}

export default App;
