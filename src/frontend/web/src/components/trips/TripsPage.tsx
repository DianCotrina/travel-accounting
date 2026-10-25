import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { errorMessage, useApi } from "@/app/api";
import { apiRoutes } from "@/app/apiRoutes";
import { useBackendStatus } from "@/app/backendStatus";
import { formatDateRange } from "@/app/format";
import { useI18n } from "@/app/i18n";
import type { Trip } from "@/app/types";
import { EmptyState } from "./EmptyState";

type LoadState = { kind: "loading" } | { kind: "error"; error: unknown } | { kind: "ready"; trips: Trip[] };

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
  const { t } = useI18n();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const fetchTrips = useCallback(() => {
    json<Trip[]>(apiRoutes.trips())
      .then((trips) => setState({ kind: "ready", trips }))
      .catch((error: unknown) => setState({ kind: "error", error }));
  }, [json]);

  useEffect(fetchTrips, [fetchTrips]);

  const load = () => {
    setState({ kind: "loading" });
    fetchTrips();
  };

  const newTrip =
    status === "offline" ? (
      <span className="sa-btn-primary" aria-disabled="true">
        {t.trips.newTrip}
      </span>
    ) : (
      <Link to="/trips/new" className="sa-btn-primary">
        {t.trips.newTrip}
      </Link>
    );

  const active = state.kind === "ready" ? state.trips.filter((t) => t.status !== "Archived") : [];
  const archived = state.kind === "ready" ? state.trips.filter((t) => t.status === "Archived") : [];

  return (
    <section className="sa-page" aria-labelledby="trips-title">
      <header className="sa-page__header">
        <h1 id="trips-title" className="sa-page__title">
          {t.trips.title}
        </h1>
        {state.kind === "ready" && state.trips.length > 0 && newTrip}
      </header>

      {state.kind === "loading" && (
        <p className="sa-loading" role="status">
          {t.trips.loading}
        </p>
      )}

      {state.kind === "error" && (
        <div className="sa-inlineError" role="alert">
          <p>{errorMessage(state.error, t.errors)}</p>
          <button type="button" className="sa-btn-secondary" onClick={load}>
            {t.common.tryAgain}
          </button>
        </div>
      )}

      {state.kind === "ready" && state.trips.length === 0 && (
        <EmptyState
          title={t.trips.emptyTitle}
          body={t.trips.emptyBody}
          action={newTrip}
        />
      )}

      {active.length > 0 && (
        <ul className="sa-tripList" aria-label={t.trips.activeLabel}>
          {active.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </ul>
      )}

      {archived.length > 0 && (
        <section className="sa-page__section" aria-labelledby="archived-title">
          <h2 id="archived-title" className="sa-sectionTitle">
            {t.trips.archived}
          </h2>
          <ul className="sa-tripList sa-tripList--archived" aria-label={t.trips.archivedLabel}>
            {archived.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
