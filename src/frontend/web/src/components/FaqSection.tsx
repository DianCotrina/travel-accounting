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
  return (
    <section id={id} className="sa-faqSection" aria-labelledby="sa-faq-title">
      <div className="sa-faqSection__shell">
        <header className="sa-faqSection__header">
          <p className="sa-kicker">Frequently asked questions</p>
          <h2 id="sa-faq-title">{title}</h2>
          <p>{description}</p>
        </header>

        <div className="sa-faqSection__list">
          {items.map((item) => (
            <details key={item.question} className="sa-faqSection__item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

