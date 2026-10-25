import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { useBackendStatus } from "@/app/backendStatus";
import { formatDateRange } from "@/app/format";
import type { Trip } from "@/app/types";
import { EmptyState } from "./EmptyState";

type LoadState = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; trips: Trip[] };

function TripCard({ trip }: { trip: Trip }) {
  return (
    <li>
      <Link to={`/trips/${trip.id}`} className="sa-tripCard">
        <span className="sa-tripCard__name">{trip.name}</span>
        <span className="sa-tripCard__meta">
          {trip.destinationCountry} · {formatDateRange(trip.startDate, trip.endDate)}
        </span>
        <span className="sa-tripCard__currencies">
          {trip.localCurrency} → {trip.homeCurrency}
        </span>
      </Link>
    </li>
  );
}

export function TripsPage() {
  const { json } = useApi();
  const { status } = useBackendStatus();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const fetchTrips = useCallback(() => {
    json<Trip[]>(apiRoutes.trips())
      .then((trips) => setState({ kind: "ready", trips }))
      .catch((error: unknown) => setState({ kind: "error", message: errorMessage(error) }));
  }, [json]);

  useEffect(fetchTrips, [fetchTrips]);

  const load = () => {
    setState({ kind: "loading" });
    fetchTrips();
  };

  const newTrip =
    status === "offline" ? (
      <span className="sa-btn-primary" aria-disabled="true">
        New trip
      </span>
    ) : (
      <Link to="/trips/new" className="sa-btn-primary">
        New trip
      </Link>
    );

  const active = state.kind === "ready" ? state.trips.filter((t) => t.status !== "Archived") : [];
  const archived = state.kind === "ready" ? state.trips.filter((t) => t.status === "Archived") : [];

  return (
    <section className="sa-page" aria-labelledby="trips-title">
      <header className="sa-page__header">
        <h1 id="trips-title" className="sa-page__title">
          Your trips
        </h1>
        {state.kind === "ready" && state.trips.length > 0 && newTrip}
      </header>

      {state.kind === "loading" && (
        <p className="sa-loading" role="status">
          Loading trips…
        </p>
      )}

      {state.kind === "error" && (
        <div className="sa-inlineError" role="alert">
          <p>{state.message}</p>
          <button type="button" className="sa-btn-secondary" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {state.kind === "ready" && state.trips.length === 0 && (
        <EmptyState
          title="Start your first trip"
          body="A trip holds your expenses in the local currency and converts them to your home currency."
          action={newTrip}
        />
      )}

      {active.length > 0 && (
        <ul className="sa-tripList" aria-label="Active trips">
          {active.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </ul>
      )}

      {archived.length > 0 && (
        <section className="sa-page__section" aria-labelledby="archived-title">
          <h2 id="archived-title" className="sa-sectionTitle">
            Archived
          </h2>
          <ul className="sa-tripList sa-tripList--archived" aria-label="Archived trips">
            {archived.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
