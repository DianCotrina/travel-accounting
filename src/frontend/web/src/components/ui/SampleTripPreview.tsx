import { formatMoney } from "@/app/format";
import type { Expense } from "@/app/types";
import { MoneyRow } from "../trips/MoneyRow";
import "./SampleTripPreview.css";

// Clearly labeled sample data (PRODUCT.md: never present invented numbers as real usage).
const RATE = 0.000952;
const sampleExpenses: Expense[] = [
  { id: "s1", tripId: "sample", category: "Transport", amount: 18500, currency: "ARS", occurredAtUtc: "2026-01-03T15:10:00Z", notes: "Taxi from the airport" },
  { id: "s2", tripId: "sample", category: "Meal", amount: 32400, currency: "ARS", occurredAtUtc: "2026-01-03T23:40:00Z", notes: "Dinner in Palermo" },
  { id: "s3", tripId: "sample", category: "Museum", amount: 9000, currency: "ARS", occurredAtUtc: "2026-01-04T17:00:00Z", notes: "Museum tickets", homeAmount: null },
  { id: "s4", tripId: "sample", category: "Snack", amount: 2800, currency: "ARS", occurredAtUtc: "2026-01-04T20:20:00Z", notes: "Coffee and medialunas" },
].map((e) =>
  e.homeAmount === null
    ? { ...e, homeCurrency: null, exchangeRateUsed: null }
    : { ...e, homeAmount: Math.round(e.amount * RATE * 100) / 100, homeCurrency: "USD", exchangeRateUsed: RATE },
);

const localTotal = sampleExpenses.reduce((sum, e) => sum + e.amount, 0);
const homeTotal = sampleExpenses.reduce((sum, e) => sum + (e.homeAmount ?? 0), 0);
const missing = sampleExpenses.filter((e) => e.homeAmount == null).length;

/** The hero's product proof: a labeled sample trip rendered with the app's real Money Row. */
export function SampleTripPreview() {
  return (
    <figure className="sa-sampleTrip" aria-label="Sample trip: Buenos Aires in pesos, converted to US dollars">
      <div className="sa-sampleTrip__header">
        <div>
          <span className="sa-sampleTrip__label">Sample trip</span>
          <p className="sa-sampleTrip__name">Buenos Aires, January</p>
          <p className="sa-sampleTrip__meta">ARS → USD · rate stored with each expense</p>
        </div>
        <div className="sa-sampleTrip__total">
          <span className="sa-sampleTrip__totalHome">{formatMoney(homeTotal, "USD")}</span>
          <span className="sa-sampleTrip__totalLocal">{formatMoney(localTotal, "ARS")}</span>
          {missing > 0 && <span className="sa-sampleTrip__missing">{missing} not converted yet</span>}
        </div>
      </div>
      <ul className="sa-moneyList sa-sampleTrip__rows">
        {sampleExpenses.map((expense) => (
          <MoneyRow key={expense.id} expense={expense} homeCurrency="USD" />
        ))}
      </ul>
      <figcaption className="sa-sampleTrip__caption">Sample data showing how expenses look in the app.</figcaption>
    </figure>
  );
}
