using System;
using System.Text;
using System.Text.RegularExpressions;

class Program
{
    static void Main(string[] args)
    {     
        CurrencyType[] currencies = {CurrencyType.CanadianDollar, CurrencyType.AmericanDollar, CurrencyType.Euro, CurrencyType.BritishPound, CurrencyType.ChineseYuan};
        string options = $"1. {currencies[0].ToStringValue()}\n 2. {currencies[1].ToStringValue()}\n 3. {currencies[2].ToStringValue()}\n 4. {currencies[3].ToStringValue()}\n 5. {currencies[4].ToStringValue()}";
        ConsoleKeyInfo keyInfo;
        bool invalidInput = false;
        string chosenCurrencyFrom = "";
        string chosenCurrencyTo = "";
        while (true)
        {
        do{           
            Console.WriteLine($"\nHello, welcome to David's Currency Converter. \n Please select a currency to convert FROM:\n {options}");
            
            keyInfo = Console.ReadKey();
            switch(keyInfo.Key) {
                case ConsoleKey.D1:
                    Console.WriteLine($"\nYou selected {currencies[0].ToStringValue()} as the currency to convert FROM.");
                    invalidInput = true;
                    chosenCurrencyFrom = currencies[0].ToStringValue();
                    break;
                case ConsoleKey.D2:
                    Console.WriteLine($"\nYou selected {currencies[1].ToStringValue()} as the currency to convert FROM.");
                    chosenCurrencyFrom = currencies[1].ToStringValue();
                    invalidInput = true;
                    break;
                case ConsoleKey.D3:
                    Console.WriteLine($"\nYou selected {currencies[2].ToStringValue()} as the currency to convert FROM.");
                    chosenCurrencyFrom = currencies[2].ToStringValue();
                    invalidInput = true;
                    break;
                case ConsoleKey.D4:
                    Console.WriteLine($"\nYou selected {currencies[3].ToStringValue()} as the currency to convert FROM.");
                    chosenCurrencyFrom = currencies[3].ToStringValue();
                    invalidInput = true;
                    break;
                case ConsoleKey.D5:
                    Console.WriteLine($"\nYou selected {currencies[4].ToStringValue()} as the currency to convert FROM.");
                    chosenCurrencyFrom = currencies[4].ToStringValue();
                    invalidInput = true;
                    break;
                default:
                    Console.WriteLine("\nInvalid option. Please enter as key from 1-5.");
                    break;
            }
        }while(!invalidInput);

        do{           
            Console.WriteLine($"\n Please select a currency to convert TO:\n {options}");
            
            keyInfo = Console.ReadKey();
            switch(keyInfo.Key) {
                case ConsoleKey.D1:
                    Console.WriteLine($"\nYou selected {currencies[0].ToStringValue()} as the currency to convert TO.");
                    invalidInput = true;
                    chosenCurrencyTo = currencies[0].ToStringValue();
                    break;
                case ConsoleKey.D2:
                    Console.WriteLine($"\nYou selected {currencies[1].ToStringValue()} as the currency to convert TO.");
                    chosenCurrencyTo = currencies[1].ToStringValue();
                    invalidInput = true;
                    break;
                case ConsoleKey.D3:
                    Console.WriteLine($"\nYou selected {currencies[2].ToStringValue()} as the currency to convert TO.");
                    chosenCurrencyTo = currencies[2].ToStringValue();
                    invalidInput = true;
                    break;
                case ConsoleKey.D4:
                    Console.WriteLine($"\nYou selected {currencies[3].ToStringValue()} as the currency to convert TO.");
                    chosenCurrencyTo = currencies[3].ToStringValue();
                    invalidInput = true;
                    break;
                case ConsoleKey.D5:
                    Console.WriteLine($"\nYou selected {currencies[4].ToStringValue()} as the currency to convert TO.");
                    chosenCurrencyTo = currencies[4].ToStringValue();
                    invalidInput = true;
                    break;
                default:
                    Console.WriteLine("\nInvalid option. Please press a key from 1-5.");
                    break;
            }
        }while(!invalidInput);

        if (chosenCurrencyFrom == chosenCurrencyTo){
            Console.WriteLine($"\nInvalid option. You chose the same currency for FROM and TO ({chosenCurrencyFrom}) \n A currency will always equal itself! 1=1");
            continue;
        }

        CurrencyAPI api = new CurrencyAPI();
        var exchangeRate = api.Get($"https://api.freecurrencyapi.com/v1/latest?apikey=x0fISZ5yVuubfp91QA5YJyisbCvxqKkMMpjkOdkc&base_currency={chosenCurrencyFrom}&currencies={chosenCurrencyTo}");
        string rate = exchangeRate.ToString();
        rate = Regex.Split(rate, @"\:")[Regex.Split(rate, @"\:").Length - 1];
        rate = rate.Substring(0, rate.Length - 2);
        Console.WriteLine($"-----RESULT-----\n 1 {chosenCurrencyFrom} = {rate} {chosenCurrencyTo}");   

        
            Console.WriteLine("\n Do you want to continue? (Y/N)");
            var input = Console.ReadKey();

            if (input != null && input.Key != ConsoleKey.Y) //must be Y/y to continue
            {
                Console.WriteLine("\nThank you for using David's Currency Converter!\nGoodbye.");
                break;
            }            
        }
    }

    static ConsoleKeyInfo ReadKeyInput() {
        return Console.ReadKey();
    }
}