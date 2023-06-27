import React, { useState, useEffect} from 'react';
import Cookies from 'js-cookie';

function Head(){
  return(
    <head>
    <title>Currency Converter</title>
    <link rel="stylesheet" type="text/css" href="/styles/styles.css" />
    <link id="Link1" rel="icon" href="/images/favicon.ico" type="image/png" />
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


function ConverterForm() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      const cookieValue = Cookies.get('ConversionHistory');
      console.log(cookieValue);
      if (cookieValue) {
        const cookieDataArray = cookieValue.split(',');
        //setData(parsedData);

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

        setData(mappedData);
      }
    };
  
    fetchData();
  }, []);

  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('CAD');
  const [toCurrency, setToCurrency] = useState('USD');
  const [errorMsg, setErrorMsg] = useState('');
  const [outputResult, setOutputResult] = useState('00.00');

  const handleInputChange = (e) => {
    let dec = e.target.value;

    // Remove any non-numeric characters except decimal point
    dec = dec.replace(/[^0-9.]/g, '');

    // Remove leading zeros
    dec = dec.replace(/^0+/, '');
    
    // Limit decimal places to 4
    const decimalIndex = dec.indexOf('.');
    if (decimalIndex !== -1 && dec.length > decimalIndex + 5) {
      dec = dec.slice(0, decimalIndex + 5);
    }
    setAmount(dec);
  };
  

  const saveConversionHistory = (amount, fromCurrency, toCurrency, outputResult) => {
    // Send a POST request to the controller endpoint
    fetch(`http://localhost:5000/convertHistory?amount=${amount}&from=${fromCurrency}&to=${toCurrency}&result=${outputResult}&addRow=True`)
      .then(response => response.json())
      .then(data => {
        console.log(data.toString());
        // Conversion saved successfully
        console.log('Conversion saved');
        var responseData = data.result;
        console.log(responseData);
        Cookies.set("ConversionHistory",responseData);
        //setTableData(newTableData);
      })
      .catch(error => {
        // Error making the request
        console.error('Request error:', error);
      });
    }

  const handleConvertClick = () => {
    const parsedAmount = parseFloat(amount);
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

    if (newErrorMsg !== '') {
      console.log(newErrorMsg);
      setErrorMsg(newErrorMsg);
      setOutputResult(newErrorMsg);
    } else {
      // Make an HTTP request to the server-side endpoint
      fetch(`http://localhost:5000/api/convert?amount=${parsedAmount}&from=${fromCurrency}&to=${toCurrency}`)
        .then((response) =>  response.json())
        .then((data) => {        
          newOutputResult = `${data.result}`;
          setOutputResult(newOutputResult);
          console.log(newOutputResult)     
          document.getElementById('outputResult').style.color = 'green';
          document.getElementById('outputResult').style.fontSize = 'big';
          saveConversionHistory(parsedAmount,fromCurrency,toCurrency,newOutputResult);
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




  return (
    <div className="content">
      <span className="card">
        <label htmlFor="inputAmount">Amount:</label>
        <input type="text" id="inputAmount" name="amount" placeholder="00.00"  value={amount}
        onInput={(e) => setAmount(e.target.value)} onChange={handleInputChange} />
        <div id="inputsDiv">
          <label htmlFor="inputFrom" className="centerLabel">From:</label>
          <select  value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} id="inputFrom" name="from" className="inputs" >
            <option value="CAD" selected="selected">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CNY">CNY</option>
            {/* Add more options as needed */}
          </select>
          <label htmlFor="inputTo" className="centerLabel">To:</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} id="inputTo" className="inputs" name="to">
            <option value="CAD">CAD</option>
            <option value="USD" selected="selected">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CNY">CNY</option>
            {/* Add more options as needed */}
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
          <tbody> {data.map((data, index) => (
            <tr key={index}>
              <td>{data.amount}</td>
              <td>{data.from}</td>
              <td>{data.to}</td>
              <td>{data.result}</td>
            </tr>))}
          </tbody>
        </table>
        <p id="smallText">(Last Five Conversions)</p>
      </span>
      <div className="content2">
        <span className="cardER" id="cardER">
          <p id="latestPull">Exchange Rates as per latest pull.</p>
          <table id="exchangeRates">
            <thead>
              <tr>
                <th></th>
                <th>CAD</th>
                <th>USD</th>
                <th>GBP</th>
                <th>EUR</th>
                <th>CNY</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <p>
        Written in C# and .NET (with JavaScript) by David Wagner - 2023 <br />
        <br />
        <a href="https://github.com/devdavidwagner/CurrencyConverter">
          <img src="/images/GitHub-Mark.png" alt="GitHub" width="20" height="20" style={{ verticalAlign: 'middle' }} /> Github Repository
        </a>
        <a href="https://www.linkedin.com/in/david-karl-wagner/">
          <img src="/images/LinkedIn-Mark.PNG" alt="LinkedIn" width="20" height="20" style={{ verticalAlign: 'middle', paddingLeft: '25px' }} /> My LinkedIn
        </a>
      </p>
      <p>
        Exchange Rates pulled from <a href="https://freecurrencyapi.com/">Free Currency API</a>
      </p>
    </footer>
  );
}

function App() {
  return (
    <div>
      <Head/>
      <Header />
      <ConverterForm />
      <Footer />
    </div>
  );
}

export default App;
