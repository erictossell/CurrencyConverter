using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using CurrencyConverter.Helpers;
using System;


namespace CurrencyConverter.Controllers
{  
    [ApiController]
    [Route("/api/convert")]
    public class ConvertController : ControllerBase
    {      
        private readonly YourDbContext  _context;

        public ConvertController(YourDbContext context)
        {
            _context = context;
        }   

        [HttpGet]
        public IActionResult Get(decimal? amount, string from, string to)
        {
            if(amount.HasValue && amount.Value == 0){
                string symbol = CurrencyAPI.GetSymbol(from);
                string result = symbol + amount.ToString();
                return Ok(new { success = true, result = result });
            }
            if (!amount.HasValue || amount.Value < 0)
            {
                return BadRequest(new { success = false, message = "Invalid amount. Please enter a valid decimal (0+)." });
            }

            decimal sendAmount = amount.Value;
            // Replace this with your existing C# logic for currency conversion
            string convertedAmount = Convert(sendAmount, from, to);
            if (convertedAmount != "")
            {
                return Ok(new { success = true, result = convertedAmount });
            }
            else
            {
                return BadRequest(new { success = false, message = "Invalid conversion." });
            }
        }
        
        private string Convert(decimal amount, string from, string to)
        {           
            var fromID = _context.Currencies 
            .Where(c => c.NameCode.ToUpper().Trim() == from.ToUpper().Trim())
            .Select(c => c.ID)
            .FirstOrDefault();

            var toID = _context.Currencies
            .Where(c => c.NameCode.ToUpper().Trim()  == to.ToUpper().Trim() )
            .Select(c => c.ID)
            .FirstOrDefault();

            if (toID == 0)
            {
                // Handle the case where 'to' currency is not found.
                throw new Exception("To currency not found!");
            }

            if (fromID == 0)
            {
                // Handle the case where 'from' currency is not found.
                throw new Exception("From currency not found!");
            }

            var exchangeRate = _context.Exchanges
                .Where(e => e.CurrAID == fromID && e.CurrBID == toID)
                .FirstOrDefault();

            decimal conv = 0;
            decimal rate = 0;
            if(exchangeRate != null){
                decimal.TryParse(exchangeRate.BaseExchangeRate, out rate);
            }
            

            if (exchangeRate != null)
            {
                conv = rate * amount;
            }
            string output = CurrencyAPI.GetSymbol(to) + conv.ToString();
            return output;
            
        }

       
    }
}
