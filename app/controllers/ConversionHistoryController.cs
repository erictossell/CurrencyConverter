using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace app.controllers
{
    [Route("/convertHistory")]
    public class ConvertController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get(decimal? amount, string from, string to, string result)
        {    
            decimal nonNullAmt = amount ?? 0;
            string cookieValue = Request.Cookies["ConversionHistory"] ?? "";
            string[] values = {nonNullAmt.ToString(), from, to, result };
          
            if (string.IsNullOrEmpty(cookieValue))
            {
                values = new[] {nonNullAmt.ToString(), from, to, result };
            }
            else{
                string[] previousValues = cookieValue.Split(',');
                values = previousValues.Concat(new[] { nonNullAmt.ToString(), from, to, result }).ToArray();
            }
            string joinedString = string.Join(",", values);
            Response.Cookies.Append("ConversionHistory", joinedString);
            // Continue with your logic
            return Ok(new { success = true, result = joinedString });
        }
    }
}