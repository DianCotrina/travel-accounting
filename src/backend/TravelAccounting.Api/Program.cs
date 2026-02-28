using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TravelAccounting.Api.Auth;
using TravelAccounting.Api.Configuration;
using TravelAccounting.Application;
using TravelAccounting.Application.Auth;
using TravelAccounting.Infrastructure;
using TravelAccounting.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserContext, HttpCurrentUserContext>();
builder.Services
    .AddOptions<JwtAuthenticationSettings>()
    .Bind(builder.Configuration.GetRequiredSection(JwtAuthenticationSettings.SectionName))
    .ValidateDataAnnotations()
    .Validate(
        settings => !string.IsNullOrWhiteSpace(settings.Authority) || !string.IsNullOrWhiteSpace(settings.SigningKey),
        "Authentication:Jwt must define either Authority or SigningKey.")
    .Validate(
        settings => string.IsNullOrWhiteSpace(settings.SigningKey) || settings.SigningKey.Length >= 32,
        "Authentication:Jwt:SigningKey must be at least 32 characters when provided.")
    .ValidateOnStart();

var jwtSettings = builder.Configuration
                      .GetRequiredSection(JwtAuthenticationSettings.SectionName)
                      .Get<JwtAuthenticationSettings>()
                  ?? throw new InvalidOperationException(
                      $"Configuration section '{JwtAuthenticationSettings.SectionName}' is required.");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            NameClaimType = "sub",
        };

        if (!string.IsNullOrWhiteSpace(jwtSettings.Authority))
        {
            options.Authority = jwtSettings.Authority;
            options.RequireHttpsMetadata = jwtSettings.RequireHttpsMetadata;
            options.TokenValidationParameters.ValidateIssuerSigningKey = false;
            return;
        }

        options.TokenValidationParameters.ValidateIssuerSigningKey = true;
        options.TokenValidationParameters.IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SigningKey));
    });
builder.Services.AddAuthorization();
builder.Services
    .AddOptions<AppSettings>()
    .Bind(builder.Configuration.GetSection(AppSettings.SectionName))
    .ValidateDataAnnotations()
    .Validate(
        settings => settings.SupportedCurrencies.All(code => code.Length == 3 && code.All(char.IsUpper)),
        "All supported currencies must use 3-letter uppercase codes.")
    .ValidateOnStart();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (dbContext.Database.IsRelational())
    {
        dbContext.Database.Migrate();
    }
}

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

app.Run();

public partial class Program;
