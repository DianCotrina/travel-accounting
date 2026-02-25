import "./FinalCtaSection.css";

export interface FinalCtaSectionProps {
  id?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export function FinalCtaSection({
  id = "contact",
  title,
  description,
  primaryCta,
  secondaryCta,
}: FinalCtaSectionProps) {
  return (
    <section id={id} className="sa-finalCta" aria-labelledby="sa-finalCta-title">
      <div className="sa-finalCta__band">
        <div className="sa-finalCta__copy">
          <p className="sa-kicker">Ready to start</p>
          <h2 id="sa-finalCta-title">{title}</h2>
          <p>{description}</p>
          <div className="sa-finalCta__contactRow">
            <span>Email: hello@sacatucuenta.com</span>
            <span>Phone: +1 (555) 123-4567</span>
          </div>
        </div>

        <div className="sa-finalCta__actions">
          <a className="sa-btn sa-btn--primary" href={primaryCta.href}>
            {primaryCta.label}
          </a>
          <a className="sa-btn sa-btn--ghost" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        </div>
      </div>

      <footer className="sa-finalCta__footer" aria-label="Site footer">
        <div className="sa-finalCta__brand">
          <span>Sacatucuenta</span>
          <p>Travel accounting made practical for real trips and finance review.</p>
        </div>
        <nav className="sa-finalCta__nav" aria-label="Footer navigation">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
      </footer>
    </section>
  );
}

