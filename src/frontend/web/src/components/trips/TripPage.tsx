import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useOutletContext, useParams } from "react-router";
import { errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { useBackendStatus } from "@/app/backendStatus";
import { formatDateRange, formatMoney } from "@/app/format";
import { useToast } from "@/app/toast";
import type { Expense, LedgerSummary, Trip } from "@/app/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type TripContext = {
  trip: Trip;
  expenses: Expense[];
  ledger: LedgerSummary | null;
  readOnly: boolean;
  setExpenses: (update: (current: Expense[]) => Expense[]) => void;
  /** Refetches expenses and ledger after a change so conversions and totals stay server-truth. */
  refresh: () => Promise<void>;
};

export function useTrip(): TripContext {
  return useOutletContext<TripContext>();
}

type LoadState = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready" };

/** `/trips/:tripId` layout: persistent trip header, section navigation, and shared trip data. */
export function TripPage() {
  const { tripId = "" } = useParams();
  const { json } = useApi();
  const { notify } = useToast();
  const { status } = useBackendStatus();

  const [load, setLoad] = useState<LoadState>({ kind: "loading" });
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpensesState] = useState<Expense[]>([]);
  const [ledger, setLedger] = useState<LedgerSummary | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const refresh = useCallback(async () => {
    const [e, l] = await Promise.all([
      json<Expense[]>(apiRoutes.expenses(tripId)),
      json<LedgerSummary>(apiRoutes.ledgerSummary(tripId)),
    ]);
    setExpensesState(e);
    setLedger(l);
  }, [json, tripId]);

  const fetchAll = useCallback(() => {
    json<Trip>(apiRoutes.trip(tripId))
      .then(async (t) => {
        setTrip(t);
        await refresh();
        setLoad({ kind: "ready" });
      })
      .catch((error: unknown) => setLoad({ kind: "error", message: errorMessage(error) }));
  }, [json, refresh, tripId]);

  useEffect(fetchAll, [fetchAll]);

  const loadAll = () => {
    setLoad({ kind: "loading" });
    fetchAll();
  };

  const setExpenses = useCallback((update: (current: Expense[]) => Expense[]) => setExpensesState(update), []);

  async function archive() {
    setArchiving(true);
    try {
      const updated = await json<Trip>(apiRoutes.archiveTrip(tripId), { method: "POST" });
      setTrip(updated);
      setArchiveOpen(false);
      notify("Trip archived. It's now read-only.");
    } catch (error) {
      notify(errorMessage(error), { tone: "error" });
    } finally {
      setArchiving(false);
    }
  }

  if (load.kind === "loading") {
    return (
      <p className="sa-loading" role="status">
        Loading trip…
      </p>
    );
  }

  if (load.kind === "error" || !trip) {
    return (
      <section className="sa-page">
        <Link to="/trips" className="sa-backLink">
          ← Your trips
        </Link>
        <div className="sa-inlineError" role="alert">
          <p>{load.kind === "error" ? load.message : "We couldn't find that trip."}</p>
          <button type="button" className="sa-btn-secondary" onClick={loadAll}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  const archived = trip.status === "Archived";
  const readOnly = archived || status === "offline";
  const context: TripContext = { trip, expenses, ledger, readOnly, setExpenses, refresh };

  return (
    <section className="sa-page sa-trip" aria-labelledby="trip-title">
      <header className="sa-trip__header">
        <Link to="/trips" className="sa-backLink">
          ← Your trips
        </Link>
        <div className="sa-trip__titleRow">
          <div>
            <h1 id="trip-title" className="sa-page__title">
              {trip.name}
              {archived && <span className="sa-chip sa-chip--muted">Archived</span>}
            </h1>
            <p className="sa-trip__meta">
              {trip.destinationCountry} · {formatDateRange(trip.startDate, trip.endDate)} · {trip.localCurrency} → {trip.homeCurrency}
            </p>
          </div>
          {ledger && (
            <div className="sa-trip__total" aria-label="Trip total">
              <span className="sa-trip__totalHome">{formatMoney(ledger.convertedHomeAmount, ledger.homeCurrency)}</span>
              <span className="sa-trip__totalLocal">{formatMoney(ledger.totalLocalAmount, ledger.localCurrency)}</span>
              {ledger.missingHomeConversionCount > 0 && (
                <span className="sa-trip__missing">{ledger.missingHomeConversionCount} not converted</span>
              )}
            </div>
          )}
        </div>
        {!archived && (
          <div className="sa-trip__tools">
            <Link to={`/trips/${trip.id}/edit`} className="sa-btn-ghost">
              Edit trip
            </Link>
            <button type="button" className="sa-btn-ghost" onClick={() => setArchiveOpen(true)} disabled={status === "offline"}>
              Archive
            </button>
          </div>
        )}
        <nav className="sa-tabs" aria-label="Trip sections">
          <NavLink to="expenses" className="sa-tabs__link">
            Expenses
          </NavLink>
          <NavLink to="summary" className="sa-tabs__link">
            Summary
          </NavLink>
          <NavLink to="export" className="sa-tabs__link">
            Export
          </NavLink>
        </nav>
      </header>

      <Outlet context={context} />

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive this trip?</DialogTitle>
            <DialogDescription>
              Archived trips become read-only: you can still view and export them, but not add or edit expenses. This can't be undone yet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="sa-btn-secondary">Keep trip active</DialogClose>
            <button type="button" className="sa-btn-danger" onClick={archive} disabled={archiving} aria-busy={archiving}>
              {archiving ? "Archiving…" : "Archive trip"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
