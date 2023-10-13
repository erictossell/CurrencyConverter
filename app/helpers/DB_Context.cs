using Microsoft.EntityFrameworkCore;

public class Currency
{
    public int ID { get; set; }
    public string NameCode { get; set; }
    public string FullName { get; set; }
    public string Country { get; set; }
    public string  BaseExchangeUSD { get; set; }
}

public class Exchange
{
    public int ID { get; set; }
    public int CurrAID { get; set; }
    public int CurrBID { get; set; }
    public string ExchangeName { get; set; }
    public string  BaseExchangeRate { get; set; }
}

public class YourDbContext : DbContext
{
    public YourDbContext(DbContextOptions<YourDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<Currency> Currencies { get; set; }
    public DbSet<Exchange> Exchanges { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Currency>().ToTable("Currencies");        
        modelBuilder.Entity<Exchange>().ToTable("Exchanges");
    }
}
