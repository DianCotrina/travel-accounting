import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { apiRoutes } from "@/app/apiRoutes";
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

export function DashboardPage() {
  const { user, token, logout } = useAuth();

  const api = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T> => {
      if (!token) {
        throw new Error("Missing bearer token in auth context.");
      }

      const headers = new Headers(init?.headers);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      headers.set("Authorization", `Bearer ${token}`);

      const res = await fetch(path, { ...init, headers });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      if (res.status === 204) {
        return undefined as T;
      }
      return res.json() as Promise<T>;
    },
    [token],
  );

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
          api<Trip[]>(apiRoutes.trips()),
          api<CountryReference[]>(apiRoutes.countries()),
        ]);
        setTrips(t);
        setCountries(c);
      } catch {
        setBackendAvailable(false);
      }
    })();
  }, [api]);

  // --- load expenses when trip selection changes ---
  useEffect(() => {
    if (!selectedExpensesTripId || !backendAvailable) {
      return;
    }
    (async () => {
      try {
        const [e, r, l] = await Promise.all([
          api<Expense[]>(apiRoutes.expenses(selectedExpensesTripId)),
          api<ExchangeRate[]>(apiRoutes.exchangeRates(selectedExpensesTripId)),
          api<LedgerSummary>(apiRoutes.ledgerSummary(selectedExpensesTripId)),
        ]);
        setExpenses(e);
        setExchangeRates(r);
        setLedgerSummary(l);
      } catch {
        /* backend down */
      }
    })();
  }, [selectedExpensesTripId, backendAvailable, api]);

  // --- trip CRUD ---
  const handleTripSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!backendAvailable) return;
      try {
        if (selectedTripId) {
          const updated = await api<Trip>(apiRoutes.trip(selectedTripId), {
            method: "PUT",
            body: JSON.stringify(tripForm),
          });
          setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        } else {
          const created = await api<Trip>(apiRoutes.trips(), {
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
    [tripForm, selectedTripId, backendAvailable, api],
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
        const updated = await api<Trip>(apiRoutes.archiveTrip(tripId), { method: "POST" });
        setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } catch {
        /* backend error */
      }
    },
    [backendAvailable, api],
  );

  // --- expense CRUD ---
  const handleExpenseSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!backendAvailable || !selectedExpensesTripId) return;
      try {
        if (selectedExpenseId) {
          const updated = await api<Expense>(
            apiRoutes.expense(selectedExpensesTripId, selectedExpenseId),
            { method: "PUT", body: JSON.stringify(expenseForm) },
          );
          setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        } else {
          const created = await api<Expense>(
            apiRoutes.expenses(selectedExpensesTripId),
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
    [expenseForm, selectedExpenseId, selectedExpensesTripId, backendAvailable, api],
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

  const handleTripSelectionChange = useCallback((tripId: string) => {
    setSelectedExpensesTripId(tripId);
    setSelectedExpenseId(null);
    setExpenseForm(initialExpenseFormState);
    setExpenses([]);
    setExchangeRates([]);
    setLedgerSummary(null);
    setReportSummary(null);
  }, []);

  const handleExpenseDelete = useCallback(
    async (expenseId: string) => {
      if (!backendAvailable || !selectedExpensesTripId) return;
      try {
        await api(apiRoutes.expense(selectedExpensesTripId, expenseId), {
          method: "DELETE",
        });
        setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      } catch {
        /* backend error */
      }
    },
    [selectedExpensesTripId, backendAvailable, api],
  );

  // --- reports ---
  const handleLoadReportSummary = useCallback(async () => {
    if (!backendAvailable || !selectedExpensesTripId) return;
    try {
      const summary = await api<ReportSummary>(
        apiRoutes.reportSummary(selectedExpensesTripId, reportFilters),
      );
      setReportSummary(summary);
    } catch {
      /* backend error */
    }
  }, [selectedExpensesTripId, reportFilters, backendAvailable, api]);

  const handleDownloadReportCsv = useCallback(async () => {
    if (!backendAvailable || !selectedExpensesTripId) return;
    try {
      const res = await fetch(
        apiRoutes.reportCsv(selectedExpensesTripId, reportFilters),
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
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
  }, [selectedExpensesTripId, reportFilters, backendAvailable, token]);

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
          onTripSelectionChange={handleTripSelectionChange}
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
