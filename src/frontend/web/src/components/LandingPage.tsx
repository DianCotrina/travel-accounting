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
        <a
          className="ghost-link"
          href="#product-demo"
          onClick={onGoToWorkspace}
        >
          Watch preview
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
              href="#product-demo"
              onClick={onGoToWorkspace}
            >
              Watch product preview
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

      <section
        id="product-demo"
        className="landing-showcase"
        aria-labelledby="product-demo-title"
      >
        <div className="landing-showcase__copy">
          <p className="eyebrow">Product walkthrough</p>
          <h2 id="product-demo-title">
            Show the workflow in a short demo video
          </h2>
          <p>
            The landing page should sell the value first. The full workspace can
            be shown in a video walkthrough or product tour once you record it.
          </p>
          <ul className="landing-checklist">
            <li>Trip setup with home vs destination currency</li>
            <li>Daily expense capture and conversion tracking</li>
            <li>Ledger summary and CSV export flow</li>
          </ul>
        </div>

        <div className="landing-video-card" aria-label="Demo video placeholder">
          <div className="landing-video-card__header">
            <span className="dot dot--red" />
            <span className="dot dot--amber" />
            <span className="dot dot--green" />
            <p>Demo video (placeholder)</p>
          </div>
          <div className="landing-video-card__body">
            <div className="play-button" aria-hidden="true">
              ▶
            </div>
            <p>Replace this block with an embedded product video later.</p>
          </div>
        </div>
      </section>

      <section
        className="landing-inspirations"
        aria-labelledby="landing-inspirations-title"
      >
        <div className="landing-inspirations__copy">
          <p className="eyebrow">Design direction</p>
          <h2 id="landing-inspirations-title">
            Category-focused navigation inspiration
          </h2>
          <p>
            Using a clear category list helps users classify travel expenses
            fast. This reference can inform future UI iterations for expense
            entry and reporting filters.
          </p>
        </div>
        <figure className="landing-inspirations__figure">
          <img
            src="/categories.png"
            alt="Expense categories menu inspiration"
            className="landing-inspirations__image"
          />
          <figcaption>
            Reference image from assets/design-inspirations/categories.png
          </figcaption>
        </figure>
      </section>
    </section>
  );
}
