import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

type HealthResponse = {
  status: string;
  utcNow: string;
};

type Trip = {
  id: string;
  name: string;
  destinationCountry: string;
  homeCurrency: string;
  localCurrency: string;
  startDate: string;
  endDate: string;
  status: string;
};

type Expense = {
  id: string;
  tripId: string;
  category: string;
  amount: number;
  currency: string;
  homeAmount?: number | null;
  homeCurrency?: string | null;
  exchangeRateUsed?: number | null;
  occurredAtUtc: string;
  notes: string;
};

type CountryReference = {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencyName: string;
};

type TripFormState = {
  name: string;
  destinationCountry: string;
  homeCurrency: string;
  localCurrency: string;
  startDate: string;
  endDate: string;
};

type ExpenseFormState = {
  category: string;
  amount: string;
  currency: string;
  occurredAtUtc: string;
  notes: string;
};

type ExchangeRate = {
  tripId: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
};

type LedgerCategoryTotal = {
  category: string;
  totalLocalAmount: number;
  convertedHomeAmount: number;
  expenseCount: number;
  convertedExpenseCount: number;
  missingHomeConversionCount: number;
};

type LedgerDayTotal = {
  date: string;
  totalLocalAmount: number;
  convertedHomeAmount: number;
  expenseCount: number;
  convertedExpenseCount: number;
  missingHomeConversionCount: number;
};

type LedgerSummary = {
  tripId: string;
  localCurrency: string;
  homeCurrency: string;
  totalLocalAmount: number;
  convertedHomeAmount: number;
  expenseCount: number;
  convertedExpenseCount: number;
  missingHomeConversionCount: number;
  categoryTotals: LedgerCategoryTotal[];
  dayTotals: LedgerDayTotal[];
};

type ReportCategoryTotal = {
  category: string;
  expenseCount: number;
  totalLocalAmount: number;
  totalHomeAmount: number;
};

type ReportSummary = {
  tripId: string;
  localCurrency: string;
  homeCurrency: string;
  fromDate?: string | null;
  toDate?: string | null;
  category?: string | null;
  expenseCount: number;
  totalLocalAmount: number;
  totalHomeAmount: number;
  categoryTotals: ReportCategoryTotal[];
};

type ReportFilterState = {
  fromDate: string;
  toDate: string;
  category: string;
};

const initialFormState: TripFormState = {
  name: "",
  destinationCountry: "",
  homeCurrency: "USD",
  localCurrency: "ARS",
  startDate: "",
  endDate: "",
};

const initialExpenseFormState: ExpenseFormState = {
  category: "Meal",
  amount: "",
  currency: "ARS",
  occurredAtUtc: "",
  notes: "",
};

const initialReportFilters: ReportFilterState = {
  fromDate: "",
  toDate: "",
  category: "",
};

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [countries, setCountries] = useState<CountryReference[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [ledgerSummary, setLedgerSummary] = useState<LedgerSummary | null>(null);
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
  const [reportFilters, setReportFilters] = useState<ReportFilterState>(initialReportFilters);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [selectedExpensesTripId, setSelectedExpensesTripId] = useState<string>("");
  const [form, setForm] = useState<TripFormState>(initialFormState);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(
    initialExpenseFormState
  );
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const healthUrl = apiBaseUrl ? `${apiBaseUrl}/api/health` : "/api/health";
  const tripsUrl = apiBaseUrl ? `${apiBaseUrl}/api/trips` : "/api/trips";
  const countriesUrl = apiBaseUrl
    ? `${apiBaseUrl}/api/reference/countries`
    : "/api/reference/countries";

  const selectedCountry = countries.find(
    (country) => country.countryName === form.destinationCountry
  );
  const selectedTripForExpenses = trips.find(
    (trip) => trip.id === selectedExpensesTripId
  );
  const expensesUrl = selectedExpensesTripId
    ? `${tripsUrl}/${selectedExpensesTripId}/expenses`
    : "";
  const exchangeRatesUrl = selectedExpensesTripId
    ? `${tripsUrl}/${selectedExpensesTripId}/exchange-rates`
    : "";
  const ledgerSummaryUrl = selectedExpensesTripId
    ? `${tripsUrl}/${selectedExpensesTripId}/ledger/summary`
    : "";
  const reportSummaryUrl = selectedExpensesTripId
    ? `${tripsUrl}/${selectedExpensesTripId}/reports/summary`
    : "";
  const reportCsvUrl = selectedExpensesTripId
    ? `${tripsUrl}/${selectedExpensesTripId}/reports/export/csv`
    : "";

  const loadHealth = useCallback(async (): Promise<void> => {
    const response = await fetch(healthUrl);
    if (!response.ok) {
      throw new Error(`Health request failed with ${response.status}.`);
    }

    const data = (await response.json()) as HealthResponse;
    setHealth(data);
  }, [healthUrl]);

  const loadTrips = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(tripsUrl);
      if (!response.ok) {
        throw new Error(`Trip list request failed with ${response.status}.`);
      }

      const data = (await response.json()) as Trip[];
      setTrips(data);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load trips unexpectedly."
      );
    }
  }, [tripsUrl]);

  const loadCountries = useCallback(async (): Promise<void> => {
    const response = await fetch(countriesUrl);
    if (!response.ok) {
      throw new Error(`Countries request failed with ${response.status}.`);
    }

    const data = (await response.json()) as CountryReference[];
    setCountries(data);
  }, [countriesUrl]);

  const loadExpenses = useCallback(async (): Promise<void> => {
    if (!selectedExpensesTripId) {
      setExpenses([]);
      return;
    }

    const response = await fetch(expensesUrl);
    if (!response.ok) {
      throw new Error(`Expenses request failed with ${response.status}.`);
    }

    const data = (await response.json()) as Expense[];
    setExpenses(data);
  }, [expensesUrl, selectedExpensesTripId]);

  const loadExchangeRates = useCallback(async (): Promise<void> => {
    if (!selectedExpensesTripId) {
      setExchangeRates([]);
      return;
    }

    const response = await fetch(exchangeRatesUrl);
    if (!response.ok) {
      throw new Error(`Exchange rates request failed with ${response.status}.`);
    }

    const data = (await response.json()) as ExchangeRate[];
    setExchangeRates(data);
  }, [exchangeRatesUrl, selectedExpensesTripId]);

  const loadLedgerSummary = useCallback(async (): Promise<void> => {
    if (!selectedExpensesTripId) {
      setLedgerSummary(null);
      return;
    }

    const response = await fetch(ledgerSummaryUrl);
    if (!response.ok) {
      throw new Error(`Ledger summary request failed with ${response.status}.`);
    }

    const data = (await response.json()) as LedgerSummary;
    setLedgerSummary(data);
  }, [ledgerSummaryUrl, selectedExpensesTripId]);

  const loadReportSummary = useCallback(async (): Promise<void> => {
    if (!selectedExpensesTripId) {
      setReportSummary(null);
      return;
    }

    const query = new URLSearchParams();
    if (reportFilters.fromDate) {
      query.set("fromDate", reportFilters.fromDate);
    }
    if (reportFilters.toDate) {
      query.set("toDate", reportFilters.toDate);
    }
    if (reportFilters.category) {
      query.set("category", reportFilters.category);
    }

    const response = await fetch(
      query.toString() ? `${reportSummaryUrl}?${query.toString()}` : reportSummaryUrl
    );
    if (!response.ok) {
      throw new Error(`Report summary request failed with ${response.status}.`);
    }

    const data = (await response.json()) as ReportSummary;
    setReportSummary(data);
  }, [reportFilters.category, reportFilters.fromDate, reportFilters.toDate, reportSummaryUrl, selectedExpensesTripId]);

  useEffect(() => {
    loadHealth()
      .then(async () => {
        await Promise.all([loadTrips(), loadCountries()]);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? `API connection failed. Ensure backend is running. Details: ${loadError.message}`
            : "API connection failed unexpectedly."
        );
      });
  }, [loadHealth, loadTrips, loadCountries]);

  useEffect(() => {
    if (selectedExpensesTripId) {
      Promise.all([
        loadExpenses(),
        loadExchangeRates(),
        loadLedgerSummary(),
        loadReportSummary(),
      ]).catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Expenses or rates load failed unexpectedly."
        );
      });
    } else {
      setLedgerSummary(null);
      setReportSummary(null);
    }
  }, [loadExpenses, loadExchangeRates, loadLedgerSummary, loadReportSummary, selectedExpensesTripId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);

    const payload = {
      name: form.name,
      destinationCountry: form.destinationCountry,
      homeCurrency: form.homeCurrency.toUpperCase(),
      localCurrency: form.localCurrency.toUpperCase(),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    const isEditing = selectedTripId !== null;
    const url = isEditing ? `${tripsUrl}/${selectedTripId}` : tripsUrl;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const operation = isEditing ? "update" : "create";
      throw new Error(`Trip ${operation} failed with ${response.status}.`);
    }

    await loadTrips();
    clearForm();
  }

  async function handleArchive(id: string): Promise<void> {
    setError(null);

    const response = await fetch(`${tripsUrl}/${id}/archive`, {
      method: "POST",
    });

    if (!response.ok) {
      setError(`Trip archive failed with ${response.status}.`);
      return;
    }

    await loadTrips();
    if (selectedTripId === id) {
      clearForm();
    }
  }

  function startEdit(trip: Trip): void {
    setSelectedTripId(trip.id);
    setForm({
      name: trip.name,
      destinationCountry: trip.destinationCountry,
      homeCurrency: trip.homeCurrency,
      localCurrency: trip.localCurrency,
      startDate: trip.startDate,
      endDate: trip.endDate,
    });
  }

  function clearForm(): void {
    setSelectedTripId(null);
    setForm(initialFormState);
  }

  async function handleExpenseSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setError(null);

    if (!selectedExpensesTripId) {
      setError("Select a trip before creating expenses.");
      return;
    }

    const payload = {
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      currency: expenseForm.currency.toUpperCase(),
      occurredAtUtc: new Date(expenseForm.occurredAtUtc).toISOString(),
      notes: expenseForm.notes,
    };

    const method = selectedExpenseId ? "PUT" : "POST";
    const url = selectedExpenseId ? `${expensesUrl}/${selectedExpenseId}` : expensesUrl;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Expense ${selectedExpenseId ? "update" : "create"} failed with ${
          response.status
        }: ${text}`
      );
    }

    await loadExpenses();
    await loadExchangeRates();
    await loadLedgerSummary();
    await loadReportSummary();
    clearExpenseForm();
  }

  async function handleExpenseDelete(expenseId: string): Promise<void> {
    if (!selectedExpensesTripId) {
      return;
    }

    const response = await fetch(`${expensesUrl}/${expenseId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError(`Expense delete failed with ${response.status}.`);
      return;
    }

    await loadExpenses();
    await loadExchangeRates();
    await loadLedgerSummary();
    await loadReportSummary();
    if (selectedExpenseId === expenseId) {
      clearExpenseForm();
    }
  }

  async function handleLoadReportSummary(): Promise<void> {
    setError(null);
    await loadReportSummary();
  }

  async function handleDownloadReportCsv(): Promise<void> {
    if (!selectedExpensesTripId) {
      setError("Select a trip before exporting reports.");
      return;
    }

    const query = new URLSearchParams();
    if (reportFilters.fromDate) {
      query.set("fromDate", reportFilters.fromDate);
    }
    if (reportFilters.toDate) {
      query.set("toDate", reportFilters.toDate);
    }
    if (reportFilters.category) {
      query.set("category", reportFilters.category);
    }

    const response = await fetch(
      query.toString() ? `${reportCsvUrl}?${query.toString()}` : reportCsvUrl
    );
    if (!response.ok) {
      throw new Error(`Report export failed with ${response.status}.`);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("content-disposition") ?? "";
    const match = contentDisposition.match(/filename="?([^"]+)"?/i);
    const fileName = match?.[1] ?? "trip-report.csv";

    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  function startExpenseEdit(expense: Expense): void {
    setSelectedExpenseId(expense.id);
    setExpenseForm({
      category: expense.category,
      amount: expense.amount.toString(),
      currency: expense.currency,
      occurredAtUtc: new Date(expense.occurredAtUtc).toISOString().slice(0, 16),
      notes: expense.notes,
    });
  }

  function clearExpenseForm(): void {
    setSelectedExpenseId(null);
    setExpenseForm({
      ...initialExpenseFormState,
      currency: selectedTripForExpenses?.localCurrency ?? "ARS",
    });
  }

  return (
    <main className="app">
      <h1>Travel Accounting</h1>
      <p className="subtitle">Trips module - phase 2</p>

      {health && (
        <section className="card">
          <h2>API Health</h2>
          <p>Status: {health.status}</p>
          <p>UTC: {health.utcNow}</p>
        </section>
      )}

      <section className="card">
        <h2>{selectedTripId ? "Edit Trip" : "Create Trip"}</h2>
        <form
          className="trip-form"
          onSubmit={(event) => {
            handleSubmit(event).catch((submitError) => {
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : "Trip submit failed unexpectedly."
              );
            });
          }}
        >
          <input
            required
            placeholder="Trip name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <label>
            Destination country
            <select
              required
              value={form.destinationCountry}
              onChange={(event) => {
                const destinationCountry = event.target.value;
                const country = countries.find(
                  (item) => item.countryName === destinationCountry
                );
                setForm({
                  ...form,
                  destinationCountry,
                  localCurrency: country?.currencyCode ?? form.localCurrency,
                });
              }}
            >
              <option value="">Select destination</option>
              {countries.map((country) => (
                <option key={country.countryCode} value={country.countryName}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>
          <input
            required
            minLength={3}
            maxLength={3}
            placeholder="Origin currency (USD)"
            value={form.homeCurrency}
            onChange={(event) =>
              setForm({ ...form, homeCurrency: event.target.value.toUpperCase() })
            }
          />
          <input
            required
            minLength={3}
            maxLength={3}
            placeholder="Destination currency (ARS)"
            value={form.localCurrency}
            onChange={(event) =>
              setForm({ ...form, localCurrency: event.target.value.toUpperCase() })
            }
          />
          {selectedCountry && (
            <p>
              Destination currency: {selectedCountry.currencyCode} (
              {selectedCountry.currencyName})
            </p>
          )}
          <label>
            Start date
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(event) =>
                setForm({ ...form, startDate: event.target.value })
              }
            />
          </label>
          <label>
            End date
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(event) => setForm({ ...form, endDate: event.target.value })}
            />
          </label>
          <div className="actions">
            <button type="submit">{selectedTripId ? "Save" : "Create"}</button>
            {selectedTripId && (
              <button type="button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Expenses</h2>
        <label>
          Trip for expenses
          <select
            value={selectedExpensesTripId}
            onChange={(event) => {
              setSelectedExpensesTripId(event.target.value);
              setSelectedExpenseId(null);
              const selectedTrip = trips.find((trip) => trip.id === event.target.value);
              setExpenseForm({
                ...initialExpenseFormState,
                currency: selectedTrip?.localCurrency ?? "ARS",
              });
              setReportFilters(initialReportFilters);
            }}
          >
            <option value="">Select trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name} ({trip.destinationCountry})
              </option>
            ))}
          </select>
        </label>

        {selectedTripForExpenses && (
          <p>
            Origin currency: {selectedTripForExpenses.homeCurrency} | Destination
            currency: {selectedTripForExpenses.localCurrency}
          </p>
        )}

        {selectedTripForExpenses && ledgerSummary && (
          <section className="card">
            <h3>Ledger Summary</h3>
            <p>
              Total local: {ledgerSummary.totalLocalAmount} {ledgerSummary.localCurrency}
            </p>
            <p>
              Total home (converted): {ledgerSummary.convertedHomeAmount} {ledgerSummary.homeCurrency}
            </p>
            <p>
              Expenses: {ledgerSummary.expenseCount} | Converted:{" "}
              {ledgerSummary.convertedExpenseCount} | Missing conversion:{" "}
              {ledgerSummary.missingHomeConversionCount}
            </p>

            {ledgerSummary.categoryTotals.length > 0 && (
              <>
                <h4>By Category</h4>
                {ledgerSummary.categoryTotals.map((item) => (
                  <article key={item.category} className="trip-row">
                    <div>{item.category}</div>
                    <div>
                      {item.totalLocalAmount} {ledgerSummary.localCurrency}
                    </div>
                    <div>
                      {item.convertedHomeAmount} {ledgerSummary.homeCurrency}
                    </div>
                    <div>
                      {item.convertedExpenseCount}/{item.expenseCount} converted
                    </div>
                  </article>
                ))}
              </>
            )}

            {ledgerSummary.dayTotals.length > 0 && (
              <>
                <h4>By Day</h4>
                {ledgerSummary.dayTotals.map((item) => (
                  <article key={item.date} className="trip-row">
                    <div>{item.date}</div>
                    <div>
                      {item.totalLocalAmount} {ledgerSummary.localCurrency}
                    </div>
                    <div>
                      {item.convertedHomeAmount} {ledgerSummary.homeCurrency}
                    </div>
                    <div>
                      {item.convertedExpenseCount}/{item.expenseCount} converted
                    </div>
                  </article>
                ))}
              </>
            )}
          </section>
        )}

        {selectedTripForExpenses && (
          <section className="card">
            <h3>Reports & Export</h3>
            <div className="trip-form">
              <label>
                From date
                <input
                  type="date"
                  value={reportFilters.fromDate}
                  onChange={(event) =>
                    setReportFilters({ ...reportFilters, fromDate: event.target.value })
                  }
                />
              </label>
              <label>
                To date
                <input
                  type="date"
                  value={reportFilters.toDate}
                  onChange={(event) =>
                    setReportFilters({ ...reportFilters, toDate: event.target.value })
                  }
                />
              </label>
              <input
                placeholder="Category filter (optional)"
                value={reportFilters.category}
                onChange={(event) =>
                  setReportFilters({ ...reportFilters, category: event.target.value })
                }
              />
              <div className="actions">
                <button
                  type="button"
                  onClick={() => {
                    handleLoadReportSummary().catch((loadError) => {
                      setError(
                        loadError instanceof Error
                          ? loadError.message
                          : "Report summary failed unexpectedly."
                      );
                    });
                  }}
                >
                  Load report
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadReportCsv().catch((loadError) => {
                      setError(
                        loadError instanceof Error
                          ? loadError.message
                          : "Report export failed unexpectedly."
                      );
                    });
                  }}
                >
                  Download CSV
                </button>
              </div>
            </div>

            {reportSummary && (
              <>
                <p>
                  Filtered expenses: {reportSummary.expenseCount}
                </p>
                <p>
                  Total local: {reportSummary.totalLocalAmount} {reportSummary.localCurrency}
                </p>
                <p>
                  Total home: {reportSummary.totalHomeAmount} {reportSummary.homeCurrency}
                </p>
                {reportSummary.categoryTotals.length > 0 && (
                  <>
                    <h4>Category breakdown</h4>
                    {reportSummary.categoryTotals.map((item) => (
                      <article key={item.category} className="trip-row">
                        <div>{item.category}</div>
                        <div>{item.expenseCount} expenses</div>
                        <div>
                          {item.totalLocalAmount} {reportSummary.localCurrency}
                        </div>
                        <div>
                          {item.totalHomeAmount} {reportSummary.homeCurrency}
                        </div>
                      </article>
                    ))}
                  </>
                )}
              </>
            )}
          </section>
        )}

        <form
          className="trip-form"
          onSubmit={(event) => {
            handleExpenseSubmit(event).catch((submitError) => {
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : "Expense submit failed unexpectedly."
              );
            });
          }}
        >
          <label>
            Category
            <select
              value={expenseForm.category}
              onChange={(event) =>
                setExpenseForm({ ...expenseForm, category: event.target.value })
              }
            >
              <option value="Transport">Transport</option>
              <option value="Meal">Meal</option>
              <option value="TouristActivity">Tourist activity</option>
              <option value="Museum">Museum</option>
              <option value="Snack">Snack</option>
              <option value="Lodging">Lodging</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={expenseForm.amount}
            onChange={(event) =>
              setExpenseForm({ ...expenseForm, amount: event.target.value })
            }
          />
          <input
            required
            minLength={3}
            maxLength={3}
            placeholder="Currency"
            value={expenseForm.currency}
            onChange={(event) =>
              setExpenseForm({
                ...expenseForm,
                currency: event.target.value.toUpperCase(),
              })
            }
          />
          <label>
            Date and time
            <input
              required
              type="datetime-local"
              value={expenseForm.occurredAtUtc}
              onChange={(event) =>
                setExpenseForm({ ...expenseForm, occurredAtUtc: event.target.value })
              }
            />
          </label>
          <input
            required
            placeholder="Notes"
            value={expenseForm.notes}
            onChange={(event) =>
              setExpenseForm({ ...expenseForm, notes: event.target.value })
            }
          />
          <div className="actions">
            <button type="submit">{selectedExpenseId ? "Save expense" : "Add expense"}</button>
            {selectedExpenseId && (
              <button type="button" onClick={clearExpenseForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <p>
          Exchange rates are auto-assigned from the configured provider when an
          expense is listed and no local rate exists for that day.
        </p>

        {exchangeRates.length > 0 && (
          <>
            <h3>Saved Rates</h3>
            {exchangeRates.map((rate) => (
              <article key={`${rate.date}-${rate.fromCurrency}-${rate.toCurrency}`} className="trip-row">
                <div>{rate.date}</div>
                <div>
                  {rate.fromCurrency} to {rate.toCurrency}: {rate.rate}
                </div>
              </article>
            ))}
          </>
        )}

        {expenses.length === 0 && selectedExpensesTripId && <p>No expenses yet.</p>}
        {expenses.map((expense) => (
          <article key={expense.id} className="trip-row">
            <div>
              <strong>{expense.category}</strong> - {expense.amount} {expense.currency}
            </div>
            <div>{new Date(expense.occurredAtUtc).toLocaleString()}</div>
            <div>{expense.notes}</div>
            <div>
              Home equivalent:{" "}
              {expense.homeAmount != null && expense.homeCurrency
                ? `${expense.homeAmount} ${expense.homeCurrency}`
                : "No rate for this day/currency"}
              {expense.exchangeRateUsed != null && (
                <> (rate {expense.exchangeRateUsed})</>
              )}
            </div>
            <div className="actions">
              <button type="button" onClick={() => startExpenseEdit(expense)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => void handleExpenseDelete(expense.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Trips</h2>
        {trips.length === 0 && <p>No trips yet.</p>}
        {trips.map((trip) => (
          <article key={trip.id} className="trip-row">
            <div>
              <strong>{trip.name}</strong> - {trip.destinationCountry}
            </div>
            <div>
              {trip.startDate} to {trip.endDate}
            </div>
            <div>
              {trip.homeCurrency} / {trip.localCurrency} - {trip.status}
            </div>
            <div className="actions">
              <button type="button" onClick={() => startEdit(trip)}>
                Edit
              </button>
              {trip.status !== "Archived" && (
                <button type="button" onClick={() => void handleArchive(trip.id)}>
                  Archive
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {error && (
        <section className="card error">
          <h2>Error</h2>
          <p>{error}</p>
        </section>
      )}
    </main>
  );
}
