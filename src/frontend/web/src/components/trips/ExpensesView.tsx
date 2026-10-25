import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { useBackendStatus } from "@/app/backendStatus";
import { formatDate } from "@/app/format";
import { useToast } from "@/app/toast";
import type { Expense } from "@/app/types";
import { EmptyState } from "./EmptyState";
import { ExpenseForm } from "./ExpenseForm";
import { MoneyRow } from "./MoneyRow";
import { useTrip } from "./TripPage";

const UNDO_WINDOW_MS = 5000;
const MOBILE_QUERY = "(max-width: 48rem)";

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

function localDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function groupByDay(expenses: Expense[]): [string, Expense[]][] {
  const sorted = [...expenses].sort((a, b) => b.occurredAtUtc.localeCompare(a.occurredAtUtc));
  const groups = new Map<string, Expense[]>();
  for (const expense of sorted) {
    const day = localDay(expense.occurredAtUtc);
    groups.set(day, [...(groups.get(day) ?? []), expense]);
  }
  return [...groups.entries()];
}

/** `/trips/:tripId/expenses`: entry panel (sticky aside on desktop, bottom sheet on phones) + money rows. */
export function ExpensesView() {
  const { trip, expenses, readOnly, setExpenses, refresh } = useTrip();
  const { send } = useApi();
  const { notify } = useToast();
  const { status } = useBackendStatus();
  const isMobile = useIsMobile();

  const [editing, setEditing] = useState<Expense | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pendingDeletes = useRef(new Map<string, { timer: number; expense: Expense }>());

  const commitDelete = useCallback(
    async (expense: Expense) => {
      pendingDeletes.current.delete(expense.id);
      try {
        await send(apiRoutes.expense(trip.id, expense.id), { method: "DELETE" });
        await refresh();
      } catch (error) {
        setExpenses((current) => [...current, expense]);
        notify(`Couldn't delete "${expense.notes}". ${errorMessage(error)}`, { tone: "error" });
      }
    },
    [notify, refresh, send, setExpenses, trip.id],
  );

  // Leaving the view inside the undo window still deletes: the user already chose to.
  const commitDeleteRef = useRef(commitDelete);
  useEffect(() => {
    commitDeleteRef.current = commitDelete;
  }, [commitDelete]);
  useEffect(() => {
    const pending = pendingDeletes.current;
    return () => {
      pending.forEach(({ timer, expense }) => {
        window.clearTimeout(timer);
        void commitDeleteRef.current(expense);
      });
      pending.clear();
    };
  }, []);

  function requestDelete(expense: Expense) {
    if (editing?.id === expense.id) setEditing(null);
    setExpenses((current) => current.filter((e) => e.id !== expense.id));
    const timer = window.setTimeout(() => void commitDelete(expense), UNDO_WINDOW_MS);
    pendingDeletes.current.set(expense.id, { timer, expense });
    notify(`Deleted "${expense.notes}"`, {
      tone: "info",
      durationMs: UNDO_WINDOW_MS,
      action: {
        label: "Undo",
        onAction: () => {
          window.clearTimeout(timer);
          pendingDeletes.current.delete(expense.id);
          setExpenses((current) => [...current, expense]);
        },
      },
    });
  }

  function startEdit(expense: Expense) {
    setEditing(expense);
    setSheetOpen(true);
  }

  async function handleSaved(saved: Expense, mode: "created" | "updated") {
    setExpenses((current) => (mode === "created" ? [...current, saved] : current.map((e) => (e.id === saved.id ? saved : e))));
    if (mode === "updated") {
      setEditing(null);
      setSheetOpen(false);
    }
    try {
      await refresh();
    } catch (error) {
      notify(`Saved, but totals couldn't refresh. ${errorMessage(error)}`, { tone: "error" });
    }
  }

  const disabledReason =
    trip.status === "Archived"
      ? "This trip is archived, so it's read-only."
      : status === "offline"
        ? "Adding expenses is disabled while the server is unreachable."
        : undefined;

  const sheet = isMobile && sheetOpen;
  const groups = groupByDay(expenses);

  useEffect(() => {
    if (!sheet) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheet]);

  return (
    <div className="sa-expenses">
      {(!isMobile || sheetOpen) && !(trip.status === "Archived" && !editing) && (
        <>
          {sheet && <div className="sa-sheetBackdrop" onClick={() => setSheetOpen(false)} aria-hidden="true" />}
          <aside
            className={sheet ? "sa-expenses__entry sa-expenses__entry--sheet" : "sa-expenses__entry"}
            role={sheet ? "dialog" : undefined}
            aria-modal={sheet || undefined}
            aria-label={sheet ? (editing ? "Edit expense" : "Add expense") : undefined}
          >
            {sheet && (
              <button type="button" className="sa-iconBtn sa-expenses__close" aria-label="Close" onClick={() => setSheetOpen(false)}>
                <X aria-hidden="true" />
              </button>
            )}
            <ExpenseForm
              trip={trip}
              editing={editing}
              disabled={readOnly}
              disabledReason={disabledReason}
              autoFocusAmount={sheet}
              onSaved={handleSaved}
              onCancelEdit={() => {
                setEditing(null);
                setSheetOpen(false);
              }}
            />
          </aside>
        </>
      )}

      <section className="sa-expenses__list" aria-labelledby="expense-list-title">
        <h2 id="expense-list-title" className="sa-sectionTitle">
          Expenses <span className="sa-count">{expenses.length}</span>
        </h2>
        {trip.status === "Archived" && <p className="sa-note">This trip is archived. Expenses are read-only.</p>}

        {expenses.length === 0 ? (
          <EmptyState
            title="Log your first expense"
            body={`Enter what you paid in ${trip.localCurrency}; it converts to ${trip.homeCurrency} using that day's rate.`}
          />
        ) : (
          groups.map(([day, items]) => (
            <section key={day} className="sa-dayGroup" aria-label={formatDate(day)}>
              <h3 className="sa-dayGroup__title">{formatDate(day)}</h3>
              <ul className="sa-moneyList">
                {items.map((expense) => (
                  <MoneyRow
                    key={expense.id}
                    expense={expense}
                    homeCurrency={trip.homeCurrency}
                    actions={
                      readOnly ? undefined : (
                        <>
                          <button type="button" className="sa-btn-ghost sa-btn-ghost--sm" onClick={() => startEdit(expense)} aria-label={`Edit ${expense.notes}`}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="sa-btn-ghost sa-btn-ghost--sm sa-btn-ghost--danger"
                            onClick={() => requestDelete(expense)}
                            aria-label={`Delete ${expense.notes}`}
                          >
                            Delete
                          </button>
                        </>
                      )
                    }
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </section>

      {isMobile && !sheetOpen && trip.status !== "Archived" && (
        <button
          type="button"
          className="sa-btn-primary sa-fab"
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
          disabled={readOnly}
        >
          <Plus aria-hidden="true" />
          Add expense
        </button>
      )}
    </div>
  );
}
