import type { ReactNode } from "react";
import "./BenefitsSection.css";

export interface BenefitsSectionCard {
  title: string;
  body: string;
}

export interface BenefitsSectionProps {
  id?: string;
  title: string;
  description: string;
  proofPoints: string[];
  cards: BenefitsSectionCard[];
  workflow: ReactNode;
}

export function BenefitsSection({
  id = "features",
  title,
  description,
  proofPoints,
  cards,
  workflow,
}: BenefitsSectionProps) {
  return (
    <section id={id} className="sa-benefits" aria-labelledby="sa-benefits-title">
      <div className="sa-benefits__hero">
        <div className="sa-benefits__intro">
          <p className="sa-kicker">Accounting-ready by design</p>
          <h2 id="sa-benefits-title">{title}</h2>
          <p className="sa-benefits__copy">{description}</p>
          <ul className="sa-benefits__proof">
            {proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="sa-benefits__cards" aria-label="Core product benefits">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={index === 0 ? "sa-benefits__card sa-benefits__card--featured" : "sa-benefits__card"}
            >
              <p className="sa-benefits__cardIndex">{String(index + 1).padStart(2, "0")}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="sa-benefits__workflowFrame">{workflow}</div>
    </section>
  );
}

