using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Cors;
using System.Data.SQLite;
using Microsoft.EntityFrameworkCore;

namespace CurrencyConverter
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            string connectionString = @"Data Source=currencyExchanges.db";
            SQLiteConnection liteConn = connectDatabase(connectionString);
            buildDatabase(liteConn);
        }

        private static SQLiteConnection connectDatabase(string connString){
            SQLiteConnection connection = new SQLiteConnection(connString);
            connection.Open();   
            return connection;
        }

        private static void buildDatabase(SQLiteConnection connection)
        {
            using (SQLiteCommand command = new SQLiteCommand("CREATE TABLE IF NOT EXISTS Currencies (ID INTEGER PRIMARY KEY, NAME_CODE TEXT, FULL_NAME TEXT, COUNTRY TEXT, BASE_EXCHANGE_USD INTEGER)", connection))
            {
                command.ExecuteNonQuery();
            }

            using (SQLiteCommand command = new SQLiteCommand("CREATE TABLE IF NOT EXISTS Exchanges (ID INTEGER PRIMARY KEY, CURR_A_ID INTEGER, CURR_B_ID INTEGER, EXCHANGE_NAME TEXT, BASE_EXCHANGE_RATE INTEGER)", connection))
            {
                command.ExecuteNonQuery();
            }

        }



        public void ConfigureServices(IServiceCollection services)
        {            
            services.AddDbContext<YourDbContext>(options =>
            {
                options.UseSqlite("Data Source = C:\\Users\\David\\Programming\\CurrencyConverter\\TestDatabase.db");
                options.EnableSensitiveDataLogging(); 
           
            });


            services.AddControllers();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });           
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(); 
            app.UseStaticFiles();
            app.UseDefaultFiles();
            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.SendFileAsync("./currency_converter/public/index.html");
                });
            });
        }
    }
}
