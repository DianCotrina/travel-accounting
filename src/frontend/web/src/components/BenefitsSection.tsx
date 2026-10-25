import "./BenefitsSection.css";

export interface BenefitsSectionCard {
  title: string;
  body: string;
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
          <h2 id="sa-benefits-title">{title}</h2>
          <p>{description}</p>
        </header>

        <div className="sa-benefits__grid" aria-label="Core product benefits">
          {cards.map((card) => (
            <article key={card.title} className="sa-benefits__card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
