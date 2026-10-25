// Expense categories accepted by the backend `ExpenseCategory` enum. Labels live in the i18n
// catalogs (`t.categories`). The final catalog is an open product decision (PRD Q-2).
export const EXPENSE_CATEGORIES = ["Transport", "Meal", "Lodging", "TouristActivity", "Museum", "Snack", "Other"] as const;

export function categoryLabel(labels: Record<string, string>, value: string): string {
  return labels[value] ?? value;
}
