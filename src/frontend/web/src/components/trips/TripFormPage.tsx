import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ApiError, errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { useBackendStatus } from "@/app/backendStatus";
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

  const [countries, setCountries] = useState<CountryReference[]>([]);
  const [form, setForm] = useState<TripFormState>(initialFormState);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
      .catch((error: unknown) => setLoadError(errorMessage(error)));
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
      notify(isEdit ? "Trip updated" : "Trip created");
      navigate(`/trips/${saved.id}`, { replace: isEdit });
    } catch (error) {
      setSubmitError(errorMessage(error));
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
            ← {isEdit ? "Back to trip" : "Your trips"}
          </Link>
          <h1 id="trip-form-title" className="sa-page__title">
            {isEdit ? "Edit trip" : "New trip"}
          </h1>
        </div>
      </header>

      {loadError ? (
        <div className="sa-inlineError" role="alert">
          <p>{loadError}</p>
        </div>
      ) : (
        <form className="sa-form sa-surface" onSubmit={handleSubmit}>
          <Field label="Trip name" error={fieldError("name")}>
            <input
              className="sa-input"
              required
              autoComplete="off"
              placeholder="Buenos Aires, January"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <Field label="Destination" error={fieldError("destinationCountry")}>
            <select
              className="sa-input"
              required
              value={form.destinationCountry}
              onChange={(e) => {
                const country = countries.find((c) => c.countryName === e.target.value);
                setForm({ ...form, destinationCountry: e.target.value, localCurrency: country?.currencyCode ?? form.localCurrency });
              }}
            >
              <option value="">Choose a country</option>
              {countries.map((c) => (
                <option key={c.countryCode} value={c.countryName}>
                  {c.countryName}
                </option>
              ))}
            </select>
          </Field>

          <div className="sa-form__row">
            <Field label="Local currency" hint="What you pay in on this trip" error={fieldError("localCurrency")}>
              <select className="sa-input" required value={form.localCurrency} onChange={(e) => setForm({ ...form, localCurrency: e.target.value })}>
                {currencies.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Home currency" hint="What totals convert to" error={fieldError("homeCurrency")}>
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
            <Field label="Start date" error={fieldError("startDate")}>
              <input className="sa-input" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </Field>
            <Field label="End date" error={datesInvalid ? "End date can't be before the start date." : fieldError("endDate")}>
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

          {submitError && (
            <p className="sa-form__error" role="alert">
              {submitError}
            </p>
          )}

          <div className="sa-form__actions">
            <button type="submit" className="sa-btn-primary" disabled={disabled} aria-busy={saving}>
              {saving ? "Saving…" : isEdit ? "Save trip" : "Create trip"}
            </button>
            <Link to={isEdit && tripId ? `/trips/${tripId}` : "/trips"} className="sa-btn-secondary">
              Cancel
            </Link>
          </div>
          {status === "offline" && <p className="sa-form__hint">Saving is disabled while the server is unreachable.</p>}
        </form>
      )}
    </section>
  );
}
