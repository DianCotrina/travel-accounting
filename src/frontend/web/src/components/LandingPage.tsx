type LandingPageProps = {
  onGoToWorkspace?: () => void;
};

const featureCards = [
  {
    title: "Track local expenses",
    description:
      "Capture meals, transport, museums, snacks, and any travel cost in the destination currency.",
  },
  {
    title: "Convert to home currency",
    description:
      "Keep visibility of the home-currency impact with exchange-rate support and daily accounting context.",
  },
  {
    title: "Export for accounting",
    description:
      "Prepare reports and CSV outputs that are easier to review, reconcile, and share with accounting workflows.",
  },
];

export function LandingPage({ onGoToWorkspace }: LandingPageProps) {
  return (
    <section className="landing-shell" aria-labelledby="landing-title">
      <div className="landing-backdrop" aria-hidden="true" />

      <header className="landing-nav">
        <div className="brand-pill">
          <img
            src="/sacatucuenta-logo.png"
            alt="Sacatucuenta logo"
            className="brand-pill__logo"
          />
          <div>
            <strong>Sacatucuenta</strong>
            <p>Travel accounting made practical</p>
          </div>
        </div>
        <a className="ghost-link" href="#workspace" onClick={onGoToWorkspace}>
          Open workspace
        </a>
      </header>

      <div className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">Travel accounting for real trips</p>
          <h1 id="landing-title">
            Record expenses abroad and understand the impact in your own
            currency.
          </h1>
          <p className="landing-description">
            Built for travelers who need a clean accounting trail while moving
            between currencies. Capture daily expenses, convert totals, and keep
            reports ready for review.
          </p>
          <div className="landing-actions">
            <a
              className="cta-primary"
              href="#workspace"
              onClick={onGoToWorkspace}
            >
              Start using the app
            </a>
            <a className="cta-secondary" href="#how-it-works">
              How it works
            </a>
          </div>
          <ul className="landing-metrics" aria-label="Product highlights">
            <li>
              <span>Multi-currency</span>
              <strong>Trip + home totals</strong>
            </li>
            <li>
              <span>Fast entry</span>
              <strong>Expense-first workflow</strong>
            </li>
            <li>
              <span>Reports</span>
              <strong>CSV export ready</strong>
            </li>
          </ul>
        </div>

        <div className="landing-visual" aria-hidden="true">
          <div className="glow-ring glow-ring--a" />
          <div className="glow-ring glow-ring--b" />
          <div className="hero-card">
            <img
              src="/sacatucuenta-logo.png"
              alt=""
              className="hero-card__logo"
              role="presentation"
            />
            <div className="hero-card__grid">
              <div className="hero-stat">
                <span>Trip total (ARS)</span>
                <strong>245,340</strong>
              </div>
              <div className="hero-stat">
                <span>Home total (USD)</span>
                <strong>178.22</strong>
              </div>
              <div className="hero-stat hero-stat--wide">
                <span>Today</span>
                <strong>Meals + Transport + Museum</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        id="how-it-works"
        className="landing-grid"
        aria-label="How it works"
      >
        {featureCards.map((feature) => (
          <article key={feature.title} className="landing-feature-card">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
