using System;
using System.Text;

class Program
{
    static void Main(string[] args)
    {     
        CurrencyType[] currencies = {CurrencyType.CanadianDollar, CurrencyType.AmericanDollar, CurrencyType.Euro, CurrencyType.BritishPound, CurrencyType.ChineseYuan};
        string options = $"1. {currencies[0].ToStringValue()}\n 2. {currencies[1].ToStringValue()}\n 3. {currencies[2].ToStringValue()}\n 4. {currencies[3].ToStringValue()}\n 5. {currencies[4].ToStringValue()}";
        ConsoleKeyInfo keyInfo;
        bool invalidInput = false;
        do{           
            Console.WriteLine($"Hello, welcome to David's Currency Converter. \n Please select a currency to convert FROM:\n {options}");

            keyInfo = Console.ReadKey();
            switch(keyInfo.Key) {
                case ConsoleKey.D1:
                    Console.WriteLine($"\nYou selected {currencies[0].ToStringValue()} as the currency to convert FROM.");
                    invalidInput = true;
                    break;
                case ConsoleKey.D2:
                    Console.WriteLine($"\nYou selected {currencies[1].ToStringValue()} as the currency to convert FROM.");
                    invalidInput = true;
                    break;
                case ConsoleKey.D3:
                    Console.WriteLine($"\nYou selected {currencies[2].ToStringValue()} as the currency to convert FROM.");
                    invalidInput = true;
                    break;
                case ConsoleKey.D4:
                    Console.WriteLine($"\nYou selected {currencies[3].ToStringValue()} as the currency to convert FROM.");
                    invalidInput = true;
                    break;
                case ConsoleKey.D5:
                    Console.WriteLine($"\nYou selected {currencies[4].ToStringValue()} as the currency to convert FROM.");
                    invalidInput = true;
                    break;
                default:
                    Console.WriteLine("\nInvalid option. Please enter as key from 1-5.");
                    break;
            }
        }while(!invalidInput);

        CurrencyAPI api = new CurrencyAPI();
        var exchangeRate = api.Get("https://api.freecurrencyapi.com/v1/latest?apikey=x0fISZ5yVuubfp91QA5YJyisbCvxqKkMMpjkOdkc&currencies=EUR%2CUSD%2CCAD");
        Console.WriteLine("CAD TO USD IS: " + exchangeRate);

        
        
    }

    static ConsoleKeyInfo ReadKeyInput() {
        return Console.ReadKey();
    }
}