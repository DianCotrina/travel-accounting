import "./LandingPage.css";
import { LandingNavbar } from "./ui/LandingNavbar";
import { HeroSectionDark } from "./ui/HeroSectionDark";
import { HowItWorks } from "./ui/HowItWorks";
import { ShootingStars } from "./ui/shooting-stars";

const productStats = [
  { label: "Trips logged", value: "12,480+" },
  { label: "Expense entries", value: "1.8M" },
  { label: "Countries used", value: "84" },
];

const problemCards = [
  {
    title: "Scattered receipts",
    body: "Capture travel expenses as they happen instead of rebuilding everything after the trip.",
  },
  {
    title: "Currency confusion",
    body: "Track local amounts and home-currency impact in one accounting-friendly flow.",
  },
  {
    title: "Messy reimbursement prep",
    body: "Export category-based summaries and CSV files ready for finance review.",
  },
];


const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    subtitle: "For personal trips",
    highlights: ["1 active trip", "Basic logging", "Manual review"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Traveler Pro",
    price: "$15",
    subtitle: "Per month",
    highlights: [
      "Unlimited trips",
      "Ledger summaries",
      "CSV export",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Team",
    price: "$39",
    subtitle: "Per month",
    highlights: [
      "Multi-user workflows",
      "Shared trip visibility",
      "Audit-ready exports",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const testimonials = [
  {
    role: "Operations Consultant",
    quote:
      "I stopped sending spreadsheets after every trip. Sacatucuenta gives finance a clean summary the same day.",
    person: "Mariana R.",
  },
  {
    role: "Startup Founder",
    quote:
      "The best part is seeing ARS expenses translated to USD without guessing rates or redoing math.",
    person: "David L.",
  },
  {
    role: "Remote Team Lead",
    quote:
      "Categories and exports cut reimbursement review time by more than half for our travel-heavy team.",
    person: "Ana P.",
  },
  {
    role: "Digital Nomad",
    quote:
      "I use it as a travel accounting journal. Everything is categorized before month-end arrives.",
    person: "Carlos M.",
  },
];

const faqs = [
  {
    question: "Does Sacatucuenta replace accounting software?",
    answer:
      "No. It is focused on travel expense capture, conversion visibility, and clean exports for your accounting workflow.",
  },
  {
    question: "Can I log expenses in the local currency and still see my home currency?",
    answer:
      "Yes. Trips keep both destination and home currency context so you can review local totals and home-equivalent amounts.",
  },
  {
    question: "Can teams use it?",
    answer:
      "Yes, the current MVP includes user ownership isolation and a path toward stronger multi-user workflows.",
  },
  {
    question: "Do you support CSV exports?",
    answer:
      "Yes. You can export travel expense summaries for reimbursement, bookkeeping, or personal accounting review.",
  },
];

function DashboardMock() {
  return (
    <div className="sa-hero-panel" aria-hidden="true">
      <div className="sa-hero-panel__toolbar">
        <span className="sa-dot sa-dot--red" />
        <span className="sa-dot sa-dot--amber" />
        <span className="sa-dot sa-dot--green" />
        <p>Travel Accounting Dashboard</p>
      </div>

      <div className="sa-hero-panel__body">
        <aside className="sa-side-menu">
          <div className="sa-side-menu__brand" />
          <div className="sa-side-menu__item sa-side-menu__item--active" />
          <div className="sa-side-menu__item" />
          <div className="sa-side-menu__item" />
          <div className="sa-side-menu__item" />
        </aside>

        <div className="sa-dashboard-content">
          <div className="sa-dashboard-top">
            <div className="sa-stat-card sa-stat-card--accent">
              <span>Today Spend (ARS)</span>
              <strong>19,000</strong>
            </div>
            <div className="sa-stat-card">
              <span>Home Eq. (USD)</span>
              <strong>13.82</strong>
            </div>
            <div className="sa-stat-card">
              <span>Entries</span>
              <strong>6</strong>
            </div>
            <div className="sa-stat-card">
              <span>Categories</span>
              <strong>3</strong>
            </div>
          </div>

          <div className="sa-dashboard-main">
            <div className="sa-chart-card">
              <div className="sa-chart-card__header">
                <span>Weekly Trend</span>
                <small>Travel + Food + Transport</small>
              </div>
              <div className="sa-chart-card__graph">
                <div className="sa-chart-line" />
                <div className="sa-chart-glow" />
              </div>
            </div>

            <div className="sa-summary-card">
              <p>Top Categories</p>
              <ul>
                <li>
                  <span>Food & Drinks</span>
                  <strong>42%</strong>
                </li>
                <li>
                  <span>Transportation</span>
                  <strong>31%</strong>
                </li>
                <li>
                  <span>Tourism</span>
                  <strong>18%</strong>
                </li>
              </ul>
              <button type="button">Export CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="sa-landing" aria-labelledby="sa-hero-title">
      <div className="sa-page-sky" aria-hidden="true">
        <div className="sa-page-sky__glow" />
        <div className="sa-page-sky__stars" />
        <ShootingStars
          className="sa-page-sky__shootingStars sa-page-sky__shootingStars--a"
          starColor="#ff8f47"
          trailColor="#ff6a1c"
          minSpeed={12}
          maxSpeed={26}
          minDelay={900}
          maxDelay={2600}
          starWidth={14}
          starHeight={1.2}
        />
        <ShootingStars
          className="sa-page-sky__shootingStars sa-page-sky__shootingStars--b"
          starColor="#ffd09e"
          trailColor="#ff9c4f"
          minSpeed={8}
          maxSpeed={18}
          minDelay={1600}
          maxDelay={3800}
          starWidth={10}
          starHeight={1}
        />
      </div>
      <LandingNavbar />

      <main id="top" className="sa-main">
        <HeroSectionDark
          title="Travel Accounting Platform"
          subtitle={{
            regular: "Track foreign travel expenses without losing ",
            gradient: "accounting clarity.",
          }}
          description="Sacatucuenta helps you log local-currency travel spending, monitor home-currency impact, and export clean summaries for reimbursement and bookkeeping."
          ctaText="Start Free Trial"
          ctaHref="#pricing"
          secondaryCtaText="Explore Features"
          secondaryCtaHref="#features"
          stats={productStats}
          bottomSlot={<DashboardMock />}
          gridOptions={{ angle: 66, cellSize: 54, opacity: 0.2, lineColor: "#ff6a1c10" }}
        />

        <section className="sa-problems" aria-labelledby="sa-problems-title">
          <div className="sa-section-head">
            <p className="sa-kicker">Why teams use it</p>
            <h2 id="sa-problems-title">
              Stop struggling with travel money management after the trip ends.
            </h2>
          </div>
          <div className="sa-card-grid sa-card-grid--three">
            {problemCards.map((card) => (
              <article key={card.title} className="sa-panel-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="sa-features" aria-labelledby="sa-features-title">
          <div className="sa-section-head">
            <p className="sa-kicker">Everything you need</p>
            <h2 id="sa-features-title">
              Built for real travel accounting workflows, not generic expense notes.
            </h2>
          </div>
          <HowItWorks />
        </section>

        <section id="pricing" className="sa-pricing" aria-labelledby="sa-pricing-title">
          <div className="sa-section-head">
            <p className="sa-kicker">Choose your plan</p>
            <h2 id="sa-pricing-title">Pricing for solo travelers and finance-aware teams.</h2>
          </div>
          <div className="sa-card-grid sa-card-grid--pricing">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={plan.featured ? "sa-pricing-card sa-pricing-card--featured" : "sa-pricing-card"}
              >
                <p className="sa-pricing-card__name">{plan.name}</p>
                <div className="sa-pricing-card__priceRow">
                  <strong>{plan.price}</strong>
                  <span>{plan.subtitle}</span>
                </div>
                <ul>
                  {plan.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className={plan.featured ? "sa-btn sa-btn--primary" : "sa-btn sa-btn--ghost"} href="#contact">
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          id="testimonials"
          className="sa-testimonials"
          aria-labelledby="sa-testimonials-title"
        >
          <div className="sa-section-head">
            <p className="sa-kicker">Loved by users</p>
            <h2 id="sa-testimonials-title">Travelers and operators rely on clean summaries.</h2>
          </div>
          <div className="sa-card-grid sa-card-grid--two">
            {testimonials.map((item) => (
              <blockquote key={item.person} className="sa-testimonial-card">
                <p className="sa-testimonial-card__quote">Ã¢â‚¬Å“{item.quote}Ã¢â‚¬Â</p>
                <footer>
                  <strong>{item.person}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="faq" className="sa-faq" aria-labelledby="sa-faq-title">
          <div className="sa-section-head">
            <p className="sa-kicker">Frequently Asked Questions</p>
            <h2 id="sa-faq-title">Answers for teams evaluating travel expense workflows.</h2>
          </div>
          <div className="sa-faq-list">
            {faqs.map((item) => (
              <details key={item.question} className="sa-faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="sa-cta-band" aria-labelledby="sa-cta-band-title">
          <div>
            <p className="sa-kicker">Ready to start?</p>
            <h2 id="sa-cta-band-title">Take control of travel expenses before month-end.</h2>
            <p>
              Contact the team for early access, pilot onboarding, or a walkthrough of the accounting workflow.
            </p>
          </div>
          <div className="sa-cta-band__actions">
            <a className="sa-btn sa-btn--primary" href="mailto:hello@sacatucuenta.com">
              Email hello@sacatucuenta.com
            </a>
            <a className="sa-btn sa-btn--ghost" href="tel:+15551234567">
              Call +1 (555) 123-4567
            </a>
          </div>
        </section>
      </main>

      <footer className="sa-footer" aria-label="Site footer">
        <div className="sa-footer__brand">
          <span>Sacatucuenta</span>
          <p>Travel accounting made practical.</p>
        </div>
        <nav className="sa-footer__nav" aria-label="Footer navigation">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
}




