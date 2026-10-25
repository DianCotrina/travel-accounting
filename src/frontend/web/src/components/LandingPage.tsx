import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/app/i18n";
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

export function LandingPage() {
  const [signInOpen, setSignInOpen] = useState(false);
  const { t } = useI18n();
  const pricingPlans = [
    { ...t.pricing.plans.starter, price: "$0", cta: t.common.tryPreview },
    { ...t.pricing.plans.pro, price: "$15", subtitle: t.pricing.perMonth, cta: t.common.tryPreview, featured: true },
    { ...t.pricing.plans.team, price: "$39", subtitle: t.pricing.perMonth },
  ];
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
            regular: t.hero.titleRegular,
            gradient: t.hero.titleAccent,
          }}
          description={t.hero.description}
          ctaText={t.common.tryPreview}
          onCtaClick={openPreview}
          secondaryCtaText={t.hero.secondaryCta}
          secondaryCtaHref="#how-it-works"
          bottomSlot={<SampleTripPreview />}
          gridOptions={{ angle: 66, cellSize: 54, opacity: 0.2, lineColor: "color-mix(in oklab, var(--copper) 6%, transparent)" }}
        />

        <HowItWorks
          title={t.howItWorks.title}
          description={t.howItWorks.description}
          steps={t.howItWorks.steps}
        />

        <BenefitsSection
          title={t.benefits.title}
          description={t.benefits.description}
          cards={t.benefits.cards}
        />

        <PricingSection
          title={t.pricing.title}
          description={t.pricing.description}
          plans={pricingPlans}
          onTryPreview={openPreview}
        />

        <FaqSection
          title={t.faq.title}
          description={t.faq.description}
          items={t.faq.items}
        />

        <FinalCtaSection
          title={t.finalCta.title}
          description={t.finalCta.description}
          primaryCta={{ label: t.common.tryPreview, onClick: openPreview }}
        />
      </main>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
