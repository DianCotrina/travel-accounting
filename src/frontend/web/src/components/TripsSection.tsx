import type { FormEvent } from "react";
import type { CountryReference, Trip, TripFormState } from "../app/types";
<<<<<<< HEAD
=======

>>>>>>> 8e1e576 (Refactor frontend into modular components)
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
<<<<<<< HEAD
=======

>>>>>>> 8e1e576 (Refactor frontend into modular components)
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
<<<<<<< HEAD
      {" "}
      <section className="card">
        {" "}
        <h2>{selectedTripId ? "Edit Trip" : "Create Trip"}</h2>{" "}
        <form className="trip-form" onSubmit={onSubmit}>
          {" "}
=======
      <section className="card">
        <h2>{selectedTripId ? "Edit Trip" : "Create Trip"}</h2>
        <form className="trip-form" onSubmit={onSubmit}>
>>>>>>> 8e1e576 (Refactor frontend into modular components)
          <input
            required
            placeholder="Trip name"
            value={form.name}
<<<<<<< HEAD
            onChange={(event) =>
              onFormChange({ ...form, name: event.target.value })
            }
          />{" "}
          <label>
            {" "}
            Destination country{" "}
=======
            onChange={(event) => onFormChange({ ...form, name: event.target.value })}
          />
          <label>
            Destination country
>>>>>>> 8e1e576 (Refactor frontend into modular components)
            <select
              required
              value={form.destinationCountry}
              onChange={(event) => {
                const destinationCountry = event.target.value;
                const country = countries.find(
<<<<<<< HEAD
                  (item) => item.countryName === destinationCountry,
=======
                  (item) => item.countryName === destinationCountry
>>>>>>> 8e1e576 (Refactor frontend into modular components)
                );
                onFormChange({
                  ...form,
                  destinationCountry,
                  localCurrency: country?.currencyCode ?? form.localCurrency,
                });
              }}
            >
<<<<<<< HEAD
              {" "}
              <option value="">Select destination</option>{" "}
              {countries.map((country) => (
                <option key={country.countryCode} value={country.countryName}>
                  {" "}
                  {country.countryName}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </label>{" "}
=======
              <option value="">Select destination</option>
              {countries.map((country) => (
                <option key={country.countryCode} value={country.countryName}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>
>>>>>>> 8e1e576 (Refactor frontend into modular components)
          <input
            required
            minLength={3}
            maxLength={3}
            placeholder="Origin currency (USD)"
            value={form.homeCurrency}
            onChange={(event) =>
<<<<<<< HEAD
              onFormChange({
                ...form,
                homeCurrency: event.target.value.toUpperCase(),
              })
            }
          />{" "}
=======
              onFormChange({ ...form, homeCurrency: event.target.value.toUpperCase() })
            }
          />
>>>>>>> 8e1e576 (Refactor frontend into modular components)
          <input
            required
            minLength={3}
            maxLength={3}
            placeholder="Destination currency (ARS)"
            value={form.localCurrency}
            onChange={(event) =>
<<<<<<< HEAD
              onFormChange({
                ...form,
                localCurrency: event.target.value.toUpperCase(),
              })
            }
          />{" "}
          {selectedCountry && (
            <p>
              {" "}
              Destination currency: {selectedCountry.currencyCode} ({" "}
              {selectedCountry.currencyName}){" "}
            </p>
          )}{" "}
          <label>
            {" "}
            Start date{" "}
=======
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
>>>>>>> 8e1e576 (Refactor frontend into modular components)
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(event) =>
                onFormChange({ ...form, startDate: event.target.value })
              }
<<<<<<< HEAD
            />{" "}
          </label>{" "}
          <label>
            {" "}
            End date{" "}
=======
            />
          </label>
          <label>
            End date
>>>>>>> 8e1e576 (Refactor frontend into modular components)
            <input
              required
              type="date"
              value={form.endDate}
<<<<<<< HEAD
              onChange={(event) =>
                onFormChange({ ...form, endDate: event.target.value })
              }
            />{" "}
          </label>{" "}
          <div className="actions">
            {" "}
            <button type="submit">
              {selectedTripId ? "Save" : "Create"}
            </button>{" "}
            {selectedTripId && (
              <button type="button" onClick={onClearForm}>
                {" "}
                Cancel{" "}
              </button>
            )}{" "}
          </div>{" "}
        </form>{" "}
      </section>{" "}
      <section className="card">
        {" "}
        <h2>Trips</h2> {trips.length === 0 && <p>No trips yet.</p>}{" "}
        {trips.map((trip) => (
          <article key={trip.id} className="trip-row">
            {" "}
            <div>
              {" "}
              <strong>{trip.name}</strong> - {trip.destinationCountry}{" "}
            </div>{" "}
            <div>
              {" "}
              {trip.startDate} to {trip.endDate}{" "}
            </div>{" "}
            <div>
              {" "}
              {trip.homeCurrency} / {trip.localCurrency} - {trip.status}{" "}
            </div>{" "}
            <div className="actions">
              {" "}
              <button type="button" onClick={() => onStartEdit(trip)}>
                {" "}
                Edit{" "}
              </button>{" "}
              {trip.status !== "Archived" && (
                <button type="button" onClick={() => onArchive(trip.id)}>
                  {" "}
                  Archive{" "}
                </button>
              )}{" "}
            </div>{" "}
          </article>
        ))}{" "}
      </section>{" "}
=======
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
>>>>>>> 8e1e576 (Refactor frontend into modular components)
    </>
  );
}
