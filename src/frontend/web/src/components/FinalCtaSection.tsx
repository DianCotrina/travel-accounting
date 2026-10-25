import { useI18n } from "@/app/i18n";
import "./FinalCtaSection.css";

export interface FinalCtaSectionProps {
  id?: string;
  title: string;
  description: string;
  primaryCta: { label: string; onClick: () => void };
}

export function FinalCtaSection({
  id = "get-started",
  title,
  description,
  primaryCta,
}: FinalCtaSectionProps) {
  const { t } = useI18n();
  return (
    <section id={id} className="sa-finalCta" aria-labelledby="sa-finalCta-title">
      <div className="sa-section-inner">
        <div className="sa-finalCta__band">
          <div className="sa-finalCta__content">
            <h2 id="sa-finalCta-title">{title}</h2>
            <p>{description}</p>
            <div className="sa-finalCta__actions">
              <button type="button" className="sa-btn sa-btn--primary sa-btn--lg" onClick={primaryCta.onClick}>
                {primaryCta.label}
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="sa-footer" aria-label={t.finalCta.siteFooter}>
        <div className="sa-footer__inner">
          <div className="sa-footer__brand">
            <div className="sa-footer__brandRow">
              <img src="/sacatucuenta-logo.png" alt="" width={32} height={32} />
              <span>{t.common.brand}</span>
            </div>
            <p>{t.finalCta.tagline}</p>
          </div>
          <nav className="sa-footer__columns" aria-label={t.finalCta.footerNav}>
            <div>
              <h3>{t.finalCta.product}</h3>
              <a href="#features">{t.nav.features}</a>
              <a href="#how-it-works">{t.nav.howItWorks}</a>
              <a href="#pricing">{t.nav.pricing}</a>
              <a href="#faq">{t.nav.faq}</a>
            </div>
          </nav>
        </div>
        <div className="sa-footer__bottom">
          <p>{t.finalCta.rights(new Date().getFullYear())}</p>
        </div>
      </footer>
    </section>
  );
}
