import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import { BenefitsSection } from "./BenefitsSection";
import { FaqSection } from "./FaqSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { PricingSection } from "./PricingSection";
import { LandingNavbar } from "./ui/LandingNavbar";
import { SignInModal } from "./ui/SignInModal";
import { HeroSectionDark } from "./ui/HeroSectionDark";
import { HowItWorks } from "./ui/HowItWorks";
import { SampleTripPreview } from "./ui/SampleTripPreview";
import { ShootingStars } from "./ui/shooting-stars";

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
    cta: "Try the preview",
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
    cta: "Try the preview",
    featured: true,
  },
  {
    name: "Team",
    price: "$39",
    subtitle: "Per month",
    highlights: ["Shared trip workflows", "Audit-ready exports", "Team visibility", "Onboarding support"],
    featured: false,
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
  const [signInOpen, setSignInOpen] = useState(false);
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

  const openPreview = () => setSignInOpen(true);

  return (
    <div className="sa-landing">
      <div className="sa-page-sky" aria-hidden="true">
        <div className="sa-page-sky__glow" />
        <div className="sa-page-sky__stars" />
        <ShootingStars
          className="sa-page-sky__shootingStars sa-page-sky__shootingStars--a"
          starColor="var(--copper-light)"
          trailColor="var(--copper)"
          minSpeed={12}
          maxSpeed={26}
          minDelay={900}
          maxDelay={2600}
          starWidth={14}
          starHeight={1.2}
        />
        <ShootingStars
          className="sa-page-sky__shootingStars sa-page-sky__shootingStars--b"
          starColor="var(--ivory)"
          trailColor="var(--copper-light)"
          minSpeed={8}
          maxSpeed={18}
          minDelay={1600}
          maxDelay={3800}
          starWidth={10}
          starHeight={1}
        />
      </div>

      <LandingNavbar onTryPreview={openPreview} />

      <main id="top" className="sa-main" ref={mainRef}>
        <HeroSectionDark
          subtitle={{
            regular: "Travel expenses with ",
            gradient: "accounting clarity.",
          }}
          description="Log local-currency spending, monitor home-currency impact, and export finance-ready summaries — before month-end pressure starts."
          ctaText="Try the preview"
          onCtaClick={openPreview}
          secondaryCtaText="See How It Works"
          secondaryCtaHref="#how-it-works"
          bottomSlot={<SampleTripPreview />}
          gridOptions={{ angle: 66, cellSize: 54, opacity: 0.2, lineColor: "color-mix(in oklab, var(--copper) 6%, transparent)" }}
        />

        <HowItWorks
          title="How the travel accounting workflow stays clean"
          description="From trip setup to export, each step is structured to produce records that remain useful for finance review."
        />

        <BenefitsSection
          title="Built for real travel accounting work"
          description="Designed for the handoff between travelers and finance: capture daily spend, preserve currency context, and generate records for review."
          cards={benefitsCards}
        />

        <PricingSection
          title="Pricing for travelers and teams"
          description="Start simple for personal trips, then scale into recurring travel workflows with ledger summaries and export-ready reporting."
          plans={pricingPlans}
          onTryPreview={openPreview}
        />

        <FaqSection
          title="Answers for evaluating the workflow"
          description="Better travel accounting records with less cleanup."
          items={faqs}
        />

        <FinalCtaSection
          title="Take control of travel expenses before month-end"
          description="Start with the traveler workflow, then extend into a finance-friendly review process with categorized records and export-ready summaries."
          primaryCta={{ label: "Try the preview", onClick: openPreview }}
        />
      </main>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
