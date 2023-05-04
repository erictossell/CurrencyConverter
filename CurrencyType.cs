public enum CurrencyType
{
    CanadianDollar = 0,
    AmericanDollar = 1,
    Euro = 2,
    BritishPound = 3,
    ChineseYuan = 4
}

public static class CurrencyTypeExtensions
{
    public static string ToStringValue(this CurrencyType currencyType)
    {
        switch (currencyType)
        {
            case CurrencyType.CanadianDollar:
                return "CAD";
            case CurrencyType.AmericanDollar:
                return "USD";
            case CurrencyType.Euro:
                return "EUR";
            case CurrencyType.BritishPound:
                return "GBP";
            case CurrencyType.ChineseYuan:
                return "CNY";
            default:
                throw new ArgumentException($"Invalid currency type: {currencyType}", nameof(currencyType));
        }
    }

}