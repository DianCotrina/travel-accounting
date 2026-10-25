import "./FinalCtaSection.css";

export interface FinalCtaSectionProps {
  id?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
}

export function FinalCtaSection({
  id = "contact",
  title,
  description,
  primaryCta,
}: FinalCtaSectionProps) {
  return (
    <section id={id} className="sa-finalCta" aria-labelledby="sa-finalCta-title">
      <div className="sa-section-inner">
        <div className="sa-finalCta__band">
          <div className="sa-finalCta__glow" aria-hidden="true" />
          <div className="sa-finalCta__content">
            <h2 id="sa-finalCta-title">{title}</h2>
            <p>{description}</p>
            <div className="sa-finalCta__actions">
              <a className="sa-btn sa-btn--primary sa-btn--lg" href={primaryCta.href}>
                {primaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="sa-footer" aria-label="Site footer">
        <div className="sa-footer__inner">
          <div className="sa-footer__brand">
            <div className="sa-footer__brandRow">
              <img src="/sacatucuenta-logo.png" alt="" width={32} height={32} />
              <span>Sacatucuenta</span>
            </div>
            <p>Travel accounting made practical.</p>
          </div>
          <nav className="sa-footer__columns" aria-label="Footer navigation">
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div>
              <h4>Resources</h4>
              <a href="#testimonials">Testimonials</a>
              <a href="#faq">FAQ</a>
              <a href="mailto:hello@sacatucuenta.com">Contact</a>
            </div>
          </nav>
        </div>
        <div className="sa-footer__bottom">
          <p>&copy; 2026 Sacatucuenta. All rights reserved.</p>
        </div>
      </footer>
    </section>
  );
}
