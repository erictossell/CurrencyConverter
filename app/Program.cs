using System;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace CurrencyConverter{
class Program
{
    static void Main(string[] args)
    {     
        CreateHostBuilder(args).Build().Run();
    }
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });


    
    static ConsoleKeyInfo ReadKeyInput() {
        return Console.ReadKey();
    }

}
}