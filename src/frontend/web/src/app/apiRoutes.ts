import type { ReportFilterState } from "./types";

// Single source of backend API paths. Each path must match an ASP.NET controller route;
// `apiRoutes.test.ts` checks them against src/backend/TravelAccounting.Api/Controllers.

function reportQuery(filters: ReportFilterState): string {
  const params = new URLSearchParams();
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.category) params.set("category", filters.category);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const apiRoutes = {
  health: () => "/api/health",
  trips: () => "/api/trips",
  trip: (tripId: string) => `/api/trips/${tripId}`,
  archiveTrip: (tripId: string) => `/api/trips/${tripId}/archive`,
  countries: () => "/api/reference/countries",
  expenses: (tripId: string) => `/api/trips/${tripId}/expenses`,
  expense: (tripId: string, expenseId: string) => `/api/trips/${tripId}/expenses/${expenseId}`,
  exchangeRates: (tripId: string) => `/api/trips/${tripId}/exchange-rates`,
  ledgerSummary: (tripId: string) => `/api/trips/${tripId}/ledger/summary`,
  reportSummary: (tripId: string, filters: ReportFilterState) =>
    `/api/trips/${tripId}/reports/summary${reportQuery(filters)}`,
  reportCsv: (tripId: string, filters: ReportFilterState) =>
    `/api/trips/${tripId}/reports/export/csv${reportQuery(filters)}`,
};
