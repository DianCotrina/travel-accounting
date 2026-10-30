import { describe, expect, it } from "vitest";
import { defaultExpenseTime, formatInverseRate, setFormatLocale } from "./format";

describe("formatInverseRate", () => {
  it("shows local units per 1 home unit, the way travelers read rates", () => {
    setFormatLocale("en-US");
    expect(formatInverseRate(0.000952)).toBe("1,050.42");
    expect(formatInverseRate(1.08)).toBe("0.9259");
  });
});

describe("defaultExpenseTime", () => {
  const at = (iso: string) => new Date(`${iso}:00`);

  it("uses now while the trip is running", () => {
    expect(defaultExpenseTime("2026-01-01", "2026-01-10", at("2026-01-05T14:30"))).toBe("2026-01-05T14:30");
  });

  it("keeps the time of day but moves to the last trip day after the trip", () => {
    expect(defaultExpenseTime("2026-01-01", "2026-01-10", at("2026-10-25T09:15"))).toBe("2026-01-10T09:15");
  });

  it("moves to the first trip day before the trip starts", () => {
    expect(defaultExpenseTime("2026-01-01", "2026-01-10", at("2025-12-20T20:00"))).toBe("2026-01-01T20:00");
  });
});
