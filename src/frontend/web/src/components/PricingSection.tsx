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
  const featuredPlan = plans.find((plan) => plan.featured) ?? plans[1] ?? plans[0];
  const sidePlans = plans.filter((plan) => plan.name !== featuredPlan.name);

  return (
    <section id={id} className="sa-pricingSection" aria-labelledby="sa-pricing-title">
      <div className="sa-pricingSection__frame">
        <div className="sa-pricingSection__intro">
          <div>
            <p className="sa-kicker">Choose your plan</p>
            <h2 id="sa-pricing-title">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="sa-pricingSection__rail">
            <div>
              <span>Best for</span>
              <strong>Travelers needing fast reimbursement-ready records</strong>
            </div>
            <div>
              <span>Scales to</span>
              <strong>Finance teams coordinating recurring travel workflows</strong>
            </div>
          </div>
        </div>

        <div className="sa-pricingSection__layout">
          <div className="sa-pricingSection__side">
            {sidePlans.slice(0, 1).map((plan) => (
              <article key={plan.name} className="sa-pricingSection__card sa-pricingSection__card--side">
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
                <a className="sa-btn sa-btn--ghost" href="#contact">
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>

          <article className="sa-pricingSection__card sa-pricingSection__card--featured">
            <p className="sa-pricingSection__badge">Most selected for active travel</p>
            <p className="sa-pricingSection__name">{featuredPlan.name}</p>
            <div className="sa-pricingSection__price">
              <strong>{featuredPlan.price}</strong>
              <span>{featuredPlan.subtitle}</span>
            </div>
            <ul>
              {featuredPlan.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a className="sa-btn sa-btn--primary" href="#contact">
              {featuredPlan.cta}
            </a>
          </article>

          <div className="sa-pricingSection__side">
            {sidePlans.slice(1).map((plan) => (
              <article key={plan.name} className="sa-pricingSection__card sa-pricingSection__card--side">
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
                <a className="sa-btn sa-btn--ghost" href="#contact">
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

