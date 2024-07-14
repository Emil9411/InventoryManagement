using InventoryManagement.Server.Authorization.Models;
using InventoryManagement.Server.Authorization.Seeder;
using InventoryManagement.Server.Authorization.Services;
using InventoryManagement.Server.Context;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model;
using InventoryManagement.Server.Model.Restaurants;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

AddServices();
ConfigureSwagger();
AddDbContext();
AddIdentity();
AddAuthentication();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var authSeeder = scope.ServiceProvider.GetRequiredService<AuthSeeder>();
authSeeder.AddRoles();
authSeeder.AddAmin();
authSeeder.AddTestUser();
authSeeder.AddManager();

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

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

void AddServices()
{
    builder.Services.AddControllers();
    builder.Services.AddLogging();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddScoped<ITokenService, TokenService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<AuthSeeder>();
    builder.Services.AddScoped(typeof(IGenericRepo<Restaurant1Item>), typeof(GenericRepo<Restaurant1Item>));
    builder.Services.AddScoped(typeof(IGenericRepo<Restaurant2Item>), typeof(GenericRepo<Restaurant2Item>));
    builder.Services.AddScoped(typeof(IGenericRepo<Restaurant3Item>), typeof(GenericRepo<Restaurant3Item>));

    // Add CORS services
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder.WithOrigins("https://localhost:5173")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
    });
}

void AddDbContext()
{
    var connectionString = builder.Configuration.GetConnectionString("DatabaseConnection");
    builder.Services.AddDbContext<ItemContext>(options => options.UseSqlServer(connectionString));
    builder.Services.AddDbContext<UserContext>(options => options.UseSqlServer(connectionString));
}

void ConfigureSwagger()
{
    builder.Services.AddSwaggerGen(option =>
    {
        option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer"
        });
        option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });
}

void AddIdentity()
{
    builder.Services
        .AddIdentityCore<AppUser>(options =>
        {
            options.SignIn.RequireConfirmedAccount = false;
            options.User.RequireUniqueEmail = true;
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
        })
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<UserContext>();
}

void AddAuthentication()
{
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddCookie(options =>
        {
            options.Cookie.Name = "Authorization";
            options.Cookie.HttpOnly = true;
        })
        .AddJwtBearer(options =>
        {
            var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() ?? new JwtSettings();
            var issuerSigningKey = builder.Configuration.GetSection("IssuerSigningKey").Value ?? "";
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ClockSkew = TimeSpan.Zero,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.ValidIssuer,
                ValidAudience = jwtSettings.ValidAudience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(issuerSigningKey)),
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    if (context.Request.Cookies.ContainsKey("Authorization"))
                    {
                        context.Token = context.Request.Cookies["Authorization"];
                    }
                    return Task.CompletedTask;
                }
            };
        });
}
