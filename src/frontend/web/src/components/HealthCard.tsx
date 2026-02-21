import type { HealthResponse } from "../app/types";
<<<<<<< HEAD
type HealthCardProps = { health: HealthResponse | null };
=======

type HealthCardProps = {
  health: HealthResponse | null;
};

>>>>>>> 8e1e576 (Refactor frontend into modular components)
export function HealthCard({ health }: HealthCardProps) {
  if (!health) {
    return null;
  }
<<<<<<< HEAD
  return (
    <section className="card">
      {" "}
      <h2>API Health</h2> <p>Status: {health.status}</p>{" "}
      <p>UTC: {health.utcNow}</p>{" "}
=======

  return (
    <section className="card">
      <h2>API Health</h2>
      <p>Status: {health.status}</p>
      <p>UTC: {health.utcNow}</p>
>>>>>>> 8e1e576 (Refactor frontend into modular components)
    </section>
  );
}
