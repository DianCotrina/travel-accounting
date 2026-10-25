// Locale-aware formatting for money and dates (DESIGN.md Tabular Money and Paired Currency rules).

const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "code" }).format(amount);
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    // Unknown ISO code from user input: show the raw code rather than hiding the amount.
    console.warn(`Unsupported currency code "${currency}".`, error);
    return `${currency} ${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount)}`;
  }
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat(locale, { maximumSignificantDigits: 6 }).format(rate);
}

/** Formats a calendar date ("2026-01-10") without shifting it across time zones. */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(y, m - 1, d));
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function formatDateTime(isoDateTime: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(
    new Date(isoDateTime),
  );
}

/** Value for a `datetime-local` input representing "now" in the user's time zone. */
export function nowForDateTimeInput(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

/** Converts a stored UTC timestamp to a `datetime-local` value in the user's time zone. */
export function toDateTimeInput(isoDateTime: string): string {
  return nowForDateTimeInput(new Date(isoDateTime));
}

/** Converts a `datetime-local` value (user's time zone) to an ISO UTC timestamp for the API. */
export function fromDateTimeInput(value: string): string {
  return new Date(value).toISOString();
}

/**
 * Default "when" for a new expense: now while the trip is running; otherwise the same time of day on
 * the nearest trip day, so expenses logged before or after the trip still fall inside its dates.
 */
export function defaultExpenseTime(startDate: string, endDate: string, now = new Date()): string {
  const current = nowForDateTimeInput(now);
  const [day, time] = [current.slice(0, 10), current.slice(11, 16)];
  if (day < startDate) return `${startDate}T${time}`;
  if (day > endDate) return `${endDate}T${time}`;
  return current;
}
