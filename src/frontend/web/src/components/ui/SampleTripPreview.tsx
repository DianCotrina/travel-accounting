import { formatMoney } from "@/app/format";
import { useI18n } from "@/app/i18n";
import type { Messages } from "@/app/i18n/en";
import type { Expense } from "@/app/types";
import { MoneyRow } from "../trips/MoneyRow";
import "./SampleTripPreview.css";

// Clearly labeled sample data (PRODUCT.md: never present invented numbers as real usage).
const RATE = 0.000952;

function sampleExpenses(notes: Messages["sample"]["notes"]): Expense[] {
  return [
    { id: "s1", tripId: "sample", category: "Transport", amount: 18500, currency: "ARS", occurredAtUtc: "2026-01-03T15:10:00Z", notes: notes.taxi },
    { id: "s2", tripId: "sample", category: "Meal", amount: 32400, currency: "ARS", occurredAtUtc: "2026-01-03T23:40:00Z", notes: notes.dinner },
    { id: "s3", tripId: "sample", category: "Museum", amount: 9000, currency: "ARS", occurredAtUtc: "2026-01-04T17:00:00Z", notes: notes.museum, homeAmount: null },
    { id: "s4", tripId: "sample", category: "Snack", amount: 2800, currency: "ARS", occurredAtUtc: "2026-01-04T20:20:00Z", notes: notes.coffee },
  ].map((e) =>
    e.homeAmount === null
      ? { ...e, homeCurrency: null, exchangeRateUsed: null }
      : { ...e, homeAmount: Math.round(e.amount * RATE * 100) / 100, homeCurrency: "USD", exchangeRateUsed: RATE },
  );
}

/** The hero's product proof: a labeled sample trip rendered with the app's real Money Row. */
export function SampleTripPreview() {
  const { t } = useI18n();
  const expenses = sampleExpenses(t.sample.notes);
  const localTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const homeTotal = expenses.reduce((sum, e) => sum + (e.homeAmount ?? 0), 0);
  const missing = expenses.filter((e) => e.homeAmount == null).length;
  return (
    <figure className="sa-sampleTrip" aria-label={t.sample.figureLabel}>
      <div className="sa-sampleTrip__header">
        <div>
          <span className="sa-sampleTrip__label">{t.sample.label}</span>
          <p className="sa-sampleTrip__name">{t.sample.name}</p>
          <p className="sa-sampleTrip__meta">{t.sample.meta}</p>
        </div>
        <div className="sa-sampleTrip__total">
          <span className="sa-sampleTrip__totalHome">{formatMoney(homeTotal, "USD")}</span>
          <span className="sa-sampleTrip__totalLocal">{formatMoney(localTotal, "ARS")}</span>
          {missing > 0 && <span className="sa-sampleTrip__missing">{t.sample.notConvertedYet(missing)}</span>}
        </div>
      </div>
      <ul className="sa-moneyList sa-sampleTrip__rows">
        {expenses.map((expense) => (
          <MoneyRow key={expense.id} expense={expense} homeCurrency="USD" />
        ))}
      </ul>
      <figcaption className="sa-sampleTrip__caption">{t.sample.caption}</figcaption>
    </figure>
  );
}
