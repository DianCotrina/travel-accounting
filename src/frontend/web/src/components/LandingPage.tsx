import { useEffect, useRef } from "react";
import "./LandingPage.css";
import { BenefitsSection } from "./BenefitsSection";
import { FaqSection } from "./FaqSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { PricingSection } from "./PricingSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { LandingNavbar } from "./ui/LandingNavbar";
import { HeroSectionDark } from "./ui/HeroSectionDark";
import { HowItWorks } from "./ui/HowItWorks";
import { AnalyticsDashboardPreview } from "./ui/AnalyticsDashboardPreview";
import { ShootingStars } from "./ui/shooting-stars";

const productStats = [
  { label: "Trips logged", value: "12,480+" },
  { label: "Expense entries", value: "1.8M" },
  { label: "Countries used", value: "84" },
];

const benefitsCards = [
  {
    title: "Stop rebuilding trips from receipts after you get home",
    body: "Capture expenses while you travel so finance review is based on real entries, not reconstructed memory and screenshots.",
  },
  {
    title: "See local spending and home-currency impact in the same workflow",
    body: "Keep destination and home currency context together so travel decisions and accounting review stay aligned.",
  },
  {
    title: "Export summaries that finance can actually use",
    body: "Category and ledger outputs are designed for reimbursement and bookkeeping workflows, not generic personal budgeting notes.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    subtitle: "For occasional trips",
    highlights: ["1 active trip", "Manual review workflow", "Basic expense logging"],
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
      "Exchange-rate visibility",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Team",
    price: "$39",
    subtitle: "Per month",
    highlights: ["Shared trip workflows", "Audit-ready exports", "Team visibility", "Onboarding support"],
    cta: "Contact Sales",
    featured: false,
  },
];

const testimonials = [
  {
    role: "Operations Consultant",
    quote:
      "I stopped sending spreadsheets after every trip. Sacatucuenta gives finance a clean summary the same day instead of a week later.",
    person: "Mariana R.",
    rating: 5,
  },
  {
    role: "Startup Founder",
    quote:
      "The most useful part is seeing ARS expenses translated to USD impact without guessing rates or redoing calculations at month-end.",
    person: "David L.",
    rating: 5,
  },
  {
    role: "Remote Team Lead",
    quote:
      "Categories and exports cut reimbursement review time dramatically for our travel-heavy team. It removed the back-and-forth.",
    person: "Ana P.",
    rating: 4,
  },
  {
    role: "Digital Nomad",
    quote:
      "I use it like an accounting journal for travel. By the end of the month, everything is already categorized and exportable.",
    person: "Carlos M.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "Does Sacatucuenta replace accounting software?",
    answer:
      "No. It focuses on travel expense capture, currency context, and exportable summaries that fit into your accounting workflow.",
  },
  {
    question: "Can I log expenses in local currency and still review home-currency impact?",
    answer:
      "Yes. Trips store both home and destination currency context, so local spending and home-equivalent review can be tracked together.",
  },
  {
    question: "Is this useful for reimbursements and bookkeeping?",
    answer:
      "Yes. The product is designed around categorized entries, ledger summaries, and CSV exports that support reimbursement and bookkeeping processes.",
  },
  {
    question: "Do teams use it or is it only for solo travelers?",
    answer:
      "Both. Solo travelers can keep personal records clean, and teams can use the current MVP multi-user direction for shared travel workflows.",
  },
];

export function LandingPage() {
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) {
      return;
    }

    const sections = Array.from(root.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );

    sections.forEach((section, index) => {
      section.classList.add("sa-reveal");
      section.style.setProperty("--sa-reveal-delay", `${Math.min(index * 35, 180)}ms`);
    });

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    if (typeof window.IntersectionObserver !== "function") {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

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

      <main id="top" className="sa-main" ref={mainRef}>
        <HeroSectionDark
          title="Travel Accounting Platform"
          subtitle={{
            regular: "Record foreign travel expenses with ",
            gradient: "accounting clarity built in.",
          }}
          description="Sacatucuenta helps travelers and teams log local-currency expenses, review home-currency impact, and export finance-ready summaries before month-end pressure starts."
          ctaText="Start Free Trial"
          ctaHref="#pricing"
          secondaryCtaText="See How It Works"
          secondaryCtaHref="#features"
          stats={productStats}
          bottomSlot={<AnalyticsDashboardPreview />}
          gridOptions={{ angle: 66, cellSize: 54, opacity: 0.2, lineColor: "#ff6a1c10" }}
        />

        <BenefitsSection
          title="Built for real travel accounting work, not generic expense tracking"
          description="The product is designed for the handoff between travelers and finance: capture daily spend during the trip, preserve currency context, and generate records that are usable for review and reimbursement."
          proofPoints={[
            "Local + home currency context",
            "Category and subcategory capture",
            "Ledger + CSV export workflow",
          ]}
          cards={benefitsCards}
          workflow={
            <HowItWorks
              title="How the travel accounting workflow stays clean"
              description="From trip setup to export, each step is structured to produce records that remain useful for finance review instead of turning into manual cleanup work."
            />
          }
        />

        <PricingSection
          title="Pricing for travelers and teams that care about clean records"
          description="Start simple for personal trips, then scale into recurring travel workflows with ledger summaries and export-ready reporting."
          plans={pricingPlans}
        />

        <TestimonialsSection
          title="Teams and travelers rely on clear records, not month-end reconstruction"
          description="The strongest feedback is consistency: fewer spreadsheets, less rework, and faster reimbursement review with better expense context."
          items={testimonials}
        />

        <FaqSection
          title="Answers for evaluating the workflow"
          description="The goal is simple: better travel accounting records with less cleanup. These answers clarify what the product is built to support today."
          items={faqs}
        />

        <FinalCtaSection
          title="Take control of travel expenses before they become month-end cleanup"
          description="Start with the traveler workflow, then extend into a finance-friendly review process with categorized records and export-ready summaries."
          primaryCta={{ label: "Email hello@sacatucuenta.com", href: "mailto:hello@sacatucuenta.com" }}
          secondaryCta={{ label: "Call +1 (555) 123-4567", href: "tel:+15551234567" }}
        />
      </main>
    </div>
  );
}
