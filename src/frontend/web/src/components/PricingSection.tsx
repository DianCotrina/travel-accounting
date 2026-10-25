import "./PricingSection.css";

export interface PricingPlan {
  name: string;
  price: string;
  subtitle: string;
  highlights: string[];
  cta: string;
  featured?: boolean;
}

export interface PricingSectionProps {
  id?: string;
  title: string;
  description: string;
  plans: PricingPlan[];
}

export function PricingSection({
  id = "pricing",
  title,
  description,
  plans,
}: PricingSectionProps) {
  return (
    <section id={id} className="sa-pricingSection" aria-labelledby="sa-pricing-title">
      <div className="sa-section-inner">
        <header className="sa-section-header--centered">
          <p className="sa-kicker">Pricing</p>
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
                <p className="sa-pricingSection__badge">Most Popular</p>
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
              <a
                className={plan.featured ? "sa-btn sa-btn--primary" : "sa-btn sa-btn--ghost"}
                href="#contact"
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
