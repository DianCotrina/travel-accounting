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

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [countries, setCountries] = useState<CountryReference[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
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
      Promise.all([loadExpenses(), loadExchangeRates()]).catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Expenses or rates load failed unexpectedly."
        );
      });
    }
  }, [loadExpenses, loadExchangeRates, selectedExpensesTripId]);

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
    if (selectedExpenseId === expenseId) {
      clearExpenseForm();
    }
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
