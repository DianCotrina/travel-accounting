import { Link } from "react-router";
import { categoryLabel } from "@/app/categories";
import { formatDate, formatMoney } from "@/app/format";
import { useI18n } from "@/app/i18n";
import type { Messages } from "@/app/i18n/en";
import { EmptyState } from "./EmptyState";
import { useTrip } from "./TripPage";

type Row = { key: string; label: string; local: number; home: number; count: number; missing: number };

function TotalsTable({ caption, firstColumn, rows, localCurrency, homeCurrency, t }: { caption: string; firstColumn: string; rows: Row[]; localCurrency: string; homeCurrency: string; t: Messages }) {
  return (
    <table className="sa-table">
      <caption className="sa-table__caption">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{firstColumn}</th>
          <th scope="col" className="sa-table__num">
            {t.summary.expensesCol}
          </th>
          <th scope="col" className="sa-table__num">
            {localCurrency}
          </th>
          <th scope="col" className="sa-table__num">
            {homeCurrency}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <th scope="row">{row.label}</th>
            <td className="sa-table__num">{row.count}</td>
            <td className="sa-table__num">{formatMoney(row.local, localCurrency)}</td>
            <td className="sa-table__num">
              {row.missing === row.count ? (
                <span className="sa-table__missing">{t.summary.notConverted}</span>
              ) : (
                <>
                  {formatMoney(row.home, homeCurrency)}
                  {row.missing > 0 && <span className="sa-table__missing"> · {t.summary.someNotConverted(row.missing)}</span>}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** `/trips/:tripId/summary`: ledger totals by category and day, with conversion coverage. */
export function SummaryView() {
  const { ledger, trip, readOnly } = useTrip();
  const { t } = useI18n();

  if (!ledger || ledger.expenseCount === 0) {
    return <EmptyState title={t.summary.emptyTitle} body={t.summary.emptyBody} />;
  }

  const byCategory: Row[] = ledger.categoryTotals.map((c) => ({
    key: c.category,
    label: categoryLabel(t.categories, c.category),
    local: c.totalLocalAmount,
    home: c.convertedHomeAmount,
    count: c.expenseCount,
    missing: c.missingHomeConversionCount,
  }));
  const byDay: Row[] = ledger.dayTotals.map((d) => ({
    key: d.date,
    label: formatDate(d.date),
    local: d.totalLocalAmount,
    home: d.convertedHomeAmount,
    count: d.expenseCount,
    missing: d.missingHomeConversionCount,
  }));

  return (
    <div className="sa-summary">
      <dl className="sa-summary__totals">
        <div>
          <dt>{t.summary.totalIn(ledger.homeCurrency)}</dt>
          <dd className="sa-numeric">{formatMoney(ledger.convertedHomeAmount, ledger.homeCurrency)}</dd>
        </div>
        <div>
          <dt>{t.summary.totalIn(ledger.localCurrency)}</dt>
          <dd className="sa-numeric sa-numeric--secondary">{formatMoney(ledger.totalLocalAmount, ledger.localCurrency)}</dd>
        </div>
        <div>
          <dt>{t.summary.converted}</dt>
          <dd className="sa-numeric sa-numeric--secondary">{t.summary.convertedOf(ledger.convertedExpenseCount, ledger.expenseCount)}</dd>
        </div>
      </dl>
      {ledger.missingHomeConversionCount > 0 && (
        <p className="sa-note sa-note--warning">
          {t.summary.missingNote(ledger.missingHomeConversionCount, ledger.homeCurrency)}{" "}
          {!readOnly && (
            <Link to={`/trips/${trip.id}/expenses`} className="sa-inlineLink">
              {t.summary.fixHint}
            </Link>
          )}
        </p>
      )}
      <TotalsTable caption={t.summary.byCategory} firstColumn={t.summary.category} rows={byCategory} localCurrency={ledger.localCurrency} homeCurrency={ledger.homeCurrency} t={t} />
      <TotalsTable caption={t.summary.byDay} firstColumn={t.summary.day} rows={byDay} localCurrency={ledger.localCurrency} homeCurrency={ledger.homeCurrency} t={t} />
    </div>
  );
}
