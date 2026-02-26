import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import "./HeroSectionDark.css";

interface HeroSectionDarkProps extends HTMLAttributes<HTMLDivElement> {
  subtitle?: {
    regular: string;
    gradient: string;
  };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  bottomSlot?: ReactNode;
  trustedBy?: string[];
  gridOptions?: {
    angle?: number;
    cellSize?: number;
    opacity?: number;
    lineColor?: string;
  };
}

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function HeroSectionDark({
  className,
  subtitle = {
    regular: "Track foreign travel expenses without losing ",
    gradient: "accounting clarity.",
  },
  description = "Log local-currency travel spending, monitor home-currency impact, and export clean summaries for reimbursement and bookkeeping.",
  ctaText = "Start Free Trial",
  ctaHref = "#pricing",
  secondaryCtaText = "See How It Works",
  secondaryCtaHref = "#how-it-works",
  bottomSlot,
  trustedBy,
  gridOptions,
  ...props
}: HeroSectionDarkProps) {
  const gridStyles = {
    "--sa-hero-grid-angle": `${gridOptions?.angle ?? 66}deg`,
    "--sa-hero-grid-size": `${gridOptions?.cellSize ?? 56}px`,
    "--sa-hero-grid-opacity": `${gridOptions?.opacity ?? 0.22}`,
    "--sa-hero-grid-line": gridOptions?.lineColor ?? "#ff6a1c12",
  } as CSSProperties;

  return (
    <section
      className={classNames("sa-heroDark", className)}
      aria-labelledby="sa-hero-title"
      style={gridStyles}
      {...props}
    >
      <div className="sa-heroDark__ambient" aria-hidden="true" />
      <div className="sa-heroDark__gridWrap" aria-hidden="true">
        <div className="sa-heroDark__gridPlane" />
        <div className="sa-heroDark__gridFade" />
      </div>

      <div className="sa-heroDark__inner">
        <h1 id="sa-hero-title" className="sa-heroDark__title">
          {subtitle.regular}
          <span className="sa-heroDark__titleAccent">{subtitle.gradient}</span>
        </h1>

        <p className="sa-heroDark__description">{description}</p>

        <div className="sa-heroDark__actions">
          <a className="sa-btn sa-btn--primary sa-btn--lg" href={ctaHref}>
            {ctaText}
          </a>
          <a className="sa-btn sa-btn--ghost sa-btn--lg" href={secondaryCtaHref}>
            {secondaryCtaText}
          </a>
        </div>

        {bottomSlot ? (
          <div className="sa-heroDark__bottom">{bottomSlot}</div>
        ) : null}

        {trustedBy && trustedBy.length > 0 ? (
          <div className="sa-heroDark__trustedBy">
            <p>Trusted by teams at</p>
            <div className="sa-heroDark__logos">
              {trustedBy.map((name) => (
                <span key={name} className="sa-heroDark__logoPlaceholder">
                  {name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
