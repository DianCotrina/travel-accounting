import type { FormEvent } from "react";
import type {
  Expense,
  ExpenseFormState,
  ExchangeRate,
  LedgerSummary,
  ReportFilterState,
  ReportSummary,
  Trip,
} from "../app/types";
type ExpensesSectionProps = {
  trips: Trip[];
  selectedExpensesTripId: string;
  selectedExpenseId: string | null;
  selectedTripForExpenses: Trip | undefined;
  expenseForm: ExpenseFormState;
  expenses: Expense[];
  exchangeRates: ExchangeRate[];
  ledgerSummary: LedgerSummary | null;
  reportSummary: ReportSummary | null;
  reportFilters: ReportFilterState;
  onTripSelectionChange: (tripId: string) => void;
  onExpenseFormChange: (next: ExpenseFormState) => void;
  onExpenseSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClearExpenseForm: () => void;
  onStartExpenseEdit: (expense: Expense) => void;
  onExpenseDelete: (expenseId: string) => void;
  onReportFiltersChange: (next: ReportFilterState) => void;
  onLoadReportSummary: () => void;
  onDownloadReportCsv: () => void;
};
export function ExpensesSection({
  trips,
  selectedExpensesTripId,
  selectedExpenseId,
  selectedTripForExpenses,
  expenseForm,
  expenses,
  exchangeRates,
  ledgerSummary,
  reportSummary,
  reportFilters,
  onTripSelectionChange,
  onExpenseFormChange,
  onExpenseSubmit,
  onClearExpenseForm,
  onStartExpenseEdit,
  onExpenseDelete,
  onReportFiltersChange,
  onLoadReportSummary,
  onDownloadReportCsv,
}: ExpensesSectionProps) {
  return (
    <section className="card">
      {" "}
      <h2>Expenses</h2>{" "}
      <label>
        {" "}
        Trip for expenses{" "}
        <select
          value={selectedExpensesTripId}
          onChange={(event) => onTripSelectionChange(event.target.value)}
        >
          {" "}
          <option value="">Select trip</option>{" "}
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {" "}
              {trip.name} ({trip.destinationCountry}){" "}
            </option>
          ))}{" "}
        </select>{" "}
      </label>{" "}
      {selectedTripForExpenses && (
        <p>
          {" "}
          Origin currency: {selectedTripForExpenses.homeCurrency} | Destination
          currency: {selectedTripForExpenses.localCurrency}{" "}
        </p>
      )}{" "}
      {selectedTripForExpenses && ledgerSummary && (
        <section className="card">
          {" "}
          <h3>Ledger Summary</h3>{" "}
          <p>
            {" "}
            Total local: {ledgerSummary.totalLocalAmount}{" "}
            {ledgerSummary.localCurrency}{" "}
          </p>{" "}
          <p>
            {" "}
            Total home (converted): {ledgerSummary.convertedHomeAmount}{" "}
            {ledgerSummary.homeCurrency}{" "}
          </p>{" "}
          <p>
            {" "}
            Expenses: {ledgerSummary.expenseCount} | Converted:{" "}
            {ledgerSummary.convertedExpenseCount} | Missing conversion:{" "}
            {ledgerSummary.missingHomeConversionCount}{" "}
          </p>{" "}
          {ledgerSummary.categoryTotals.length > 0 && (
            <>
              {" "}
              <h4>By Category</h4>{" "}
              {ledgerSummary.categoryTotals.map((item) => (
                <article key={item.category} className="trip-row">
                  {" "}
                  <div>{item.category}</div>{" "}
                  <div>
                    {" "}
                    {item.totalLocalAmount} {ledgerSummary.localCurrency}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    {item.convertedHomeAmount} {ledgerSummary.homeCurrency}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    {item.convertedExpenseCount}/{item.expenseCount}{" "}
                    converted{" "}
                  </div>{" "}
                </article>
              ))}{" "}
            </>
          )}{" "}
          {ledgerSummary.dayTotals.length > 0 && (
            <>
              {" "}
              <h4>By Day</h4>{" "}
              {ledgerSummary.dayTotals.map((item) => (
                <article key={item.date} className="trip-row">
                  {" "}
                  <div>{item.date}</div>{" "}
                  <div>
                    {" "}
                    {item.totalLocalAmount} {ledgerSummary.localCurrency}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    {item.convertedHomeAmount} {ledgerSummary.homeCurrency}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    {item.convertedExpenseCount}/{item.expenseCount}{" "}
                    converted{" "}
                  </div>{" "}
                </article>
              ))}{" "}
            </>
          )}{" "}
        </section>
      )}{" "}
      {selectedTripForExpenses && (
        <section className="card">
          {" "}
          <h3>Reports & Export</h3>{" "}
          <div className="trip-form">
            {" "}
            <label>
              {" "}
              From date{" "}
              <input
                type="date"
                value={reportFilters.fromDate}
                onChange={(event) =>
                  onReportFiltersChange({
                    ...reportFilters,
                    fromDate: event.target.value,
                  })
                }
              />{" "}
            </label>{" "}
            <label>
              {" "}
              To date{" "}
              <input
                type="date"
                value={reportFilters.toDate}
                onChange={(event) =>
                  onReportFiltersChange({
                    ...reportFilters,
                    toDate: event.target.value,
                  })
                }
              />{" "}
            </label>{" "}
            <input
              placeholder="Category filter (optional)"
              value={reportFilters.category}
              onChange={(event) =>
                onReportFiltersChange({
                  ...reportFilters,
                  category: event.target.value,
                })
              }
            />{" "}
            <div className="actions">
              {" "}
              <button type="button" onClick={onLoadReportSummary}>
                {" "}
                Load report{" "}
              </button>{" "}
              <button type="button" onClick={onDownloadReportCsv}>
                {" "}
                Download CSV{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          {reportSummary && (
            <>
              {" "}
              <p>Filtered expenses: {reportSummary.expenseCount}</p>{" "}
              <p>
                {" "}
                Total local: {reportSummary.totalLocalAmount}{" "}
                {reportSummary.localCurrency}{" "}
              </p>{" "}
              <p>
                {" "}
                Total home: {reportSummary.totalHomeAmount}{" "}
                {reportSummary.homeCurrency}{" "}
              </p>{" "}
              {reportSummary.categoryTotals.length > 0 && (
                <>
                  {" "}
                  <h4>Category breakdown</h4>{" "}
                  {reportSummary.categoryTotals.map((item) => (
                    <article key={item.category} className="trip-row">
                      {" "}
                      <div>{item.category}</div>{" "}
                      <div>{item.expenseCount} expenses</div>{" "}
                      <div>
                        {" "}
                        {item.totalLocalAmount}{" "}
                        {reportSummary.localCurrency}{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        {item.totalHomeAmount} {reportSummary.homeCurrency}{" "}
                      </div>{" "}
                    </article>
                  ))}{" "}
                </>
              )}{" "}
            </>
          )}{" "}
        </section>
      )}{" "}
      <form className="trip-form" onSubmit={onExpenseSubmit}>
        {" "}
        <label>
          {" "}
          Category{" "}
          <select
            value={expenseForm.category}
            onChange={(event) =>
              onExpenseFormChange({
                ...expenseForm,
                category: event.target.value,
              })
            }
          >
            {" "}
            <option value="Transport">Transport</option>{" "}
            <option value="Meal">Meal</option>{" "}
            <option value="TouristActivity">Tourist activity</option>{" "}
            <option value="Museum">Museum</option>{" "}
            <option value="Snack">Snack</option>{" "}
            <option value="Lodging">Lodging</option>{" "}
            <option value="Other">Other</option>{" "}
          </select>{" "}
        </label>{" "}
        <input
          required
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={expenseForm.amount}
          onChange={(event) =>
            onExpenseFormChange({ ...expenseForm, amount: event.target.value })
          }
        />{" "}
        <input
          required
          minLength={3}
          maxLength={3}
          placeholder="Currency"
          value={expenseForm.currency}
          onChange={(event) =>
            onExpenseFormChange({
              ...expenseForm,
              currency: event.target.value.toUpperCase(),
            })
          }
        />{" "}
        <label>
          {" "}
          Date and time{" "}
          <input
            required
            type="datetime-local"
            value={expenseForm.occurredAtUtc}
            onChange={(event) =>
              onExpenseFormChange({
                ...expenseForm,
                occurredAtUtc: event.target.value,
              })
            }
          />{" "}
        </label>{" "}
        <input
          required
          placeholder="Notes"
          value={expenseForm.notes}
          onChange={(event) =>
            onExpenseFormChange({ ...expenseForm, notes: event.target.value })
          }
        />{" "}
        <div className="actions">
          {" "}
          <button type="submit">
            {" "}
            {selectedExpenseId ? "Save expense" : "Add expense"}{" "}
          </button>{" "}
          {selectedExpenseId && (
            <button type="button" onClick={onClearExpenseForm}>
              {" "}
              Cancel{" "}
            </button>
          )}{" "}
        </div>{" "}
      </form>{" "}
      <p>
        {" "}
        Exchange rates are auto-assigned from the configured provider when an
        expense is listed and no local rate exists for that day.{" "}
      </p>{" "}
      {exchangeRates.length > 0 && (
        <>
          {" "}
          <h3>Saved Rates</h3>{" "}
          {exchangeRates.map((rate) => (
            <article
              key={`${rate.date}-${rate.fromCurrency}-${rate.toCurrency}`}
              className="trip-row"
            >
              {" "}
              <div>{rate.date}</div>{" "}
              <div>
                {" "}
                {rate.fromCurrency} to {rate.toCurrency}: {rate.rate}{" "}
              </div>{" "}
            </article>
          ))}{" "}
        </>
      )}{" "}
      {expenses.length === 0 && selectedExpensesTripId && (
        <p>No expenses yet.</p>
      )}{" "}
      {expenses.map((expense) => (
        <article key={expense.id} className="trip-row">
          {" "}
          <div>
            {" "}
            <strong>{expense.category}</strong> - {expense.amount}{" "}
            {expense.currency}{" "}
          </div>{" "}
          <div>{new Date(expense.occurredAtUtc).toLocaleString()}</div>{" "}
          <div>{expense.notes}</div>{" "}
          <div>
            {" "}
            Home equivalent:{" "}
            {expense.homeAmount != null && expense.homeCurrency
              ? `${expense.homeAmount} ${expense.homeCurrency}`
              : "No rate for this day/currency"}{" "}
            {expense.exchangeRateUsed != null && (
              <> (rate {expense.exchangeRateUsed})</>
            )}{" "}
          </div>{" "}
          <div className="actions">
            {" "}
            <button type="button" onClick={() => onStartExpenseEdit(expense)}>
              {" "}
              Edit{" "}
            </button>{" "}
            <button type="button" onClick={() => onExpenseDelete(expense.id)}>
              {" "}
              Delete{" "}
            </button>{" "}
          </div>{" "}
        </article>
      ))}{" "}
    </section>
  );
}
