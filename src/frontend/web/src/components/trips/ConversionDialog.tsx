import { useId, useState } from "react";
import type { FormEvent } from "react";
import { errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { formatDate, formatMoney } from "@/app/format";
import { useI18n } from "@/app/i18n";
import { useToast } from "@/app/toast";
import type { Expense } from "@/app/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTrip } from "./TripPage";

type ConversionDialogProps = { expense: Expense | null; onClose: () => void };

/** Rate key used by the API: the expense's calendar day in UTC (matches the backend lookup). */
function rateDate(expense: Expense): string {
  return new Date(expense.occurredAtUtc).toISOString().slice(0, 10);
}

/**
 * Recovery for an unconverted expense: retry the automatic provider rate, or enter the rate by hand
 * as "1 HOME = x LOCAL" (stored inverted, as the API expects). A manual rate applies to every
 * expense in that currency on that day, and the dialog says so.
 */
export function ConversionDialog({ expense, onClose }: ConversionDialogProps) {
  const { trip, refresh } = useTrip();
  const { send } = useApi();
  const { notify } = useToast();
  const { t } = useI18n();
  const inputId = useId();
  const [busy, setBusy] = useState<"retry" | "save" | null>(null);
  const [stillMissing, setStillMissing] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<unknown>(null);

  const local = expense?.currency ?? trip.localCurrency;
  const home = trip.homeCurrency;
  const day = expense ? rateDate(expense) : "";
  const perHome = Number(value);
  const valueInvalid = value !== "" && !(perHome > 0);

  function close() {
    setStillMissing(false);
    setValue("");
    setError(null);
    onClose();
  }

  async function retry() {
    if (!expense) return;
    setBusy("retry");
    setError(null);
    try {
      const latest = await refresh();
      const updated = latest.find((e) => e.id === expense.id);
      if (updated?.homeAmount != null) {
        notify(t.conversion.converted);
        close();
      } else {
        setStillMissing(true);
      }
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!expense || !(perHome > 0)) return;
    setBusy("save");
    setError(null);
    try {
      await send(apiRoutes.exchangeRates(trip.id), {
        method: "PUT",
        body: JSON.stringify({ date: day, fromCurrency: local, toCurrency: home, rate: 1 / perHome }),
      });
      await refresh();
      notify(t.conversion.saved);
      close();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog open={expense !== null} onOpenChange={(open) => (!open ? close() : undefined)}>
      {expense && (
        <DialogContent className="sa-conversion">
          <DialogHeader>
            <DialogTitle>{t.conversion.title(expense.notes)}</DialogTitle>
            <DialogDescription>{t.conversion.missing(local, home, formatDate(day))}</DialogDescription>
          </DialogHeader>

          <div className="sa-conversion__retry">
            <button type="button" className="sa-btn-secondary" onClick={retry} disabled={busy !== null} aria-busy={busy === "retry"}>
              {busy === "retry" ? t.conversion.retrying : t.conversion.retry}
            </button>
            {stillMissing && (
              <p className="sa-note sa-note--warning" role="status">
                {t.conversion.stillMissing}
              </p>
            )}
          </div>

          <form className="sa-form" onSubmit={save} aria-labelledby={`${inputId}-title`}>
            <p id={`${inputId}-title`} className="sa-sectionTitle">
              {t.conversion.manualTitle}
            </p>
            <div className="sa-field">
              <label htmlFor={inputId} className="sa-field__label">
                {t.conversion.manualLabel(home)}
              </label>
              <div className="sa-rateInput">
                <span aria-hidden="true">1 {home} =</span>
                <input
                  id={inputId}
                  className="sa-input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  required
                  value={value}
                  aria-invalid={valueInvalid || undefined}
                  aria-describedby={`${inputId}-hint`}
                  onChange={(e) => setValue(e.target.value)}
                />
                <span aria-hidden="true">{local}</span>
              </div>
              <p id={`${inputId}-hint`} className="sa-field__hint">
                {t.conversion.manualHint(local, formatDate(day))}
              </p>
              {valueInvalid && (
                <p className="sa-field__error" role="alert">
                  {t.conversion.invalid}
                </p>
              )}
              {perHome > 0 && (
                <p className="sa-form__hint" aria-live="polite">
                  {t.conversion.preview(formatMoney(Math.round((expense.amount / perHome) * 100) / 100, home))}
                </p>
              )}
            </div>

            {error != null && (
              <p className="sa-form__error" role="alert">
                {errorMessage(error, t.errors)}
              </p>
            )}

            <DialogFooter>
              <DialogClose className="sa-btn-secondary">{t.common.cancel}</DialogClose>
              <button type="submit" className="sa-btn-primary" disabled={busy !== null || !(perHome > 0)} aria-busy={busy === "save"}>
                {busy === "save" ? t.common.saving : t.conversion.save}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
