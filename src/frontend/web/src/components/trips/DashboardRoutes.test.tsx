import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/app/i18n";
import type { Expense, LedgerSummary, Trip } from "@/app/types";
import { DashboardRoutes } from "./DashboardRoutes";

vi.mock("@/app/AuthContext", () => ({
  useAuth: () => ({ user: { email: "traveler@example.com" }, token: "test-token", logout: vi.fn() }),
}));

const tripId = "11111111-1111-1111-1111-111111111111";

const trip: Trip = {
  id: tripId,
  name: "Buenos Aires",
  destinationCountry: "Argentina",
  homeCurrency: "USD",
  localCurrency: "ARS",
  startDate: "2026-01-01",
  endDate: "2026-01-10",
  status: "Active",
};

const converted: Expense = {
  id: "e-1",
  tripId,
  category: "Transport",
  amount: 18500,
  currency: "ARS",
  homeAmount: 17.62,
  homeCurrency: "USD",
  exchangeRateUsed: 0.000952,
  occurredAtUtc: "2026-01-03T15:00:00Z",
  notes: "Taxi to the airport",
};

const notConverted: Expense = { ...converted, id: "e-2", category: "Museum", amount: 9000, homeAmount: null, exchangeRateUsed: null, notes: "MALBA" };

const ledger: LedgerSummary = {
  tripId,
  localCurrency: "ARS",
  homeCurrency: "USD",
  totalLocalAmount: 27500,
  convertedHomeAmount: 17.62,
  expenseCount: 2,
  convertedExpenseCount: 1,
  missingHomeConversionCount: 1,
  categoryTotals: [],
  dayTotals: [],
};

type Handler = (init?: RequestInit) => Response;
let routes: Record<string, Handler>;

const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  const method = init?.method ?? "GET";
  const path = String(input).split("?")[0];
  const handler = routes[`${method} ${path}`];
  return handler ? handler(init) : new Response("Not Found", { status: 404 });
});

function calls(method: string, path: string) {
  return fetchMock.mock.calls.filter(([input, init]) => (init?.method ?? "GET") === method && String(input).startsWith(path));
}

function renderAt(path: string) {
  return render(
    <I18nProvider initialLocale="en">
      <MemoryRouter initialEntries={[path]}>
        <DashboardRoutes />
      </MemoryRouter>
    </I18nProvider>,
  );
}

beforeEach(() => {
  routes = {
    "GET /api/health": () => Response.json({ status: "ok" }),
    "GET /api/trips": () => Response.json([trip]),
    [`GET /api/trips/${tripId}`]: () => Response.json(trip),
    [`GET /api/trips/${tripId}/expenses`]: () => Response.json([converted, notConverted]),
    [`GET /api/trips/${tripId}/ledger/summary`]: () => Response.json(ledger),
  };
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("trips list", () => {
  it("invites the first trip when there are none", async () => {
    routes["GET /api/trips"] = () => Response.json([]);
    renderAt("/trips");
    expect(await screen.findByText("Start your first trip")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New trip" })).toHaveAttribute("href", "/trips/new");
  });

  it("links each trip to its trip view", async () => {
    renderAt("/trips");
    const link = await screen.findByRole("link", { name: /buenos aires/i });
    expect(link).toHaveAttribute("href", `/trips/${tripId}`);
  });
});

describe("trip view", () => {
  it("shows the trip header and money rows with an explicit missing conversion", async () => {
    renderAt(`/trips/${tripId}`);
    expect(await screen.findByRole("heading", { level: 1, name: /buenos aires/i })).toBeInTheDocument();
    expect(calls("GET", `/api/trips/${tripId}/ledger/summary`)).toHaveLength(1);

    const taxi = (await screen.findByText("Taxi to the airport")).closest("li");
    expect(taxi).not.toBeNull();
    expect(within(taxi as HTMLElement).getByText(/rate/)).toBeInTheDocument();

    const museum = screen.getByText("MALBA").closest("li");
    expect(within(museum as HTMLElement).getByText("Not converted")).toBeInTheDocument();
    expect(screen.getByText("1 not converted")).toBeInTheDocument();
  });

  it("adds an expense in the trip's local currency and keeps the form ready for the next one", async () => {
    routes[`POST /api/trips/${tripId}/expenses`] = (init) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return Response.json({ ...converted, id: "e-3", ...body }, { status: 201 });
    };
    renderAt(`/trips/${tripId}/expenses`);

    fireEvent.change(await screen.findByLabelText("Amount"), { target: { value: "1500" } });
    fireEvent.change(screen.getByLabelText("What was it?"), { target: { value: "Coffee" } });
    fireEvent.click(screen.getByRole("button", { name: "Add expense" }));

    await waitFor(() => expect(calls("POST", `/api/trips/${tripId}/expenses`)).toHaveLength(1));
    const body = JSON.parse(String(calls("POST", `/api/trips/${tripId}/expenses`)[0][1]?.body)) as Record<string, unknown>;
    expect(body).toMatchObject({ amount: 1500, currency: "ARS", notes: "Coffee", category: "Meal" });
    expect(typeof body.occurredAtUtc).toBe("string");
    expect(await screen.findByText("Expense added")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toHaveValue(null);
  });

  it("surfaces a failed save inline instead of failing silently", async () => {
    routes[`POST /api/trips/${tripId}/expenses`] = () => Response.json({ error: "Expense date must be within the trip." }, { status: 400 });
    renderAt(`/trips/${tripId}/expenses`);

    fireEvent.change(await screen.findByLabelText("Amount"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("What was it?"), { target: { value: "Snack" } });
    fireEvent.click(screen.getByRole("button", { name: "Add expense" }));

    expect(await screen.findByText("Expense date must be within the trip.")).toBeInTheDocument();
  });

  it("deletes after the undo window, and Undo cancels the request", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    routes[`DELETE /api/trips/${tripId}/expenses/e-1`] = () => new Response(null, { status: 204 });
    renderAt(`/trips/${tripId}/expenses`);

    fireEvent.click(await screen.findByRole("button", { name: "Delete Taxi to the airport" }));
    expect(screen.queryByText("Taxi to the airport", { selector: ".sa-money__note" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getByText("Taxi to the airport", { selector: ".sa-money__note" })).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(6000);
    });
    expect(calls("DELETE", `/api/trips/${tripId}/expenses/e-1`)).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Delete Taxi to the airport" }));
    await act(async () => {
      vi.advanceTimersByTime(6000);
    });
    await waitFor(() => expect(calls("DELETE", `/api/trips/${tripId}/expenses/e-1`)).toHaveLength(1));
  });

  it("disables adding expenses with an explanation when the server is unreachable", async () => {
    routes["GET /api/health"] = () => new Response("down", { status: 503 });
    renderAt(`/trips/${tripId}/expenses`);

    expect(await screen.findByText(/can't reach the server/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Add expense" })).toBeDisabled();
    expect(screen.getByText("Adding expenses is disabled while the server is unreachable.")).toBeInTheDocument();
  });

  it("downloads the CSV from the real export route using the server's file name", async () => {
    const createObjectURL = vi.fn(() => "blob:csv");
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() }));
    routes[`GET /api/trips/${tripId}/reports/export/csv`] = () =>
      new Response("Date,Amount\n", { status: 200, headers: { "Content-Disposition": 'attachment; filename="buenos-aires-2026.csv"' } });
    renderAt(`/trips/${tripId}/export`);

    fireEvent.click(await screen.findByRole("button", { name: "Download CSV" }));
    expect(await screen.findByText("Downloaded buenos-aires-2026.csv")).toBeInTheDocument();
    const [, init] = calls("GET", `/api/trips/${tripId}/reports/export/csv`)[0];
    expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-token");
  });
});
