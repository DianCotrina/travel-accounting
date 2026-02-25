import categoryCatalog from "../app/landingCategories.json";
import type { CategoryCatalogEntry } from "../app/categoryCatalog";
import { CategoryCatalogPreview } from "./CategoryCatalogPreview";
import { LandingLoginSection } from "./LandingLoginSection";
import "./LandingPage.css";

type LandingPageProps = {
  onGoToWorkspace?: () => void;
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

const aboutHighlights = [
  {
    title: "Designed for Travel Reality",
    body: "Track real expenses as they happen: rides, meals, museums, lodging, and daily purchases in the destination currency.",
  },
  {
    title: "Built for Accounting Review",
    body: "Keep conversion visibility and structured categories so month-end reporting and reimbursements take less time.",
  },
  {
    title: "Modular Product Foundation",
    body: "The product evolves in modules so new features can ship without destabilizing the core travel accounting workflow.",
  },
];

const categoryTags = [
  "Fast categorization",
  "Icon-led scanning",
  "Filter-ready taxonomy",
];

const categories = categoryCatalog as CategoryCatalogEntry[];

export function LandingPage({ onGoToWorkspace }: LandingPageProps) {
  return (
    <section className="landing-shell" aria-labelledby="landing-title">
      <a className="skip-link" href="#landing-main">
        Skip to main content
      </a>
      <div className="landing-backdrop" aria-hidden="true" />

      <header className="landing-nav" aria-label="Site header">
        <div className="brand-pill">
          <img
            src="/sacatucuenta-logo.png"
            alt="Sacatucuenta logo"
            className="brand-pill__logo"
            width={768}
            height={768}
            fetchPriority="high"
          />
          <div>
            <strong>Sacatucuenta</strong>
            <p>Travel accounting made practical</p>
          </div>
        </div>

        <nav className="landing-nav__actions" aria-label="Landing navigation">
          <a className="ghost-link" href="#about">
            About
          </a>
          <a className="ghost-link" href="#how-it-works">
            How it works
          </a>
          <a className="ghost-link" href="#contact-us">
            Contact
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

      <main id="landing-main">
        <div className="landing-hero anchor-section">
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
              internationally. Track local costs, preserve conversion
              visibility, and prepare reports for review, reimbursement, and
              accounting workflows.
            </p>

            <div className="landing-actions">
              <a
                className="cta-primary"
                href="#login-options"
                onClick={onGoToWorkspace}
              >
                Start Login
              </a>
              <a className="cta-secondary" href="#product-demo">
                Watch Product Preview
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
                  width={768}
                  height={768}
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
          id="about"
          className="landing-about anchor-section"
          aria-labelledby="about-title"
        >
          <div className="landing-about__intro">
            <p className="eyebrow">About</p>
            <h2 id="about-title">
              Built to make travel spending usable for accounting, not just
              tracking
            </h2>
            <p>
              The product focuses on structured expense capture, category
              consistency, and export-ready reporting. You spend less time
              rebuilding receipts and more time reviewing clear totals.
            </p>
            <div className="landing-actions">
              <a className="cta-primary" href="#how-it-works">
                Learn How It Works
              </a>
              <a className="cta-secondary" href="#contact-us">
                Contact Us
              </a>
            </div>
          </div>

          <div className="landing-about__grid">
            {aboutHighlights.map((item) => (
              <article key={item.title} className="about-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <LandingLoginSection onGoToWorkspace={onGoToWorkspace} />

        <section
          id="testimonials"
          className="landing-social-proof anchor-section"
          aria-labelledby="social-proof-title"
        >
          <div className="landing-social-proof__intro">
            <p className="eyebrow">Testimonials</p>
            <h2 id="social-proof-title">
              Trusted by travelers who need accounting clarity
            </h2>
            <p>
              Example testimonials and ratings for the landing page. Replace
              these with real customer quotes and metrics as adoption grows.
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
          className="landing-how-it-works anchor-section"
          aria-labelledby="how-it-works-title"
        >
          <div className="landing-how-it-works__header">
            <p className="eyebrow">// How it works</p>
            <h2 id="how-it-works-title">
              From travel spending to accounting-ready records in four steps
            </h2>
            <p>
              Inspired by your reference, adapted to Sacatucuenta&apos;s travel
              accounting workflow and terminology.
            </p>
          </div>

          <div
            className="timeline-list"
            role="list"
            aria-label="How it works steps"
          >
            {howItWorksSteps.map((step) => (
              <article
                key={step.step}
                className="timeline-item"
                role="listitem"
              >
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
          className="landing-showcase anchor-section"
          aria-labelledby="product-demo-title"
        >
          <div className="landing-showcase__copy">
            <p className="eyebrow">Product walkthrough</p>
            <h2 id="product-demo-title">
              Show the workflow in a short demo video
            </h2>
            <p>
              Keep the landing page focused on value. Use a short video
              walkthrough to present the operational workflow once you record
              it.
            </p>
            <ul className="landing-checklist">
              <li>Trip setup with home vs destination currency</li>
              <li>Daily expense capture and conversion tracking</li>
              <li>Ledger summary and CSV export flow</li>
            </ul>
          </div>

          <div
            className="landing-video-card"
            aria-label="Demo video placeholder"
          >
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
          className="landing-inspirations landing-inspirations--catalog-only anchor-section"
          aria-labelledby="landing-inspirations-title"
        >
          <div className="landing-inspirations__copy">
            <p className="eyebrow">Category catalog preview</p>
            <h2 id="landing-inspirations-title">
              JSON-driven categories for dropdowns and filters
            </h2>
            <p>
              The categories reference is represented as data so the same source
              can be reused in expense forms, filters, and reporting interfaces.
            </p>

            <CategoryCatalogPreview categories={categories} />

            <div
              className="landing-inspirations__tags"
              aria-label="UI directions"
            >
              {categoryTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact-us"
          className="landing-contact anchor-section"
          aria-labelledby="contact-us-title"
        >
          <div className="landing-contact__copy">
            <p className="eyebrow">Contact Us</p>
            <h2 id="contact-us-title">
              Get in touch for early access, feedback, or workflow support
            </h2>
            <p>
              Contact information is visible on the landing page so visitors can
              quickly request a demo, share product feedback, or ask about
              travel-accounting use cases.
            </p>
            <ul
              className="landing-contact__details"
              aria-label="Contact information"
            >
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:hello@sacatucuenta.com">
                  hello@sacatucuenta.com
                </a>
              </li>
              <li>
                <strong>Support:</strong>{" "}
                <a href="mailto:support@sacatucuenta.com">
                  support@sacatucuenta.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </li>
              <li>
                <strong>Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM (US Eastern)
              </li>
            </ul>
          </div>

          <div className="landing-contact__panel">
            <h3>Clear calls to action</h3>
            <p>
              Start with a sign-in method, watch the workflow preview, or
              contact the team directly to schedule a walkthrough.
            </p>
            <div className="landing-contact__actions">
              <a className="cta-primary" href="#login-options">
                Go to Login Options
              </a>
              <a className="cta-secondary" href="#product-demo">
                Watch Preview
              </a>
            </div>
          </div>
        </section>

        <footer
          className="landing-footer anchor-section"
          aria-label="Site footer"
        >
          <div className="landing-footer__brand">
            <img
              src="/sacatucuenta-logo.png"
              alt=""
              className="landing-footer__logo"
              role="presentation"
              width={768}
              height={768}
              loading="lazy"
            />
            <div>
              <strong>Sacatucuenta</strong>
              <p>Travel accounting made practical.</p>
            </div>
          </div>

          <nav className="landing-footer__nav" aria-label="Footer navigation">
            <a href="#about">About</a>
            <a href="#how-it-works">How it works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact-us">Contact Us</a>
          </nav>

          <div className="landing-footer__contact">
            <a href="mailto:hello@sacatucuenta.com">hello@sacatucuenta.com</a>
            <span aria-hidden="true">&bull;</span>
            <a href="tel:+15551234567">+1 (555) 123-4567</a>
          </div>
        </footer>
      </main>
    </section>
  );
}
