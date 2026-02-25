type LandingPageProps = {
  onGoToWorkspace?: () => void;
};

const featureCards = [
  {
    label: "Capture",
    title: "Track local expenses",
    description:
      "Log meals, transport, museums, snacks, and any travel cost in the destination currency without losing context.",
  },
  {
    label: "Convert",
    title: "Understand home-currency impact",
    description:
      "Keep visibility of totals in your home currency so trip spending is easier to review and reconcile.",
  },
  {
    label: "Report",
    title: "Export accounting-ready summaries",
    description:
      "Generate summaries and CSV exports for accounting reviews, reimbursements, or personal finance records.",
  },
];

const previewChapters = [
  "Trip setup",
  "Expense logging",
  "Ledger summary",
  "CSV export",
];

const categoryTags = [
  "Fast categorization",
  "Icon-led scanning",
  "Filter-ready taxonomy",
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

        <nav className="landing-nav__actions" aria-label="Landing navigation">
          <a className="ghost-link" href="#how-it-works">
            Features
          </a>
          <a
            className="ghost-link"
            href="#product-demo"
            onClick={onGoToWorkspace}
          >
            Watch preview
          </a>
        </nav>
      </header>

      <div className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">Travel accounting for real trips</p>
          <div className="hero-badge-row" aria-label="Product positioning">
            <span className="hero-badge">Built for travelers</span>
            <span className="hero-badge hero-badge--accent">
              Accounting-ready outputs
            </span>
          </div>

          <h1 id="landing-title">
            Record expenses abroad and understand the impact in your own
            currency.
          </h1>

          <p className="landing-description">
            Sacatucuenta helps you keep a clean spending trail while traveling
            internationally. Track local costs, preserve conversion visibility,
            and prepare reports for review.
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
              Explore features
            </a>
          </div>

          <ul className="landing-metrics" aria-label="Product highlights">
            <li>
              <span>Multi-currency</span>
              <strong>Trip + home totals</strong>
            </li>
            <li>
              <span>Fast entry</span>
              <strong>Category-first logging</strong>
            </li>
            <li>
              <span>Exports</span>
              <strong>CSV-ready reporting</strong>
            </li>
          </ul>
        </div>

        <div className="landing-visual" aria-hidden="true">
          <div className="glow-ring glow-ring--a" />
          <div className="glow-ring glow-ring--b" />
          <div className="hero-card">
            <div className="hero-card__top">
              <img
                src="/sacatucuenta-logo.png"
                alt=""
                className="hero-card__logo"
                role="presentation"
              />
              <div className="hero-card__identity">
                <p>Buenos Aires trip</p>
                <strong>Feb 18 - Feb 24</strong>
              </div>
            </div>

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
                <span>Today categories</span>
                <strong>Meals + Transport + Museum</strong>
              </div>
            </div>

            <div className="hero-card__footer">
              <div className="hero-progress">
                <div className="hero-progress__row">
                  <span className="hero-progress__label">
                    Entries categorized
                  </span>
                  <span className="hero-progress__value">89%</span>
                </div>
                <div className="hero-progress__track" role="presentation">
                  <div className="hero-progress__fill" />
                </div>
              </div>
              <p className="hero-card__note">
                Home conversion available for most expenses
              </p>
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
            <p className="landing-feature-card__label">{feature.label}</p>
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
            Keep the landing page focused on value. Use a short video
            walkthrough to present the operational workflow once you record it.
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
            <p>Product preview</p>
          </div>
          <div className="landing-video-card__body">
            <div className="play-button" aria-hidden="true">
              &#9654;
            </div>
            <p>Replace this panel with an embedded product video.</p>
            <div className="landing-video-card__timeline" aria-hidden="true">
              <span className="landing-video-card__timeline-fill" />
            </div>
            <div className="landing-video-card__chapters" aria-hidden="true">
              {previewChapters.map((chapter) => (
                <span key={chapter}>{chapter}</span>
              ))}
            </div>
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
            A clear category list speeds up data entry and reduces
            classification friction. This reference can guide future
            improvements in expense capture and report filters.
          </p>
          <div
            className="landing-inspirations__tags"
            aria-label="UI directions"
          >
            {categoryTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <figure className="landing-inspirations__figure">
          <div className="landing-inspirations__frame">
            <div
              className="landing-inspirations__frame-header"
              aria-hidden="true"
            >
              <span className="dot dot--red" />
              <span className="dot dot--amber" />
              <span className="dot dot--green" />
              <p>Reference panel</p>
            </div>
            <img
              src="/categories.png"
              alt="Expense categories menu inspiration"
              className="landing-inspirations__image"
            />
          </div>
          <figcaption>
            Reference image from `assets/design-inspirations/categories.png`
          </figcaption>
        </figure>
      </section>
    </section>
  );
}
