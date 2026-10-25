import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ApiError, errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { EXPENSE_CATEGORIES } from "@/app/categories";
import { defaultExpenseTime, fromDateTimeInput, toDateTimeInput } from "@/app/format";
import { useToast } from "@/app/toast";
import type { Expense, Trip } from "@/app/types";
import { Field } from "./Field";

type ExpenseFormProps = {
  trip: Trip;
  editing: Expense | null;
  disabled: boolean;
  disabledReason?: string;
  onSaved: (expense: Expense, mode: "created" | "updated") => void;
  onCancelEdit: () => void;
  /** Focus the amount on mount (phone bottom sheet) so the keyboard is ready immediately. */
  autoFocusAmount?: boolean;
};

type Draft = { category: string; amount: string; currency: string; occurredAt: string; notes: string };

function emptyDraft(trip: Trip, category = "Meal"): Draft {
  return { category, amount: "", currency: trip.localCurrency, occurredAt: defaultExpenseTime(trip.startDate, trip.endDate), notes: "" };
}

function draftFrom(expense: Expense): Draft {
  return {
    category: expense.category,
    amount: String(expense.amount),
    currency: expense.currency,
    occurredAt: toDateTimeInput(expense.occurredAtUtc),
    notes: expense.notes,
  };
}

/**
 * Capture-in-the-moment entry: amount first, local currency and "now" as defaults. After adding,
 * the form stays ready for the next expense (same category, fresh time) for back-to-back entry.
 */
export function ExpenseForm({ trip, editing, disabled, disabledReason, onSaved, onCancelEdit, autoFocusAmount = false }: ExpenseFormProps) {
  const { json } = useApi();
  const { notify } = useToast();
  const amountRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<Draft>(() => (editing ? draftFrom(editing) : emptyDraft(trip)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setDraft(editing ? draftFrom(editing) : emptyDraft(trip));
    setError(null);
    setFieldErrors({});
  }, [editing, trip]);

  const currencies = [...new Set([trip.localCurrency, trip.homeCurrency])];
  const amountValue = Number(draft.amount);
  const amountInvalid = draft.amount !== "" && !(amountValue > 0);
  const fieldError = (name: string) => fieldErrors[name]?.[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (amountInvalid) return;
    setSaving(true);
    setError(null);
    setFieldErrors({});
    const body = JSON.stringify({
      category: draft.category,
      amount: amountValue,
      currency: draft.currency,
      occurredAtUtc: fromDateTimeInput(draft.occurredAt),
      notes: draft.notes.trim(),
    });
    try {
      if (editing) {
        const saved = await json<Expense>(apiRoutes.expense(trip.id, editing.id), { method: "PUT", body });
        notify("Expense updated");
        onSaved(saved, "updated");
      } else {
        const saved = await json<Expense>(apiRoutes.expenses(trip.id), { method: "POST", body });
        notify("Expense added");
        onSaved(saved, "created");
        setDraft(emptyDraft(trip, draft.category));
        amountRef.current?.focus();
      }
    } catch (err) {
      setError(errorMessage(err));
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="sa-form sa-expenseForm" onSubmit={handleSubmit} aria-labelledby="expense-form-title">
      <h2 id="expense-form-title" className="sa-sectionTitle">
        {editing ? "Edit expense" : "Add expense"}
      </h2>

      <div className="sa-form__row sa-form__row--amount">
        <Field label="Amount" error={amountInvalid ? "Enter an amount greater than 0." : fieldError("Amount")}>
          <input
            ref={amountRef}
            autoFocus={autoFocusAmount}
            className="sa-input sa-input--amount"
            inputMode="decimal"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder="0.00"
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
          />
        </Field>
        <Field label="Currency">
          <select className="sa-input" value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value })}>
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="What was it?" hint="Shown on the expense and in exports." error={fieldError("Notes")}>
        <input
          className="sa-input"
          required
          autoComplete="off"
          placeholder="Taxi to the airport"
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
        />
      </Field>

      <div className="sa-form__row">
        <Field label="Category" error={fieldError("Category")}>
          <select className="sa-input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="When" error={fieldError("OccurredAtUtc")}>
          <input
            className="sa-input"
            type="datetime-local"
            required
            value={draft.occurredAt}
            onChange={(e) => setDraft({ ...draft, occurredAt: e.target.value })}
          />
        </Field>
      </div>

      {error && (
        <p className="sa-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="sa-form__actions">
        <button type="submit" className="sa-btn-primary" disabled={disabled || saving} aria-busy={saving}>
          {saving ? "Saving…" : editing ? "Save expense" : "Add expense"}
        </button>
        {editing && (
          <button type="button" className="sa-btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
      {disabled && disabledReason && <p className="sa-form__hint">{disabledReason}</p>}
    </form>
  );
}
