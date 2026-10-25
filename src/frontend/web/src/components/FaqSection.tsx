import "./FaqSection.css";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  id?: string;
  title: string;
  description: string;
  items: FaqItem[];
}

export function FaqSection({
  id = "faq",
  title,
  description,
  items,
}: FaqSectionProps) {
  const midpoint = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, midpoint);
  const rightColumn = items.slice(midpoint);

  return (
    <section id={id} className="sa-faqSection" aria-labelledby="sa-faq-title">
      <div className="sa-section-inner">
        <header className="sa-section-header--centered">
          <p className="sa-kicker">FAQ</p>
          <h2 id="sa-faq-title">{title}</h2>
          <p>{description}</p>
        </header>

        <div className="sa-faqSection__columns">
          <div className="sa-faqSection__column">
            {leftColumn.map((item) => (
              <details key={item.question} className="sa-faqSection__item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="sa-faqSection__column">
            {rightColumn.map((item) => (
              <details key={item.question} className="sa-faqSection__item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
