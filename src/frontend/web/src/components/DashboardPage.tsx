import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import type {
  CountryReference,
  ExchangeRate,
  Expense,
  ExpenseFormState,
  LedgerSummary,
  ReportFilterState,
  ReportSummary,
  Trip,
  TripFormState,
} from "@/app/types";
import {
  initialExpenseFormState,
  initialFormState,
  initialReportFilters,
} from "@/app/types";
import { TripsSection } from "./TripsSection";
import { ExpensesSection } from "./ExpensesSection";
import "./DashboardPage.css";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export function DashboardPage() {
  const { user, logout } = useAuth();

  // --- trips state ---
  const [trips, setTrips] = useState<Trip[]>([]);
  const [countries, setCountries] = useState<CountryReference[]>([]);
  const [tripForm, setTripForm] = useState<TripFormState>(initialFormState);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // --- expenses state ---
  const [selectedExpensesTripId, setSelectedExpensesTripId] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(initialExpenseFormState);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [ledgerSummary, setLedgerSummary] = useState<LedgerSummary | null>(null);
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
  const [reportFilters, setReportFilters] = useState<ReportFilterState>(initialReportFilters);

  const [backendAvailable, setBackendAvailable] = useState(true);

  const selectedCountry = countries.find(
    (c) => c.countryName === tripForm.destinationCountry,
  );
  const selectedTripForExpenses = trips.find(
    (t) => t.id === selectedExpensesTripId,
  );

  // --- load initial data ---
  useEffect(() => {
    (async () => {
      try {
        const [t, c] = await Promise.all([
          api<Trip[]>("/api/trips"),
          api<CountryReference[]>("/api/countries"),
        ]);
        setTrips(t);
        setCountries(c);
      } catch {
        setBackendAvailable(false);
      }
    })();
  }, []);

  // --- load expenses when trip selection changes ---
  useEffect(() => {
    if (!selectedExpensesTripId || !backendAvailable) {
      setExpenses([]);
      setExchangeRates([]);
      setLedgerSummary(null);
      setReportSummary(null);
      return;
    }
    (async () => {
      try {
        const [e, r, l] = await Promise.all([
          api<Expense[]>(`/api/trips/${selectedExpensesTripId}/expenses`),
          api<ExchangeRate[]>(`/api/trips/${selectedExpensesTripId}/exchange-rates`),
          api<LedgerSummary>(`/api/trips/${selectedExpensesTripId}/ledger`),
        ]);
        setExpenses(e);
        setExchangeRates(r);
        setLedgerSummary(l);
      } catch {
        /* backend down */
      }
    })();
  }, [selectedExpensesTripId, backendAvailable]);

  // --- trip CRUD ---
  const handleTripSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!backendAvailable) return;
      try {
        if (selectedTripId) {
          const updated = await api<Trip>(`/api/trips/${selectedTripId}`, {
            method: "PUT",
            body: JSON.stringify(tripForm),
          });
          setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        } else {
          const created = await api<Trip>("/api/trips", {
            method: "POST",
            body: JSON.stringify(tripForm),
          });
          setTrips((prev) => [...prev, created]);
        }
        setTripForm(initialFormState);
        setSelectedTripId(null);
      } catch {
        /* backend error */
      }
    },
    [tripForm, selectedTripId, backendAvailable],
  );

  const handleStartTripEdit = useCallback((trip: Trip) => {
    setSelectedTripId(trip.id);
    setTripForm({
      name: trip.name,
      destinationCountry: trip.destinationCountry,
      homeCurrency: trip.homeCurrency,
      localCurrency: trip.localCurrency,
      startDate: trip.startDate,
      endDate: trip.endDate,
    });
  }, []);

  const handleClearTripForm = useCallback(() => {
    setSelectedTripId(null);
    setTripForm(initialFormState);
  }, []);

  const handleArchiveTrip = useCallback(
    async (tripId: string) => {
      if (!backendAvailable) return;
      try {
        const updated = await api<Trip>(`/api/trips/${tripId}/archive`, { method: "POST" });
        setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } catch {
        /* backend error */
      }
    },
    [backendAvailable],
  );

  // --- expense CRUD ---
  const handleExpenseSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!backendAvailable || !selectedExpensesTripId) return;
      try {
        if (selectedExpenseId) {
          const updated = await api<Expense>(
            `/api/trips/${selectedExpensesTripId}/expenses/${selectedExpenseId}`,
            { method: "PUT", body: JSON.stringify(expenseForm) },
          );
          setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        } else {
          const created = await api<Expense>(
            `/api/trips/${selectedExpensesTripId}/expenses`,
            { method: "POST", body: JSON.stringify(expenseForm) },
          );
          setExpenses((prev) => [...prev, created]);
        }
        setExpenseForm(initialExpenseFormState);
        setSelectedExpenseId(null);
      } catch {
        /* backend error */
      }
    },
    [expenseForm, selectedExpenseId, selectedExpensesTripId, backendAvailable],
  );

  const handleStartExpenseEdit = useCallback((expense: Expense) => {
    setSelectedExpenseId(expense.id);
    setExpenseForm({
      category: expense.category,
      amount: String(expense.amount),
      currency: expense.currency,
      occurredAtUtc: expense.occurredAtUtc,
      notes: expense.notes,
    });
  }, []);

  const handleClearExpenseForm = useCallback(() => {
    setSelectedExpenseId(null);
    setExpenseForm(initialExpenseFormState);
  }, []);

  const handleExpenseDelete = useCallback(
    async (expenseId: string) => {
      if (!backendAvailable || !selectedExpensesTripId) return;
      try {
        await api(`/api/trips/${selectedExpensesTripId}/expenses/${expenseId}`, {
          method: "DELETE",
        });
        setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      } catch {
        /* backend error */
      }
    },
    [selectedExpensesTripId, backendAvailable],
  );

  // --- reports ---
  const handleLoadReportSummary = useCallback(async () => {
    if (!backendAvailable || !selectedExpensesTripId) return;
    try {
      const params = new URLSearchParams();
      if (reportFilters.fromDate) params.set("fromDate", reportFilters.fromDate);
      if (reportFilters.toDate) params.set("toDate", reportFilters.toDate);
      if (reportFilters.category) params.set("category", reportFilters.category);
      const summary = await api<ReportSummary>(
        `/api/trips/${selectedExpensesTripId}/report?${params}`,
      );
      setReportSummary(summary);
    } catch {
      /* backend error */
    }
  }, [selectedExpensesTripId, reportFilters, backendAvailable]);

  const handleDownloadReportCsv = useCallback(async () => {
    if (!backendAvailable || !selectedExpensesTripId) return;
    try {
      const params = new URLSearchParams();
      if (reportFilters.fromDate) params.set("fromDate", reportFilters.fromDate);
      if (reportFilters.toDate) params.set("toDate", reportFilters.toDate);
      if (reportFilters.category) params.set("category", reportFilters.category);
      const res = await fetch(
        `/api/trips/${selectedExpensesTripId}/report/csv?${params}`,
      );
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* backend error */
    }
  }, [selectedExpensesTripId, reportFilters, backendAvailable]);

  return (
    <div className="sa-dashboard">
      <header className="sa-dashboard__topbar">
        <span className="sa-dashboard__brand">Sacatucuenta</span>
        <div className="sa-dashboard__user">
          <span className="sa-dashboard__email">{user?.email}</span>
          <button type="button" className="sa-dashboard__logout" onClick={logout}>
            <LogOut aria-hidden="true" />
            Log out
          </button>
        </div>
      </header>

      {!backendAvailable && (
        <div className="sa-dashboard__banner" role="status">
          Backend is not reachable. Data will not persist until the API is available.
        </div>
      )}

      <div className="sa-dashboard__content">
        <TripsSection
          form={tripForm}
          selectedTripId={selectedTripId}
          selectedCountry={selectedCountry}
          countries={countries}
          trips={trips}
          onSubmit={handleTripSubmit}
          onFormChange={setTripForm}
          onClearForm={handleClearTripForm}
          onStartEdit={handleStartTripEdit}
          onArchive={handleArchiveTrip}
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
          onTripSelectionChange={setSelectedExpensesTripId}
          onExpenseFormChange={setExpenseForm}
          onExpenseSubmit={handleExpenseSubmit}
          onClearExpenseForm={handleClearExpenseForm}
          onStartExpenseEdit={handleStartExpenseEdit}
          onExpenseDelete={handleExpenseDelete}
          onReportFiltersChange={setReportFilters}
          onLoadReportSummary={handleLoadReportSummary}
          onDownloadReportCsv={handleDownloadReportCsv}
        />
      </div>
    </div>
  );
}
