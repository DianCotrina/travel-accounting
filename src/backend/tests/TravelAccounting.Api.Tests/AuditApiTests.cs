using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TravelAccounting.Api.Tests;

public sealed class AuditApiTests(CustomWebApplicationFactory factory)
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

    [Fact]
    public async Task CreateTrip_WritesCreateAuditEntry()
    {
        var tripId = await CreateTripAsync();

        var auditResponse = await _client.GetAsync($"/api/audit?entityType=Trip&entityId={tripId}");
        auditResponse.EnsureSuccessStatusCode();
        var entries = await auditResponse.Content.ReadFromJsonAsync<List<AuditEntryResult>>();
        Assert.NotNull(entries);

        var createEntry = Assert.Single(entries, entry => entry.Action == "Create");
        Assert.Equal("TRIP", createEntry.EntityType);
        Assert.Equal(tripId, createEntry.EntityId);
        Assert.True(createEntry.Changes.TryGetProperty("name", out var nameChange));
        Assert.Equal("Audit Trip", nameChange.GetProperty("after").GetString());
    }

    [Fact]
    public async Task CreateExpense_WritesCreateAuditEntry()
    {
        var tripId = await CreateTripAsync();

        var createExpenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{tripId}/expenses",
            new
            {
                category = "Meal",
                amount = 10000m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T18:00:00Z",
                notes = "Dinner",
            });
        createExpenseResponse.EnsureSuccessStatusCode();
        var expense = await createExpenseResponse.Content.ReadFromJsonAsync<ExpenseResult>();
        Assert.NotNull(expense);

        var auditResponse = await _client.GetAsync(
            $"/api/audit?entityType=Expense&entityId={expense!.Id}");
        auditResponse.EnsureSuccessStatusCode();
        var entries = await auditResponse.Content.ReadFromJsonAsync<List<AuditEntryResult>>();
        Assert.NotNull(entries);

        var createEntry = Assert.Single(entries, entry => entry.Action == "Create");
        Assert.Equal("EXPENSE", createEntry.EntityType);
        Assert.Equal(expense.Id, createEntry.EntityId);
        Assert.True(createEntry.Changes.TryGetProperty("amount", out var amountChange));
        Assert.Equal(JsonValueKind.Null, amountChange.GetProperty("before").ValueKind);
        Assert.Equal(10000m, amountChange.GetProperty("after").GetDecimal());
    }

    [Fact]
    public async Task UpdateExpense_WritesChangedFieldDiffAuditEntry()
    {
        var tripId = await CreateTripAsync();
        var expenseId = await CreateExpenseAsync(tripId);

        var updateResponse = await _client.PutAsJsonAsync(
            $"/api/trips/{tripId}/expenses/{expenseId}",
            new
            {
                category = "Meal",
                amount = 12500m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T18:00:00Z",
                notes = "Team dinner",
            });
        updateResponse.EnsureSuccessStatusCode();

        var auditResponse = await _client.GetAsync($"/api/audit?entityType=Expense&entityId={expenseId}");
        auditResponse.EnsureSuccessStatusCode();
        var entries = await auditResponse.Content.ReadFromJsonAsync<List<AuditEntryResult>>();
        Assert.NotNull(entries);

        var updateEntry = Assert.Single(entries, entry => entry.Action == "Update");
        Assert.True(updateEntry.Changes.TryGetProperty("amount", out var amountChange));
        Assert.Equal(10000m, amountChange.GetProperty("before").GetDecimal());
        Assert.Equal(12500m, amountChange.GetProperty("after").GetDecimal());

        Assert.True(updateEntry.Changes.TryGetProperty("notes", out var notesChange));
        Assert.Equal("Dinner", notesChange.GetProperty("before").GetString());
        Assert.Equal("Team dinner", notesChange.GetProperty("after").GetString());
    }

    [Fact]
    public async Task DeleteExpense_WritesDeleteAuditEntry()
    {
        var tripId = await CreateTripAsync();
        var expenseId = await CreateExpenseAsync(tripId);

        var deleteResponse = await _client.DeleteAsync($"/api/trips/{tripId}/expenses/{expenseId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var auditResponse = await _client.GetAsync($"/api/audit?entityType=Expense&entityId={expenseId}");
        auditResponse.EnsureSuccessStatusCode();
        var entries = await auditResponse.Content.ReadFromJsonAsync<List<AuditEntryResult>>();
        Assert.NotNull(entries);

        var deleteEntry = Assert.Single(entries, entry => entry.Action == "Delete");
        Assert.True(deleteEntry.Changes.TryGetProperty("amount", out var amountChange));
        Assert.Equal(10000m, amountChange.GetProperty("before").GetDecimal());
        Assert.Equal(JsonValueKind.Null, amountChange.GetProperty("after").ValueKind);
    }

    [Fact]
    public async Task UpsertExchangeRate_WritesCreateAndUpdateAuditEntries()
    {
        var tripId = await CreateTripAsync();
        var entityId = BuildExchangeRateAuditEntityId(tripId, new DateOnly(2026, 3, 11), "ARS", "USD");

        var createResponse = await _client.PutAsJsonAsync(
            $"/api/trips/{tripId}/exchange-rates",
            new
            {
                date = "2026-03-11",
                fromCurrency = "ARS",
                toCurrency = "USD",
                rate = 0.001m,
            });
        createResponse.EnsureSuccessStatusCode();

        var updateResponse = await _client.PutAsJsonAsync(
            $"/api/trips/{tripId}/exchange-rates",
            new
            {
                date = "2026-03-11",
                fromCurrency = "ARS",
                toCurrency = "USD",
                rate = 0.002m,
            });
        updateResponse.EnsureSuccessStatusCode();

        var auditResponse = await _client.GetAsync(
            $"/api/audit?entityType=ExchangeRate&entityId={entityId}");
        auditResponse.EnsureSuccessStatusCode();
        var entries = await auditResponse.Content.ReadFromJsonAsync<List<AuditEntryResult>>();
        Assert.NotNull(entries);

        Assert.Single(entries, entry => entry.Action == "Create");
        var updated = Assert.Single(entries, entry => entry.Action == "Update");
        Assert.True(updated.Changes.TryGetProperty("rate", out var rateChange));
        Assert.Equal(0.001m, rateChange.GetProperty("before").GetDecimal());
        Assert.Equal(0.002m, rateChange.GetProperty("after").GetDecimal());
    }

    [Fact]
    public async Task AuditQuery_RejectsDifferentUserFilter()
    {
        var response = await _client.GetAsync("/api/audit?userId=some-other-user");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private async Task<Guid> CreateTripAsync()
    {
        var createTripResponse = await _client.PostAsJsonAsync("/api/trips", new
        {
            name = "Audit Trip",
            destinationCountry = "Argentina",
            homeCurrency = "USD",
            localCurrency = "ARS",
            startDate = "2026-03-10",
            endDate = "2026-03-20",
        });
        createTripResponse.EnsureSuccessStatusCode();

        var trip = await createTripResponse.Content.ReadFromJsonAsync<TripResult>();
        Assert.NotNull(trip);
        return trip!.Id;
    }

    private async Task<Guid> CreateExpenseAsync(Guid tripId)
    {
        var createExpenseResponse = await _client.PostAsJsonAsync(
            $"/api/trips/{tripId}/expenses",
            new
            {
                category = "Meal",
                amount = 10000m,
                currency = "ARS",
                occurredAtUtc = "2026-03-11T18:00:00Z",
                notes = "Dinner",
            });
        createExpenseResponse.EnsureSuccessStatusCode();

        var expense = await createExpenseResponse.Content.ReadFromJsonAsync<ExpenseResult>();
        Assert.NotNull(expense);
        return expense!.Id;
    }

    private static Guid BuildExchangeRateAuditEntityId(
        Guid tripId,
        DateOnly date,
        string fromCurrency,
        string toCurrency)
    {
        var key = $"{tripId:N}|{date:yyyy-MM-dd}|{fromCurrency.ToUpperInvariant()}|{toCurrency.ToUpperInvariant()}";
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(key));
        return new Guid(hash[..16]);
    }

    private sealed record TripResult(Guid Id);
    private sealed record ExpenseResult(Guid Id);

    private sealed record AuditEntryResult(
        Guid Id,
        string UserId,
        string Action,
        string EntityType,
        Guid EntityId,
        DateTimeOffset Timestamp,
        JsonElement Changes);
}
