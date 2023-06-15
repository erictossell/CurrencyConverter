using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace CurrencyConverter.Helpers
{
    public class CurrencyAPI
    {
        private readonly HttpClient client;

        public CurrencyAPI()
        {
            if(client == null)
            {
                    HttpClientHandler handler = new HttpClientHandler();  
                    client = new HttpClient(handler);
            }
        }

        public string Get(string uri)
        {
            client.BaseAddress = new Uri(uri);
            HttpResponseMessage response = client.GetAsync(uri).Result;
            Console.WriteLine(response.Content.ReadAsStringAsync().Result);
            response.EnsureSuccessStatusCode();
            string result = response.Content.ReadAsStringAsync().Result;
            //Console.WriteLine("Result: " + result); 
            return result;
        }

        public string GetSymbol(string currency)
        {
            string symbol = "";
            switch (currency)
                {
                    case "CAD":
                        symbol = "$";
                        break;
                    case "USD":
                        symbol = "$";
                        break;
                    case "GBP":
                        symbol = "£";
                        break;
                    case "EUR":
                        symbol = "€";
                        break;
                    case "CNY":
                        symbol = "¥";
                        break;
                    default:
                        symbol = "$";
                        break;
                }
            return symbol;
        }
    }
}
