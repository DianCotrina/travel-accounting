import { useMemo, useState } from "react";
import categoryCatalog from "../app/landingCategories.json";

type LandingPageProps = {
  onGoToWorkspace?: () => void;
};

type CategoryCatalogItem = {
  id: string;
  label: string;
  accent: string;
  shortCode: string;
};

const howItWorksSteps = [
  {
    step: "01",
    title: "Create the Trip Context",
    description:
      "Set the destination country, local currency, and your home currency so every expense is recorded with the right accounting context.",
  },
  {
    step: "02",
    title: "Capture Expenses Daily",
    description:
      "Log meals, transport, museums, lodging, and other costs while traveling instead of reconstructing everything at the end.",
  },
  {
    step: "03",
    title: "Review Conversions & Ledger",
    description:
      "Track home-currency impact, identify missing conversions, and keep category/day totals ready for review.",
  },
  {
    step: "04",
    title: "Export Reports for Accounting",
    description:
      "Generate summary views and CSV exports you can share for reimbursement, bookkeeping, or personal expense control.",
  },
];

const previewChapters = [
  "Trip setup",
  "Expense logging",
  "Ledger summary",
  "CSV export",
];

const socialProof = [
  {
    name: "Freelance consultants",
    rating: "4.9/5",
    users: "1,200+",
    quote: "Helps keep reimbursements clean when traveling across countries.",
  },
  {
    name: "Small business travelers",
    rating: "4.8/5",
    users: "800+",
    quote: "The category + export flow saves time at month-end reporting.",
  },
  {
    name: "Digital nomads",
    rating: "4.9/5",
    users: "2,000+",
    quote:
      "Best part is seeing local and home totals without doing manual math.",
  },
];

const categoryTags = [
  "Fast categorization",
  "Icon-led scanning",
  "Filter-ready taxonomy",
];

const categories = categoryCatalog as CategoryCatalogItem[];

export function LandingPage({ onGoToWorkspace }: LandingPageProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ??
      categories[0],
    [selectedCategoryId],
  );

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
            How it works
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
            <a className="cta-secondary" href="#social-proof">
              See user ratings
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
        id="social-proof"
        className="landing-social-proof"
        aria-labelledby="social-proof-title"
      >
        <div className="landing-social-proof__intro">
          <p className="eyebrow">Current users & ratings</p>
          <h2 id="social-proof-title">
            Trusted by travelers who need accounting clarity
          </h2>
          <p>
            Social proof content for the landing page. Replace these examples
            with real metrics and testimonials as users adopt the product.
          </p>
        </div>

        <div className="landing-social-proof__grid">
          {socialProof.map((item) => (
            <article key={item.name} className="social-card">
              <div className="social-card__top">
                <strong>{item.name}</strong>
                <span>{item.rating}</span>
              </div>
              <p className="social-card__users">
                {item.users} current/active users
              </p>
              <p className="social-card__quote">"{item.quote}"</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-how-it-works"
        aria-labelledby="how-it-works-title"
      >
        <div className="landing-how-it-works__header">
          <p className="eyebrow">// How it works</p>
          <h2 id="how-it-works-title">
            From travel spending to accounting-ready records in four steps
          </h2>
          <p>
            Inspired by your reference, adapted to Sacatucuenta’s workflow and
            terminology.
          </p>
        </div>

        <div
          className="timeline-list"
          role="list"
          aria-label="How it works steps"
        >
          {howItWorksSteps.map((step) => (
            <article key={step.step} className="timeline-item" role="listitem">
              <div className="timeline-item__marker" aria-hidden="true">
                <span>{step.step}</span>
              </div>
              <div className="timeline-item__content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
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
          <p className="eyebrow">Category catalog preview</p>
          <h2 id="landing-inspirations-title">
            JSON-driven categories for dropdowns and filters
          </h2>
          <p>
            The categories reference is now represented as data so we can reuse
            the same source for future expense forms, filters, and reporting UI.
          </p>

          <label className="landing-category-select">
            Example categories dropdown
            <select
              value={selectedCategory?.id ?? ""}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          {selectedCategory && (
            <div className="landing-category-selected">
              <span
                className="landing-category-selected__dot"
                style={{ backgroundColor: selectedCategory.accent }}
                aria-hidden="true"
              />
              <div>
                <p>Selected category</p>
                <strong>{selectedCategory.label}</strong>
              </div>
            </div>
          )}

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

            <ul
              className="landing-category-list"
              aria-label="Category catalog preview"
            >
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <span
                    className="landing-category-list__icon"
                    style={{ backgroundColor: category.accent }}
                    aria-hidden="true"
                  >
                    {category.shortCode}
                  </span>
                  <span>{category.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <figcaption>
            Reference image from `assets/design-inspirations/categories.png`
          </figcaption>
        </figure>
      </section>
    </section>
  );
}
