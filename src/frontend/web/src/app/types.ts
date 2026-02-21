export type HealthResponse = { status: string; utcNow: string };
export type Trip = {
  id: string;
  name: string;
  destinationCountry: string;
  homeCurrency: string;
  localCurrency: string;
  startDate: string;
  endDate: string;
  status: string;
};
export type Expense = {
  id: string;
  tripId: string;
  category: string;
  amount: number;
  currency: string;
  homeAmount?: number | null;
  homeCurrency?: string | null;
  exchangeRateUsed?: number | null;
  occurredAtUtc: string;
  notes: string;
};
export type CountryReference = {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencyName: string;
};
export type TripFormState = {
  name: string;
  destinationCountry: string;
  homeCurrency: string;
  localCurrency: string;
  startDate: string;
  endDate: string;
};
export type ExpenseFormState = {
  category: string;
  amount: string;
  currency: string;
  occurredAtUtc: string;
  notes: string;
};
export type ExchangeRate = {
  tripId: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
};
export type LedgerCategoryTotal = {
  category: string;
  totalLocalAmount: number;
  convertedHomeAmount: number;
  expenseCount: number;
  convertedExpenseCount: number;
  missingHomeConversionCount: number;
};
export type LedgerDayTotal = {
  date: string;
  totalLocalAmount: number;
  convertedHomeAmount: number;
  expenseCount: number;
  convertedExpenseCount: number;
  missingHomeConversionCount: number;
};
export type LedgerSummary = {
  tripId: string;
  localCurrency: string;
  homeCurrency: string;
  totalLocalAmount: number;
  convertedHomeAmount: number;
  expenseCount: number;
  convertedExpenseCount: number;
  missingHomeConversionCount: number;
  categoryTotals: LedgerCategoryTotal[];
  dayTotals: LedgerDayTotal[];
};
export type ReportCategoryTotal = {
  category: string;
  expenseCount: number;
  totalLocalAmount: number;
  totalHomeAmount: number;
};
export type ReportSummary = {
  tripId: string;
  localCurrency: string;
  homeCurrency: string;
  fromDate?: string | null;
  toDate?: string | null;
  category?: string | null;
  expenseCount: number;
  totalLocalAmount: number;
  totalHomeAmount: number;
  categoryTotals: ReportCategoryTotal[];
};
export type ReportFilterState = {
  fromDate: string;
  toDate: string;
  category: string;
};
export const initialFormState: TripFormState = {
  name: "",
  destinationCountry: "",
  homeCurrency: "USD",
  localCurrency: "ARS",
  startDate: "",
  endDate: "",
};
export const initialExpenseFormState: ExpenseFormState = {
  category: "Meal",
  amount: "",
  currency: "ARS",
  occurredAtUtc: "",
  notes: "",
};
export const initialReportFilters: ReportFilterState = {
  fromDate: "",
  toDate: "",
  category: "",
};
