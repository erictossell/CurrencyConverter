using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CurrencyConverter.Helpers;

namespace app.controllers
{
    [Route("/addCurrency")]
    public class AddCurrencyController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get(string newCurrency)
        {    
            CurrencyAPI api = new CurrencyAPI();
            var exchangeRate = api.Get($"https://api.freecurrencyapi.com/v1/latest?apikey=x0fISZ5yVuubfp91QA5YJyisbCvxqKkMMpjkOdkc&base_currency={newCurrency}");
            Console.WriteLine(exchangeRate.ToString());
            return Ok(new { success = true, result = exchangeRate });
        }


    }
}