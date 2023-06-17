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
        [HttpGet]
        public IActionResult Get(decimal? amount, string from, string to)
        {
            if(amount.HasValue && amount.Value == 0){
                string symbol = CurrencyAPI.GetSymbol(to);
                string result = symbol + amount.ToString();
                return Ok(new { success = true, result = result });
            }
            if (!amount.HasValue || amount.Value < 0)
            {
                return BadRequest(new { success = false, message = "Invalid amount. Please enter a valid decimal (0+)." });
            }

            decimal sendAmount = amount.Value;
            // Replace this with your existing C# logic for currency conversion
            string convertedAmount = CurrencyConverter.Convert(sendAmount, from, to);
            if (convertedAmount != "")
            {
                return Ok(new { success = true, result = convertedAmount });
            }
            else
            {
                return BadRequest(new { success = false, message = "Invalid conversion." });
            }
        }
    }

    public static class CurrencyConverter
    {
        public static string Convert(decimal amount, string from, string to)
        {
            CurrencyAPI api = new CurrencyAPI();
            var exchangeRate = api.Get($"https://api.freecurrencyapi.com/v1/latest?apikey=x0fISZ5yVuubfp91QA5YJyisbCvxqKkMMpjkOdkc&base_currency={from.ToUpper()}&currencies={to.ToUpper()}");
            string rate = exchangeRate.ToString();
            rate = Regex.Split(rate, @"\:")[Regex.Split(rate, @"\:").Length - 1];
            Match match = Regex.Match(rate, @"[0-9\.]+");
            Console.WriteLine(match.Success.ToString() ?? "FAIL");
            Console.WriteLine(match.Value.ToString() ?? "EMPTY");
            decimal conv = 0;
            if(match.Success && match.Value != null){
                decimal.TryParse(match.Value, out conv);
            }
            conv = conv * amount;

            string output = CurrencyAPI.GetSymbol(to) + conv.ToString();
            return output;
        }
        
    }
}
