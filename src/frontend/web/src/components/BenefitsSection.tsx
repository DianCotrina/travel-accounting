import type { ReactNode } from "react";
import "./BenefitsSection.css";

export interface BenefitsSectionCard {
  title: string;
  body: string;
  icon?: ReactNode;
}

export interface BenefitsSectionProps {
  id?: string;
  title: string;
  description: string;
  cards: BenefitsSectionCard[];
}

export function BenefitsSection({
  id = "features",
  title,
  description,
  cards,
}: BenefitsSectionProps) {
  return (
    <section id={id} className="sa-benefits" aria-labelledby="sa-benefits-title">
      <div className="sa-section-inner">
        <header className="sa-section-header--centered">
          <p className="sa-kicker">Features</p>
          <h2 id="sa-benefits-title">{title}</h2>
          <p>{description}</p>
        </header>

        <div className="sa-benefits__grid" aria-label="Core product benefits">
          {cards.map((card) => (
            <article key={card.title} className="sa-benefits__card">
              {card.icon ? (
                <div className="sa-benefits__cardIcon" aria-hidden="true">
                  {card.icon}
                </div>
              ) : null}
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
