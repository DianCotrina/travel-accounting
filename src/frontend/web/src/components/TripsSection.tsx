import type { FormEvent } from "react";
import type { CountryReference, Trip, TripFormState } from "../app/types";

type TripsSectionProps = {
  form: TripFormState;
  selectedTripId: string | null;
  selectedCountry: CountryReference | undefined;
  countries: CountryReference[];
  trips: Trip[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFormChange: (next: TripFormState) => void;
  onClearForm: () => void;
  onStartEdit: (trip: Trip) => void;
  onArchive: (tripId: string) => void;
};

export function TripsSection({
  form,
  selectedTripId,
  selectedCountry,
  countries,
  trips,
  onSubmit,
  onFormChange,
  onClearForm,
  onStartEdit,
  onArchive,
}: TripsSectionProps) {
  return (
    <>
      <section className="card">
        <h2>{selectedTripId ? "Edit Trip" : "Create Trip"}</h2>
        <form className="trip-form" onSubmit={onSubmit}>
          <input
            required
            placeholder="Trip name"
            value={form.name}
            onChange={(event) => onFormChange({ ...form, name: event.target.value })}
          />
          <label>
            Destination country
            <select
              required
              value={form.destinationCountry}
              onChange={(event) => {
                const destinationCountry = event.target.value;
                const country = countries.find(
                  (item) => item.countryName === destinationCountry
                );
                onFormChange({
                  ...form,
                  destinationCountry,
                  localCurrency: country?.currencyCode ?? form.localCurrency,
                });
              }}
            >
              <option value="">Select destination</option>
              {countries.map((country) => (
                <option key={country.countryCode} value={country.countryName}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>
          <input
            required
            minLength={3}
            maxLength={3}
            placeholder="Origin currency (USD)"
            value={form.homeCurrency}
            onChange={(event) =>
              onFormChange({ ...form, homeCurrency: event.target.value.toUpperCase() })
            }
          />
          <input
            required
            minLength={3}
            maxLength={3}
            placeholder="Destination currency (ARS)"
            value={form.localCurrency}
            onChange={(event) =>
              onFormChange({ ...form, localCurrency: event.target.value.toUpperCase() })
            }
          />
          {selectedCountry && (
            <p>
              Destination currency: {selectedCountry.currencyCode} (
              {selectedCountry.currencyName})
            </p>
          )}
          <label>
            Start date
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(event) =>
                onFormChange({ ...form, startDate: event.target.value })
              }
            />
          </label>
          <label>
            End date
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(event) => onFormChange({ ...form, endDate: event.target.value })}
            />
          </label>
          <div className="actions">
            <button type="submit">{selectedTripId ? "Save" : "Create"}</button>
            {selectedTripId && (
              <button type="button" onClick={onClearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Trips</h2>
        {trips.length === 0 && <p>No trips yet.</p>}
        {trips.map((trip) => (
          <article key={trip.id} className="trip-row">
            <div>
              <strong>{trip.name}</strong> - {trip.destinationCountry}
            </div>
            <div>
              {trip.startDate} to {trip.endDate}
            </div>
            <div>
              {trip.homeCurrency} / {trip.localCurrency} - {trip.status}
            </div>
            <div className="actions">
              <button type="button" onClick={() => onStartEdit(trip)}>
                Edit
              </button>
              {trip.status !== "Archived" && (
                <button type="button" onClick={() => onArchive(trip.id)}>
                  Archive
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
