import type { ReactNode } from "react";
import { categoryLabel } from "@/app/categories";
import { formatDateTime, formatInverseRate, formatMoney, formatRate } from "@/app/format";
import { useI18n } from "@/app/i18n";
import type { Expense } from "@/app/types";
import "./MoneyRow.css";

type MoneyRowProps = {
  expense: Expense;
  homeCurrency: string;
  actions?: ReactNode;
};

/**
 * DESIGN.md signature component: category, note, and time on the left; the local amount with its
 * home-currency pair (or an explicit "Not converted" marker) on the right. Never shows a missing
 * conversion as zero.
 */
export function MoneyRow({ expense, homeCurrency, actions }: MoneyRowProps) {
  const { t } = useI18n();
  const converted = expense.homeAmount != null && expense.exchangeRateUsed != null;
  return (
    <li className="sa-money">
      <div className="sa-money__main">
        <span className="sa-money__note">{expense.notes}</span>
        <span className="sa-money__meta">
          {categoryLabel(t.categories, expense.category)} · <time dateTime={expense.occurredAtUtc}>{formatDateTime(expense.occurredAtUtc)}</time>
        </span>
      </div>
      <div className="sa-money__amounts">
        <span className="sa-money__local">{formatMoney(expense.amount, expense.currency)}</span>
        {converted ? (
          <span className="sa-money__home">
            {formatMoney(expense.homeAmount ?? 0, expense.homeCurrency ?? homeCurrency)}
            <span className="sa-money__rate" title={formatRate(expense.exchangeRateUsed ?? 0)}>
              {" · "}
              {t.money.ratePair(expense.homeCurrency ?? homeCurrency, formatInverseRate(expense.exchangeRateUsed ?? 1), expense.currency)}
            </span>
          </span>
        ) : (
          <span className="sa-money__missing">{t.money.notConverted}</span>
        )}
      </div>
      {actions && <div className="sa-money__actions">{actions}</div>}
    </li>
  );
}
