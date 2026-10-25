import { useState } from "react";
import type { FormEvent } from "react";
import { errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { EXPENSE_CATEGORIES, categoryLabel } from "@/app/categories";
import { formatMoney } from "@/app/format";
import { useI18n } from "@/app/i18n";
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
  const { t } = useI18n();
  const [filters, setFilters] = useState<ReportFilterState>(initialReportFilters);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [busy, setBusy] = useState<"preview" | "download" | null>(null);
  const [error, setError] = useState<unknown>(null);

  const rangeInvalid = filters.fromDate !== "" && filters.toDate !== "" && filters.toDate < filters.fromDate;

  async function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rangeInvalid) return;
    setBusy("preview");
    setError(null);
    try {
      setSummary(await json<ReportSummary>(apiRoutes.reportSummary(trip.id, filters)));
    } catch (err) {
      setError(err);
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
      const fileName = fileNameFrom(res.headers.get("Content-Disposition"), t.exportView.fallbackFile(trip.name));
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      notify(t.exportView.downloaded(fileName));
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="sa-export">
      <form className="sa-form sa-surface" onSubmit={preview} aria-labelledby="export-title">
        <h2 id="export-title" className="sa-sectionTitle">
          {t.exportView.title}
        </h2>
        <div className="sa-form__row sa-form__row--three">
          <Field label={t.exportView.from}>
            <input className="sa-input" type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
          </Field>
          <Field label={t.exportView.to} error={rangeInvalid ? t.exportView.rangeInvalid : undefined}>
            <input
              className="sa-input"
              type="date"
              min={filters.fromDate || undefined}
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </Field>
          <Field label={t.exportView.category}>
            <select className="sa-input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">{t.exportView.allCategories}</option>
              {EXPENSE_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {categoryLabel(t.categories, value)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {error != null && (
          <p className="sa-form__error" role="alert">
            {errorMessage(error, t.errors)}
          </p>
        )}
        <div className="sa-form__actions">
          <button type="button" className="sa-btn-primary" onClick={download} disabled={busy !== null} aria-busy={busy === "download"}>
            {busy === "download" ? t.exportView.preparing : t.exportView.download}
          </button>
          <button type="submit" className="sa-btn-secondary" disabled={busy !== null} aria-busy={busy === "preview"}>
            {busy === "preview" ? t.exportView.loadingPreview : t.exportView.preview}
          </button>
        </div>
      </form>

      {summary && (
        <section className="sa-surface sa-export__preview" aria-labelledby="export-preview-title" aria-live="polite">
          <h3 id="export-preview-title" className="sa-sectionTitle">
            {t.exportView.count(summary.expenseCount)} · {formatMoney(summary.totalHomeAmount, summary.homeCurrency)}
          </h3>
          <ul className="sa-moneyList">
            {summary.categoryTotals.map((c) => (
              <li key={c.category} className="sa-money sa-money--compact">
                <div className="sa-money__main">
                  <span className="sa-money__note">{categoryLabel(t.categories, c.category)}</span>
                  <span className="sa-money__meta">{t.exportView.count(c.expenseCount)}</span>
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
