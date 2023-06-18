using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CurrencyConverter.Helpers;

namespace CurrencyConverter.Controllers
{
    [Route("/convertHistory")]
    public class ConvertHistoryController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get(decimal? amount, string from, string to, string result, bool addRow)
        {    
            string nonNullAmt = amount.ToString() ?? "00.00";
            if(nonNullAmt != ""){
                    nonNullAmt = CurrencyAPI.GetSymbol(from) + nonNullAmt;
            }
        
            string cookieValue = Request.Cookies["ConversionHistory"] ?? "";
            string[] values = { nonNullAmt, from, to, result };
          
            if (string.IsNullOrEmpty(cookieValue))
            {
                values = new[] {nonNullAmt, from, to, result };
            }
            else{
                string[] previousValues = cookieValue.Split(',');

                if(previousValues.Length >= 20 && addRow){
                    int insertInd = previousValues.Length - 4;
                    // Shift the elements up by four positions
                    for (int i = 0; i < insertInd; i++)
                    {
                        previousValues[i] = previousValues[i + 4];
                    }
                    
                    previousValues[insertInd] = nonNullAmt;
                    previousValues[insertInd + 1] = from;
                    previousValues[insertInd + 2] = to;
                    previousValues[insertInd + 3] = result;
                    values = previousValues;
                }
                else if(addRow){
                    values = previousValues.Concat(new[] { nonNullAmt, from, to, result }).ToArray();
                }
                else{
                    values = previousValues.ToArray();
                }
               
            }
             
            string joinedString = string.Join(",", values);
            if(addRow){
                Response.Cookies.Append("ConversionHistory", joinedString);
            }
            
            // if(cookieValue == ""){
            //     joinedString = cookieValue;
            // }
            // Continue with your logic
            return Ok(new { success = true, result = joinedString });
        }
    }
}