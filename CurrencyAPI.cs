using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;



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
        response.EnsureSuccessStatusCode();
        string result = response.Content.ReadAsStringAsync().Result;
        Console.WriteLine("Result: " + result); 
        return result;
    }
}
