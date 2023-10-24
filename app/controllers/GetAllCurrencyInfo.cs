using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using CurrencyConverter.Helpers;
using System;


namespace CurrencyConverter.Controllers
{
    [ApiController]
    [Route("/retrieveCurrencyInfo")]
    public class GetAllCurrencyInfo  : ControllerBase
    {
        private readonly YourDbContext  _context;

        public GetAllCurrencyInfo(YourDbContext context)
        {
            _context = context;
        }   

        [HttpGet]
        public IActionResult Get()
        {  
           List<string> results = GetCurrencies();
            return Ok(new { success = true, result = results });
        }

        private List<string> GetCurrencies()
        {
            List<string> outputArray = new List<string>();
            var currencies = _context.Currencies;
            foreach (var c in currencies)
            {
                string info = "Name: " + c.FullName + "<br>Country: " + c.Country +
                 "<br>Code: " + c.NameCode + "<br>Base Exchange Rate (USD) $" + c.BaseExchangeUSD;
                 outputArray.Add(info);
            }
           
            return outputArray;
        }

    }
}