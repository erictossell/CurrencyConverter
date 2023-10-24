using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using CurrencyConverter.Helpers;
using System;


namespace CurrencyConverter.Controllers
{
    [ApiController]
    [Route("/retrieveAll")]
    public class RetrieveAllCurrenciesController  : ControllerBase
    {
        private readonly YourDbContext  _context;

        public RetrieveAllCurrenciesController(YourDbContext context)
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
                outputArray.Add(c.NameCode.ToString());
            }

            return outputArray;
        }

    }
}