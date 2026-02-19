import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders health response from the API", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.endsWith("/api/health")) {
        return {
          ok: true,
          json: async () => ({ status: "ok", utcNow: "2026-02-18T00:00:00Z" }),
        } as Response;
      }

      if (url.endsWith("/api/trips")) {
        return {
          ok: true,
          json: async () => [],
        } as Response;
      }

      if (url.includes("/api/trips/") && url.endsWith("/expenses")) {
        return {
          ok: true,
          json: async () => [],
        } as Response;
      }

      if (url.includes("/api/trips/") && url.endsWith("/exchange-rates")) {
        return {
          ok: true,
          json: async () => [],
        } as Response;
      }

      if (url.endsWith("/api/reference/countries")) {
        return {
          ok: true,
          json: async () => [
            {
              countryCode: "AR",
              countryName: "Argentina",
              currencyCode: "ARS",
              currencyName: "Argentine Peso",
            },
          ],
        } as Response;
      }

      throw new Error(`Unexpected URL in test: ${url}`);
    });

    render(<App />);

    expect(await screen.findByText("Status: ok")).toBeInTheDocument();
  });
});
