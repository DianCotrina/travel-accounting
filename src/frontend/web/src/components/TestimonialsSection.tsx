import "./TestimonialsSection.css";

export interface TestimonialItem {
  role: string;
  quote: string;
  person: string;
  rating?: number;
}

export interface TestimonialsSectionProps {
  id?: string;
  title: string;
  description: string;
  items: TestimonialItem[];
}

function RatingStars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="sa-testimonialsSection__rating" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} aria-hidden="true" className={index < rating ? "is-on" : ""}>
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection({
  id = "testimonials",
  title,
  description,
  items,
}: TestimonialsSectionProps) {
  return (
    <section id={id} className="sa-testimonialsSection" aria-labelledby="sa-testimonials-title">
      <div className="sa-section-inner">
        <header className="sa-section-header--centered">
          <p className="sa-kicker">Testimonials</p>
          <h2 id="sa-testimonials-title">{title}</h2>
          <p>{description}</p>
        </header>

        <div className="sa-testimonialsSection__grid">
          {items.map((item) => (
            <blockquote key={item.person} className="sa-testimonialsSection__card">
              <RatingStars rating={item.rating} />
              <p>{item.quote}</p>
              <footer>
                <div className="sa-testimonialsSection__avatar" aria-hidden="true">
                  {item.person.charAt(0)}
                </div>
                <div>
                  <strong>{item.person}</strong>
                  <span>{item.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
