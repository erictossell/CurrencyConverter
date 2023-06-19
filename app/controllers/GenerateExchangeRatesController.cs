using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CurrencyConverter.Controllers;

namespace CurrencyConverter.Controllers
{
    [Route("/generateExchangeRates")]
    public class GenerateExchangeRatesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get(string from, string to)
        {   
            string exchangeRate = "";          
            exchangeRate = CurrencyConverter.RetrieveRate(from, to);
            return Ok(new { success = true, result = exchangeRate });
        }
    }
}