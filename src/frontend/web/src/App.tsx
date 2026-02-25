import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ExpensesSection } from "./components/ExpensesSection";
import { HealthCard } from "./components/HealthCard";
import { LandingPage } from "./components/LandingPage";
import { TripsSection } from "./components/TripsSection";
import {
  type CountryReference,
  type Expense,
  type ExpenseFormState,
  type ExchangeRate,
  type HealthResponse,
  type LedgerSummary,
  type ReportFilterState,
  type ReportSummary,
  type Trip,
  type TripFormState,
  initialExpenseFormState,
  initialFormState,
  initialReportFilters,
} from "./app/types";

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [countries, setCountries] = useState<CountryReference[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [ledgerSummary, setLedgerSummary] = useState<LedgerSummary | null>(
    null,
  );
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(
    null,
  );
  const [reportFilters, setReportFilters] =
    useState<ReportFilterState>(initialReportFilters);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null,
  );
  const [selectedExpensesTripId, setSelectedExpensesTripId] = useState("");
  const [form, setForm] = useState<TripFormState>(initialFormState);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(
    initialExpenseFormState,
  );

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const userId = import.meta.env.VITE_USER_ID ?? "demo-user";
  const healthUrl = apiBaseUrl ? `${apiBaseUrl}/api/health` : "/api/health";
  const tripsUrl = apiBaseUrl ? `${apiBaseUrl}/api/trips` : "/api/trips";
  const countriesUrl = apiBaseUrl
    ? `${apiBaseUrl}/api/reference/countries`
    : "/api/reference/countries";

  const selectedCountry = countries.find(
    (country) => country.countryName === form.destinationCountry,
  );
  const selectedTripForExpenses = trips.find(
    (trip) => trip.id === selectedExpensesTripId,
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

  const apiFetch = useCallback(
    async (input: string, init?: RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers);
      headers.set("X-User-Id", userId);
      return fetch(input, { ...init, headers });
    },
    [userId],
  );

  const loadHealth = useCallback(async (): Promise<void> => {
    const response = await apiFetch(healthUrl);
    if (!response.ok) {
      throw new Error(`Health request failed with ${response.status}.`);
    }

    setHealth((await response.json()) as HealthResponse);
  }, [apiFetch, healthUrl]);

  const loadTrips = useCallback(async (): Promise<void> => {
    try {
      const response = await apiFetch(tripsUrl);
      if (!response.ok) {
        throw new Error(`Trip list request failed with ${response.status}.`);
      }

      setTrips((await response.json()) as Trip[]);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load trips unexpectedly.",
      );
    }
  }, [apiFetch, tripsUrl]);

  const loadCountries = useCallback(async (): Promise<void> => {
    const response = await apiFetch(countriesUrl);
    if (!response.ok) {
      throw new Error(`Countries request failed with ${response.status}.`);
    }

    setCountries((await response.json()) as CountryReference[]);
  }, [apiFetch, countriesUrl]);

  const loadExpenses = useCallback(async (): Promise<void> => {
    if (!selectedExpensesTripId) {
      setExpenses([]);
      return;
    }

    const response = await apiFetch(expensesUrl);
    if (!response.ok) {
      throw new Error(`Expenses request failed with ${response.status}.`);
    }

    setExpenses((await response.json()) as Expense[]);
  }, [apiFetch, expensesUrl, selectedExpensesTripId]);

  const loadExchangeRates = useCallback(async (): Promise<void> => {
    if (!selectedExpensesTripId) {
      setExchangeRates([]);
      return;
    }

    const response = await apiFetch(exchangeRatesUrl);
    if (!response.ok) {
      throw new Error(`Exchange rates request failed with ${response.status}.`);
    }

    setExchangeRates((await response.json()) as ExchangeRate[]);
  }, [apiFetch, exchangeRatesUrl, selectedExpensesTripId]);

  const loadLedgerSummary = useCallback(async (): Promise<void> => {
    if (!selectedExpensesTripId) {
      setLedgerSummary(null);
      return;
    }

    const response = await apiFetch(ledgerSummaryUrl);
    if (!response.ok) {
      throw new Error(`Ledger summary request failed with ${response.status}.`);
    }

    setLedgerSummary((await response.json()) as LedgerSummary);
  }, [apiFetch, ledgerSummaryUrl, selectedExpensesTripId]);

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

    const response = await apiFetch(
      query.toString()
        ? `${reportSummaryUrl}?${query.toString()}`
        : reportSummaryUrl,
    );
    if (!response.ok) {
      throw new Error(`Report summary request failed with ${response.status}.`);
    }

    setReportSummary((await response.json()) as ReportSummary);
  }, [
    apiFetch,
    reportFilters.category,
    reportFilters.fromDate,
    reportFilters.toDate,
    reportSummaryUrl,
    selectedExpensesTripId,
  ]);

  useEffect(() => {
    loadHealth()
      .then(async () => {
        await Promise.all([loadTrips(), loadCountries()]);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? `API connection failed. Ensure backend is running. Details: ${loadError.message}`
            : "API connection failed unexpectedly.",
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
            : "Expenses or rates load failed unexpectedly.",
        );
      });
    } else {
      setLedgerSummary(null);
      setReportSummary(null);
    }
  }, [
    loadExpenses,
    loadExchangeRates,
    loadLedgerSummary,
    loadReportSummary,
    selectedExpensesTripId,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
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

    const response = await apiFetch(url, {
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

    const response = await apiFetch(`${tripsUrl}/${id}/archive`, {
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
    event: FormEvent<HTMLFormElement>,
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
    const url = selectedExpenseId
      ? `${expensesUrl}/${selectedExpenseId}`
      : expensesUrl;

    const response = await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Expense ${selectedExpenseId ? "update" : "create"} failed with ${response.status}: ${text}`,
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

    const response = await apiFetch(`${expensesUrl}/${expenseId}`, {
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

    const response = await apiFetch(
      query.toString() ? `${reportCsvUrl}?${query.toString()}` : reportCsvUrl,
    );
    if (!response.ok) {
      throw new Error(`Report export failed with ${response.status}.`);
    }

    const blob = await response.blob();
    const contentDisposition =
      response.headers.get("content-disposition") ?? "";
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

  function handleExpensesTripSelectionChange(tripId: string): void {
    setSelectedExpensesTripId(tripId);
    setSelectedExpenseId(null);
    const selectedTrip = trips.find((trip) => trip.id === tripId);
    setExpenseForm({
      ...initialExpenseFormState,
      currency: selectedTrip?.localCurrency ?? "ARS",
    });
    setReportFilters(initialReportFilters);
  }

  return (
    <main className="app">
      <LandingPage />

      <section id="workspace" className="workspace-shell">
        <div className="workspace-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>Travel Accounting</h1>
            <p className="subtitle">
              Create trips, log expenses, track conversions, and export reports.
            </p>
          </div>
        </div>

        <HealthCard health={health} />

        <TripsSection
          form={form}
          selectedTripId={selectedTripId}
          selectedCountry={selectedCountry}
          countries={countries}
          trips={trips}
          onFormChange={setForm}
          onClearForm={clearForm}
          onStartEdit={startEdit}
          onArchive={(tripId) => {
            void handleArchive(tripId);
          }}
          onSubmit={(event) => {
            handleSubmit(event).catch((submitError) => {
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : "Trip submit failed unexpectedly.",
              );
            });
          }}
        />

        <ExpensesSection
          trips={trips}
          selectedExpensesTripId={selectedExpensesTripId}
          selectedExpenseId={selectedExpenseId}
          selectedTripForExpenses={selectedTripForExpenses}
          expenseForm={expenseForm}
          expenses={expenses}
          exchangeRates={exchangeRates}
          ledgerSummary={ledgerSummary}
          reportSummary={reportSummary}
          reportFilters={reportFilters}
          onTripSelectionChange={handleExpensesTripSelectionChange}
          onExpenseFormChange={setExpenseForm}
          onClearExpenseForm={clearExpenseForm}
          onStartExpenseEdit={startExpenseEdit}
          onExpenseDelete={(expenseId) => {
            void handleExpenseDelete(expenseId);
          }}
          onReportFiltersChange={setReportFilters}
          onLoadReportSummary={() => {
            handleLoadReportSummary().catch((loadError) => {
              setError(
                loadError instanceof Error
                  ? loadError.message
                  : "Report summary failed unexpectedly.",
              );
            });
          }}
          onDownloadReportCsv={() => {
            handleDownloadReportCsv().catch((loadError) => {
              setError(
                loadError instanceof Error
                  ? loadError.message
                  : "Report export failed unexpectedly.",
              );
            });
          }}
          onExpenseSubmit={(event) => {
            handleExpenseSubmit(event).catch((submitError) => {
              setError(
                submitError instanceof Error
                  ? submitError.message
                  : "Expense submit failed unexpectedly.",
              );
            });
          }}
        />
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
