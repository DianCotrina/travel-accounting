import { useState } from "react";
import type { FormEvent } from "react";
import { errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { EXPENSE_CATEGORIES, categoryLabel } from "@/app/categories";
import { formatMoney } from "@/app/format";
import { useToast } from "@/app/toast";
import type { ReportFilterState, ReportSummary } from "@/app/types";
import { initialReportFilters } from "@/app/types";
import { Field } from "./Field";
import { useTrip } from "./TripPage";

function fileNameFrom(disposition: string | null, fallback: string): string {
  const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : fallback;
}

/** `/trips/:tripId/export`: filter, preview the totals, and download CSV for finance or bookkeeping. */
export function ExportView() {
  const { trip } = useTrip();
  const { json, send } = useApi();
  const { notify } = useToast();
  const [filters, setFilters] = useState<ReportFilterState>(initialReportFilters);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [busy, setBusy] = useState<"preview" | "download" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rangeInvalid = filters.fromDate !== "" && filters.toDate !== "" && filters.toDate < filters.fromDate;

  async function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rangeInvalid) return;
    setBusy("preview");
    setError(null);
    try {
      setSummary(await json<ReportSummary>(apiRoutes.reportSummary(trip.id, filters)));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  }

  async function download() {
    if (rangeInvalid) return;
    setBusy("download");
    setError(null);
    try {
      const res = await send(apiRoutes.reportCsv(trip.id, filters));
      const fileName = fileNameFrom(res.headers.get("Content-Disposition"), `${trip.name}-expenses.csv`);
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      notify(`Downloaded ${fileName}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="sa-export">
      <form className="sa-form sa-surface" onSubmit={preview} aria-labelledby="export-title">
        <h2 id="export-title" className="sa-sectionTitle">
          Export expenses
        </h2>
        <div className="sa-form__row sa-form__row--three">
          <Field label="From">
            <input className="sa-input" type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
          </Field>
          <Field label="To" error={rangeInvalid ? "End date can't be before the start date." : undefined}>
            <input
              className="sa-input"
              type="date"
              min={filters.fromDate || undefined}
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </Field>
          <Field label="Category">
            <select className="sa-input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {error && (
          <p className="sa-form__error" role="alert">
            {error}
          </p>
        )}
        <div className="sa-form__actions">
          <button type="button" className="sa-btn-primary" onClick={download} disabled={busy !== null} aria-busy={busy === "download"}>
            {busy === "download" ? "Preparing CSV…" : "Download CSV"}
          </button>
          <button type="submit" className="sa-btn-secondary" disabled={busy !== null} aria-busy={busy === "preview"}>
            {busy === "preview" ? "Loading…" : "Preview totals"}
          </button>
        </div>
      </form>

      {summary && (
        <section className="sa-surface sa-export__preview" aria-labelledby="export-preview-title" aria-live="polite">
          <h3 id="export-preview-title" className="sa-sectionTitle">
            {summary.expenseCount} expense{summary.expenseCount === 1 ? "" : "s"} · {formatMoney(summary.totalHomeAmount, summary.homeCurrency)}
          </h3>
          <ul className="sa-moneyList">
            {summary.categoryTotals.map((c) => (
              <li key={c.category} className="sa-money sa-money--compact">
                <div className="sa-money__main">
                  <span className="sa-money__note">{categoryLabel(c.category)}</span>
                  <span className="sa-money__meta">
                    {c.expenseCount} expense{c.expenseCount === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="sa-money__amounts">
                  <span className="sa-money__local">{formatMoney(c.totalLocalAmount, summary.localCurrency)}</span>
                  <span className="sa-money__home">{formatMoney(c.totalHomeAmount, summary.homeCurrency)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
