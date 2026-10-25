import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardPage } from "./DashboardPage";

vi.mock("@/app/AuthContext", () => ({
  useAuth: () => ({ user: { email: "traveler@example.com" }, token: "test-token", logout: vi.fn() }),
}));

const tripId = "11111111-1111-1111-1111-111111111111";

const trip = {
  id: tripId,
  name: "Buenos Aires",
  destinationCountry: "Argentina",
  homeCurrency: "USD",
  localCurrency: "ARS",
  startDate: "2026-01-01",
  endDate: "2026-01-10",
  status: "Active",
};

const ledgerSummary = {
  tripId,
  localCurrency: "ARS",
  homeCurrency: "USD",
  totalLocalAmount: 0,
  convertedHomeAmount: 0,
  expenseCount: 0,
  convertedExpenseCount: 0,
  missingHomeConversionCount: 0,
  categoryTotals: [],
  dayTotals: [],
};

const reportSummary = {
  tripId,
  localCurrency: "ARS",
  homeCurrency: "USD",
  expenseCount: 0,
  totalLocalAmount: 0,
  totalHomeAmount: 0,
  categoryTotals: [],
};

// Responds only to the real backend routes; anything else is a 404, like the API.
const routes: Record<string, () => Response> = {
  "/api/trips": () => Response.json([trip]),
  "/api/reference/countries": () => Response.json([]),
  [`/api/trips/${tripId}/expenses`]: () => Response.json([]),
  [`/api/trips/${tripId}/exchange-rates`]: () => Response.json([]),
  [`/api/trips/${tripId}/ledger/summary`]: () => Response.json(ledgerSummary),
  [`/api/trips/${tripId}/reports/summary`]: () => Response.json(reportSummary),
  [`/api/trips/${tripId}/reports/export/csv`]: () => new Response("Date,Amount\n", { status: 200 }),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- `init` types the recorded call arguments
const fetchMock = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
  const path = String(input).split("?")[0];
  const handler = routes[path];
  return handler ? handler() : new Response("Not Found", { status: 404, statusText: "Not Found" });
});

function requestedPaths(): string[] {
  return fetchMock.mock.calls.map(([input]) => String(input));
}

describe("DashboardPage API wiring", () => {
  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: vi.fn(() => "blob:report"), revokeObjectURL: vi.fn() }));
  });

  afterEach(() => {
    // Vitest runs without globals, so Testing Library cannot auto-cleanup between tests.
    cleanup();
    vi.unstubAllGlobals();
  });

  it("loads trips and countries from the real routes", async () => {
    render(<DashboardPage />);

    await waitFor(() => expect(requestedPaths()).toContain("/api/reference/countries"));
    expect(requestedPaths()).toContain("/api/trips");
    expect(screen.queryByText(/backend is not reachable/i)).not.toBeInTheDocument();
  });

  it("requests the ledger summary, report summary, and CSV export from the real routes", async () => {
    render(<DashboardPage />);
    const tripSelect = await screen.findByRole("combobox", { name: /trip for expenses/i });
    await screen.findByRole("option", { name: /buenos aires/i });

    fireEvent.change(tripSelect, { target: { value: tripId } });
    await waitFor(() => expect(requestedPaths()).toContain(`/api/trips/${tripId}/ledger/summary`));

    fireEvent.click(screen.getByRole("button", { name: /load report/i }));
    await waitFor(() =>
      expect(requestedPaths().some((p) => p.startsWith(`/api/trips/${tripId}/reports/summary`))).toBe(true),
    );

    fireEvent.click(screen.getByRole("button", { name: /download csv/i }));
    await waitFor(() =>
      expect(requestedPaths().some((p) => p.startsWith(`/api/trips/${tripId}/reports/export/csv`))).toBe(true),
    );
    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled());

    const authHeaders = fetchMock.mock.calls.map(([, init]) => new Headers(init?.headers).get("Authorization"));
    expect(authHeaders.every((h) => h === "Bearer test-token")).toBe(true);
  });
});
