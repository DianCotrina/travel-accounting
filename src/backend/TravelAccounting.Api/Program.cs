using Microsoft.AspNetCore.Authentication;
using TravelAccounting.Api.Auth;
using TravelAccounting.Api.Configuration;
using TravelAccounting.Application;
using TravelAccounting.Application.Auth;
using TravelAccounting.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserContext, HttpCurrentUserContext>();
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = HeaderUserIdAuthenticationHandler.SchemeName;
        options.DefaultChallengeScheme = HeaderUserIdAuthenticationHandler.SchemeName;
    })
    .AddScheme<AuthenticationSchemeOptions, HeaderUserIdAuthenticationHandler>(
        HeaderUserIdAuthenticationHandler.SchemeName,
        _ => { });
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
