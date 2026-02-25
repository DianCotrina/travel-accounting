import "./TestimonialsSection.css";

export interface TestimonialItem {
  role: string;
  quote: string;
  person: string;
}

export interface TestimonialsSectionProps {
  id?: string;
  title: string;
  description: string;
  items: TestimonialItem[];
}

export function TestimonialsSection({
  id = "testimonials",
  title,
  description,
  items,
}: TestimonialsSectionProps) {
  const [featured, ...rest] = items;

  return (
    <section id={id} className="sa-testimonialsSection" aria-labelledby="sa-testimonials-title">
      <div className="sa-testimonialsSection__shell">
        <div className="sa-testimonialsSection__header">
          <div>
            <p className="sa-kicker">Loved by users</p>
            <h2 id="sa-testimonials-title">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="sa-testimonialsSection__stats" aria-label="Trust summary">
            <div>
              <strong>12,480+</strong>
              <span>Trips logged</span>
            </div>
            <div>
              <strong>1.8M</strong>
              <span>Expense entries</span>
            </div>
            <div>
              <strong>84</strong>
              <span>Countries tracked</span>
            </div>
          </div>
        </div>

        {featured ? (
          <blockquote className="sa-testimonialsSection__featured">
            <p className="sa-testimonialsSection__featuredQuote">“{featured.quote}”</p>
            <footer>
              <strong>{featured.person}</strong>
              <span>{featured.role}</span>
            </footer>
          </blockquote>
        ) : null}

        <div className="sa-testimonialsSection__grid">
          {rest.map((item) => (
            <blockquote key={item.person} className="sa-testimonialsSection__card">
              <p>“{item.quote}”</p>
              <footer>
                <strong>{item.person}</strong>
                <span>{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

