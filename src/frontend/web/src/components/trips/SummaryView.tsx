import { categoryLabel } from "@/app/categories";
import { formatDate, formatMoney } from "@/app/format";
import { EmptyState } from "./EmptyState";
import { useTrip } from "./TripPage";

type Row = { key: string; label: string; local: number; home: number; count: number; missing: number };

function TotalsTable({ caption, firstColumn, rows, localCurrency, homeCurrency }: { caption: string; firstColumn: string; rows: Row[]; localCurrency: string; homeCurrency: string }) {
  return (
    <table className="sa-table">
      <caption className="sa-table__caption">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{firstColumn}</th>
          <th scope="col" className="sa-table__num">
            Expenses
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
                <span className="sa-table__missing">Not converted</span>
              ) : (
                <>
                  {formatMoney(row.home, homeCurrency)}
                  {row.missing > 0 && <span className="sa-table__missing"> · {row.missing} not converted</span>}
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
  const { ledger } = useTrip();

  if (!ledger || ledger.expenseCount === 0) {
    return <EmptyState title="Nothing to summarize yet" body="Totals by category and day appear once you log expenses." />;
  }

  const byCategory: Row[] = ledger.categoryTotals.map((c) => ({
    key: c.category,
    label: categoryLabel(c.category),
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
          <dt>Total in {ledger.homeCurrency}</dt>
          <dd className="sa-numeric">{formatMoney(ledger.convertedHomeAmount, ledger.homeCurrency)}</dd>
        </div>
        <div>
          <dt>Total in {ledger.localCurrency}</dt>
          <dd className="sa-numeric sa-numeric--secondary">{formatMoney(ledger.totalLocalAmount, ledger.localCurrency)}</dd>
        </div>
        <div>
          <dt>Converted</dt>
          <dd className="sa-numeric sa-numeric--secondary">
            {ledger.convertedExpenseCount} of {ledger.expenseCount}
          </dd>
        </div>
      </dl>
      {ledger.missingHomeConversionCount > 0 && (
        <p className="sa-note sa-note--warning">
          {ledger.missingHomeConversionCount} expense{ledger.missingHomeConversionCount === 1 ? " isn't" : "s aren't"} converted yet, so the{" "}
          {ledger.homeCurrency} total leaves {ledger.missingHomeConversionCount === 1 ? "it" : "them"} out.
        </p>
      )}
      <TotalsTable caption="By category" firstColumn="Category" rows={byCategory} localCurrency={ledger.localCurrency} homeCurrency={ledger.homeCurrency} />
      <TotalsTable caption="By day" firstColumn="Day" rows={byDay} localCurrency={ledger.localCurrency} homeCurrency={ledger.homeCurrency} />
    </div>
  );
}
