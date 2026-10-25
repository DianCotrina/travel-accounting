import { describe, expect, it } from "vitest";
import { apiRoutes } from "./apiRoutes";

// Route parity guard: every frontend API route must exist on a backend controller.
// Reads the ASP.NET controllers' [Route]/[Http*] attributes at test time, so a route renamed on
// either side fails here instead of 404-ing at runtime (PRD K-1).
const controllerSources = import.meta.glob<string>(
  "../../../../backend/TravelAccounting.Api/Controllers/*.cs",
  { query: "?raw", import: "default", eager: true },
);

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type BackendEndpoint = { method: HttpMethod; pattern: RegExp; template: string };

function joinTemplate(prefix: string, suffix: string): string {
  return [prefix, suffix].filter(Boolean).join("/").replace(/\/+/g, "/");
}

function templateToPattern(template: string): RegExp {
  const escaped = template
    .split(/(\{[^}]+\})/)
    .map((part) => (part.startsWith("{") ? "[^/]+" : part.replace(/[.*+?^$()|[\]\\]/g, "\\$&")))
    .join("");
  return new RegExp(`^/${escaped}$`, "i");
}

function parseControllers(sources: Record<string, string>): BackendEndpoint[] {
  const endpoints: BackendEndpoint[] = [];
  for (const [file, source] of Object.entries(sources)) {
    const controllerName = file.match(/(\w+)Controller\.cs$/)?.[1];
    if (!controllerName) continue;
    const classRoute = source.match(/\[Route\("([^"]*)"\)\]\s*(?:\[[^\]]*\]\s*)*public\s+(?:sealed\s+)?class/)?.[1] ?? "";
    const prefix = classRoute.replace("[controller]", controllerName.toLowerCase());
    for (const action of source.matchAll(/\[Http(Get|Post|Put|Delete|Patch)(?:\("([^"]*)"\))?\]/g)) {
      const template = joinTemplate(prefix, action[2] ?? "");
      endpoints.push({
        method: action[1].toUpperCase() as HttpMethod,
        pattern: templateToPattern(template),
        template,
      });
    }
  }
  return endpoints;
}

const endpoints = parseControllers(controllerSources);

function backendHas(method: HttpMethod, url: string): boolean {
  const path = url.split("?")[0];
  return endpoints.some((e) => e.method === method && e.pattern.test(path));
}

const tripId = "11111111-1111-1111-1111-111111111111";
const expenseId = "22222222-2222-2222-2222-222222222222";
const filters = { fromDate: "2026-01-01", toDate: "2026-01-31", category: "Meal" };

const frontendCalls: Array<[HttpMethod, string]> = [
  ["GET", apiRoutes.health()],
  ["GET", apiRoutes.trip(tripId)],
  ["GET", apiRoutes.trips()],
  ["POST", apiRoutes.trips()],
  ["PUT", apiRoutes.trip(tripId)],
  ["POST", apiRoutes.archiveTrip(tripId)],
  ["GET", apiRoutes.countries()],
  ["GET", apiRoutes.expenses(tripId)],
  ["POST", apiRoutes.expenses(tripId)],
  ["PUT", apiRoutes.expense(tripId, expenseId)],
  ["DELETE", apiRoutes.expense(tripId, expenseId)],
  ["GET", apiRoutes.exchangeRates(tripId)],
  ["GET", apiRoutes.ledgerSummary(tripId)],
  ["GET", apiRoutes.reportSummary(tripId, filters)],
  ["GET", apiRoutes.reportCsv(tripId, filters)],
];

describe("apiRoutes", () => {
  it("parses the backend controllers", () => {
    expect(Object.keys(controllerSources).length).toBeGreaterThan(0);
    expect(endpoints.length).toBeGreaterThan(0);
    // Sanity: the previously broken paths must not match, or the parity check is vacuous.
    expect(backendHas("GET", "/api/countries")).toBe(false);
    expect(backendHas("GET", `/api/trips/${tripId}/ledger`)).toBe(false);
    expect(backendHas("GET", `/api/trips/${tripId}/report`)).toBe(false);
  });

  it.each(frontendCalls)("%s %s exists on the backend", (method, url) => {
    expect(backendHas(method, url), `no backend endpoint for ${method} ${url}`).toBe(true);
  });

  it("builds report query strings from non-empty filters only", () => {
    expect(apiRoutes.reportSummary(tripId, filters)).toBe(
      `/api/trips/${tripId}/reports/summary?fromDate=2026-01-01&toDate=2026-01-31&category=Meal`,
    );
    expect(apiRoutes.reportCsv(tripId, { fromDate: "", toDate: "", category: "" })).toBe(
      `/api/trips/${tripId}/reports/export/csv`,
    );
  });
});
