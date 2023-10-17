using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CurrencyConverter.Controllers;

namespace CurrencyConverter.Controllers
{
    [ApiController]
    [Route("/generateExchangeRates")]
    public class GenerateExchangeRatesController : ControllerBase
    {
        private readonly YourDbContext _context; // Add this field

        public GenerateExchangeRatesController(YourDbContext context) // Add this constructor
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get(string from, string to)
        {   
            string exchangeRate = "";   
            exchangeRate = RetrieveRate(from, to);
            return Ok(new { success = true, result = exchangeRate });
        }

        public string RetrieveSymbol(string currencyName){
             var symbol = _context.Currencies 
                .Where(c => c.NameCode.ToUpper().Trim() == currencyName.ToUpper().Trim())
                .Select(c => c.Symbol)
                .FirstOrDefault();

            return symbol;
        }

        public string RetrieveRate(string from, string to)
        {
                // Use Entity Framework Core to retrieve exchange rates from the database
                //get IDS
                var fromID = _context.Currencies 
                .Where(c => c.NameCode.ToUpper().Trim() == from.ToUpper().Trim())
                .Select(c => c.ID)
                .FirstOrDefault();

                var toID = _context.Currencies
                .Where(c => c.NameCode.ToUpper().Trim()  == to.ToUpper().Trim() )
                .Select(c => c.ID)
                .FirstOrDefault();

                string toSymbol = RetrieveSymbol(to);

              

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

                //get rate
                var rate = _context.Exchanges
                    .Where(c => (c.CurrAID == fromID && c.CurrBID == toID))
                    .Select(c => c.BaseExchangeRate).FirstOrDefault();

               // double finalRate = Math.Round(exchangeRate, 2);

                System.Console.WriteLine($"FROMID:{fromID} TOID: {toID} FROMCURR: {from} TOCURR: {to} EXCHANGERATE: {rate} SYMBOL: {toSymbol}");

                string returnedString = toSymbol + rate.ToString();
                
                if (returnedString != null)
                {
                    // Use the retrieved exchange rate
                    return returnedString.ToString();
                }
                else
                {
                    // Handle the case where the exchange rate is not found in the database
                   return "NA";
                }
        }         
    }
}