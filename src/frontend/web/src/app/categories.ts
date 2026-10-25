// Expense categories as accepted by the backend `ExpenseCategory` enum, with display labels.
// The final catalog is an open product decision (PRD Q-2); keep values in sync with the backend.
export const EXPENSE_CATEGORIES = [
  { value: "Transport", label: "Transport" },
  { value: "Meal", label: "Meal" },
  { value: "Lodging", label: "Lodging" },
  { value: "TouristActivity", label: "Tourist activity" },
  { value: "Museum", label: "Museum" },
  { value: "Snack", label: "Snack" },
  { value: "Other", label: "Other" },
] as const;

export function categoryLabel(value: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
