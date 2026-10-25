import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ApiError, errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { useBackendStatus } from "@/app/backendStatus";
import { useI18n } from "@/app/i18n";
import { useToast } from "@/app/toast";
import type { CountryReference, Trip, TripFormState } from "@/app/types";
import { initialFormState } from "@/app/types";
import { Field } from "./Field";

/** Create (`/trips/new`) or edit (`/trips/:tripId/edit`) a trip. Creating opens the new trip. */
export function TripFormPage() {
  const { tripId } = useParams();
  const isEdit = Boolean(tripId);
  const navigate = useNavigate();
  const { json } = useApi();
  const { notify } = useToast();
  const { status } = useBackendStatus();
  const { t } = useI18n();

  const [countries, setCountries] = useState<CountryReference[]>([]);
  const [form, setForm] = useState<TripFormState>(initialFormState);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const requests: [Promise<CountryReference[]>, Promise<Trip | null>] = [
      json<CountryReference[]>(apiRoutes.countries()),
      tripId ? json<Trip>(apiRoutes.trip(tripId)) : Promise.resolve(null),
    ];
    Promise.all(requests)
      .then(([countryList, trip]) => {
        setCountries(countryList);
        if (trip) {
          setForm({
            name: trip.name,
            destinationCountry: trip.destinationCountry,
            homeCurrency: trip.homeCurrency,
            localCurrency: trip.localCurrency,
            startDate: trip.startDate,
            endDate: trip.endDate,
          });
        }
      })
      .catch((error: unknown) => setLoadError(error));
  }, [json, tripId]);

  const currencies = useMemo(
    () => [...new Set(["USD", ...countries.map((c) => c.currencyCode)])].sort(),
    [countries],
  );

  const fieldError = (name: string) => fieldErrors[name]?.[0] ?? fieldErrors[name.charAt(0).toUpperCase() + name.slice(1)]?.[0];
  const datesInvalid = form.startDate !== "" && form.endDate !== "" && form.endDate < form.startDate;
  const disabled = saving || status === "offline";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (datesInvalid) return;
    setSaving(true);
    setSubmitError(null);
    setFieldErrors({});
    try {
      const saved = await json<Trip>(isEdit && tripId ? apiRoutes.trip(tripId) : apiRoutes.trips(), {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      notify(isEdit ? t.tripForm.updated : t.tripForm.created);
      navigate(`/trips/${saved.id}`, { replace: isEdit });
    } catch (error) {
      setSubmitError(error);
      if (error instanceof ApiError) setFieldErrors(error.fieldErrors);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="sa-page sa-page--narrow" aria-labelledby="trip-form-title">
      <header className="sa-page__header">
        <div>
          <Link to={isEdit && tripId ? `/trips/${tripId}` : "/trips"} className="sa-backLink">
            ← {isEdit ? t.tripForm.backToTrip : t.tripForm.backToTrips}
          </Link>
          <h1 id="trip-form-title" className="sa-page__title">
            {isEdit ? t.tripForm.editTitle : t.tripForm.newTitle}
          </h1>
        </div>
      </header>

      {loadError != null ? (
        <div className="sa-inlineError" role="alert">
          <p>{errorMessage(loadError, t.errors)}</p>
        </div>
      ) : (
        <form className="sa-form sa-surface" onSubmit={handleSubmit}>
          <Field label={t.tripForm.name} error={fieldError("name")}>
            <input
              className="sa-input"
              required
              autoComplete="off"
              placeholder={t.tripForm.namePlaceholder}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <Field label={t.tripForm.destination} error={fieldError("destinationCountry")}>
            <select
              className="sa-input"
              required
              value={form.destinationCountry}
              onChange={(e) => {
                const country = countries.find((c) => c.countryName === e.target.value);
                setForm({ ...form, destinationCountry: e.target.value, localCurrency: country?.currencyCode ?? form.localCurrency });
              }}
            >
              <option value="">{t.tripForm.chooseCountry}</option>
              {countries.map((c) => (
                <option key={c.countryCode} value={c.countryName}>
                  {c.countryName}
                </option>
              ))}
            </select>
          </Field>

          <div className="sa-form__row">
            <Field label={t.tripForm.localCurrency} hint={t.tripForm.localHint} error={fieldError("localCurrency")}>
              <select className="sa-input" required value={form.localCurrency} onChange={(e) => setForm({ ...form, localCurrency: e.target.value })}>
                {currencies.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.tripForm.homeCurrency} hint={t.tripForm.homeHint} error={fieldError("homeCurrency")}>
              <select className="sa-input" required value={form.homeCurrency} onChange={(e) => setForm({ ...form, homeCurrency: e.target.value })}>
                {currencies.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="sa-form__row">
            <Field label={t.tripForm.startDate} error={fieldError("startDate")}>
              <input className="sa-input" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </Field>
            <Field label={t.tripForm.endDate} error={datesInvalid ? t.tripForm.endBeforeStart : fieldError("endDate")}>
              <input
                className="sa-input"
                type="date"
                required
                min={form.startDate || undefined}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </Field>
          </div>

          {submitError != null && (
            <p className="sa-form__error" role="alert">
              {errorMessage(submitError, t.errors)}
            </p>
          )}

          <div className="sa-form__actions">
            <button type="submit" className="sa-btn-primary" disabled={disabled} aria-busy={saving}>
              {saving ? t.common.saving : isEdit ? t.tripForm.save : t.tripForm.create}
            </button>
            <Link to={isEdit && tripId ? `/trips/${tripId}` : "/trips"} className="sa-btn-secondary">
              {t.common.cancel}
            </Link>
          </div>
          {status === "offline" && <p className="sa-form__hint">{t.tripForm.offlineHint}</p>}
        </form>
      )}
    </section>
  );
}
