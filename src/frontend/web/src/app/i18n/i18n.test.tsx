import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { formatMoney, setFormatLocale } from "../format";
import { en } from "./en";
import { es } from "./es";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (typeof value === "function") return `fn/${value.length}`;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape((value as Record<string, unknown>)[k])]));
  }
  return typeof value;
}

function setBrowserLanguages(languages: string[]) {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(languages);
  vi.spyOn(window.navigator, "language", "get").mockReturnValue(languages[0]);
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setFormatLocale("en-US");
});

describe("catalogs", () => {
  it("Spanish provides exactly the same keys, list lengths, and parameters as English", () => {
    expect(shape(es)).toEqual(shape(en));
  });
});

describe("language selection", () => {
  it("uses Spanish when the browser prefers any Spanish variant", () => {
    setBrowserLanguages(["es-AR", "en"]);
    render(<App />);
    expect(screen.getAllByRole("button", { name: es.common.tryPreview }).length).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe("es");
  });

  it("uses English for other browser languages", () => {
    setBrowserLanguages(["fr-FR"]);
    render(<App />);
    expect(screen.getAllByRole("button", { name: en.common.tryPreview }).length).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe("en");
  });

  it("prefers the saved choice over the browser language", () => {
    setBrowserLanguages(["en-US"]);
    localStorage.setItem("sa_locale", "es");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /las cuentas claras/i })).toBeInTheDocument();
  });

  it("switches language, updates the document lang, and remembers the choice", () => {
    setBrowserLanguages(["en-US"]);
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: en.locale.switchToLabel }));

    expect(screen.getByRole("heading", { level: 1, name: /las cuentas claras/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: en.common.tryPreview })).not.toBeInTheDocument();
    expect(document.documentElement.lang).toBe("es");
    expect(localStorage.getItem("sa_locale")).toBe("es");

    fireEvent.click(screen.getByRole("button", { name: es.locale.switchToLabel }));
    expect(screen.getByRole("heading", { level: 1, name: /accounting clarity/i })).toBeInTheDocument();
  });

  it("shows the Spanish sample trip with Spanish categories and markers", () => {
    setBrowserLanguages(["es-MX"]);
    render(<App />);
    const sample = screen.getByRole("figure", { name: es.sample.figureLabel });
    expect(sample).toHaveTextContent(es.sample.notes.taxi);
    expect(sample).toHaveTextContent(es.categories.Transport);
    expect(sample).toHaveTextContent(es.money.notConverted);
  });
});

describe("formatting", () => {
  it("formats money with the active locale's separators", () => {
    setFormatLocale("es-AR");
    expect(formatMoney(18500, "ARS")).toMatch(/18\.500,00/);
    setFormatLocale("en-US");
    expect(formatMoney(18500, "ARS")).toMatch(/18,500\.00/);
  });
});
