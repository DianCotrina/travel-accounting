import { useI18n } from "@/app/i18n";
import "./PricingSection.css";

export interface PricingPlan {
  name: string;
  price: string;
  subtitle: string;
  highlights: string[];
  /** Omit for plans that aren't available yet; they show as "Coming soon". */
  cta?: string;
  featured?: boolean;
}

export interface PricingSectionProps {
  id?: string;
  title: string;
  description: string;
  plans: PricingPlan[];
  onTryPreview: () => void;
}

export function PricingSection({
  id = "pricing",
  title,
  description,
  plans,
  onTryPreview,
}: PricingSectionProps) {
  const { t } = useI18n();
  return (
    <section id={id} className="sa-pricingSection" aria-labelledby="sa-pricing-title">
      <div className="sa-section-inner">
        <header className="sa-section-header--centered">
          <h2 id="sa-pricing-title">{title}</h2>
          <p>{description}</p>
        </header>

        <div className="sa-pricingSection__grid">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.featured
                  ? "sa-pricingSection__card sa-pricingSection__card--featured"
                  : "sa-pricingSection__card"
              }
            >
              {plan.featured ? (
                <p className="sa-pricingSection__badge">{t.pricing.recommended}</p>
              ) : null}
              <p className="sa-pricingSection__name">{plan.name}</p>
              <div className="sa-pricingSection__price">
                <strong>{plan.price}</strong>
                <span>{plan.subtitle}</span>
              </div>
              <ul>
                {plan.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {plan.cta ? (
                <button
                  type="button"
                  className={plan.featured ? "sa-btn sa-btn--primary" : "sa-btn sa-btn--ghost"}
                  onClick={onTryPreview}
                >
                  {plan.cta}
                </button>
              ) : (
                <p className="sa-pricingSection__soon">{t.pricing.comingSoon}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
