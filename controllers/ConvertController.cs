using Microsoft.AspNetCore.Mvc;

namespace CurrencyConverter.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConvertController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get(decimal amount, string from, string to)
        {
            // Replace this with your existing C# logic for currency conversion
            decimal convertedAmount = CurrencyConverter.Convert(amount, from, to);

            if (convertedAmount != decimal.MinValue)
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
        public static decimal Convert(decimal amount, string from, string to)
        {
            // Implement your existing C# logic for currency conversion here
            // Return the converted amount or decimal.MinValue if the conversion is invalid
            // Example implementation:
            if (from == "usd" && to == "eur")
            {
                return amount * 0.85m;
            }
            else if (from == "usd" && to == "gbp")
            {
                return amount * 0.72m;
            }
            else if (from == "eur" && to == "usd")
            {
                return amount * 1.18m;
            }
            else if (from == "eur" && to == "gbp")
            {
                return amount * 0.85m;
            }
            else if (from == "gbp" && to == "usd")
            {
                return amount * 1.39m;
            }
            else if (from == "gbp" && to == "eur")
            {
                return amount * 1.18m;
            }
            else
            {
                return decimal.MinValue; // Invalid conversion
            }
        }
    }
}
