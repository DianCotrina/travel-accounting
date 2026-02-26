import "./StatsBand.css";

interface StatItem {
  label: string;
  value: string;
}

interface StatsBandProps {
  stats: StatItem[];
}

export function StatsBand({ stats }: StatsBandProps) {
  return (
    <section className="sa-statsBand" aria-label="Product statistics">
      <div className="sa-statsBand__inner">
        {stats.map((stat) => (
          <div key={stat.label} className="sa-statsBand__item">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
