using InventoryManagement.Server.Context;
using InventoryManagement.Server.Restaurant1.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

AddServices();
ConfigureSwagger();
AddDbContext();

var app = builder.Build();

app.UseCors();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

void AddServices()
{
    builder.Services.AddControllers();
    builder.Services.AddLogging();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddScoped<IRestaurant1RepoSingleItem, Restaurant1Repo>();
    builder.Services.AddScoped<IRestaurant1RepoAllItem, Restaurant1Repo>();
    // Add CORS services
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder.WithOrigins("https://localhost:5173")
                   .WithHeaders(HeaderNames.ContentType, "x-custom-header")
                   .WithMethods("PUT", "DELETE", "GET", "PATCH", "POST");
        });
    });
}

void ConfigureSwagger()
{
    builder.Services.AddSwaggerGen();
}

void AddDbContext()
{
    var connectionString = builder.Configuration.GetConnectionString("DatabaseConnection");
    builder.Services.AddDbContext<ItemContext>(options => options.UseSqlServer(connectionString));
}
