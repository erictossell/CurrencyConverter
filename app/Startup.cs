using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Data.SQLite;

namespace CurrencyConverter
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment CurrentEnvironment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            CurrentEnvironment = env;
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
       
            InsertData();

        }

        private static void InsertData()
        {
            string databasePath = "currencyExchanges.db"; // Replace with the path to your SQLite database
            string sqlFilePath = "../insert.sql"; // Replace with the path to your SQL file
            
            // Read the SQL commands from the file
            
            if (File.Exists(sqlFilePath))
            {
                string sqlCommands = File.ReadAllText(sqlFilePath);

   
                using (SQLiteConnection connection = new SQLiteConnection($"Data Source={databasePath};"))
                {
                    connection.Open();


                    // Split the file content into individual SQL statements
                    string[] commands = sqlCommands.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
                
                        try
                        {
                            // Execute each SQL command
                            foreach (string commandText in commands)
                            {
                                using (SQLiteCommand command = new SQLiteCommand(commandText, connection))
                                {
                                    command.ExecuteNonQuery();
                                }
                            }
                            Console.WriteLine("SQL file executed successfully.");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("Error executing SQL file: " + ex.Message);
                        }
                    
                }
            }
        }



        public void ConfigureServices(IServiceCollection services)
        {            
            services.AddDbContext<YourDbContext>(options =>
            {
                options.UseSqlite("Data Source=currencyExchanges.db");
                options.EnableSensitiveDataLogging(); 
           
            });


            services.AddControllers();

             services.AddCors(options =>
                {
                      options.AddDefaultPolicy(builder =>
                        {
                            builder.WithOrigins("http://localhost:3000") // Add the domain of your web page/application
                            .AllowAnyHeader()
                            .AllowAnyMethod();
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
            app.UseFileServer();
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
