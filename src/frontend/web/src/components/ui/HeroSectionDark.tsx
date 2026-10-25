import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import "./HeroSectionDark.css";

interface HeroSectionDarkProps extends HTMLAttributes<HTMLDivElement> {
  subtitle: {
    regular: string;
    gradient: string;
  };
  description: string;
  ctaText: string;
  onCtaClick: () => void;
  secondaryCtaText: string;
  secondaryCtaHref?: string;
  bottomSlot?: ReactNode;
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
  subtitle,
  description,
  ctaText,
  onCtaClick,
  secondaryCtaText,
  secondaryCtaHref = "#how-it-works",
  bottomSlot,
  gridOptions,
  ...props
}: HeroSectionDarkProps) {
  const gridStyles = {
    "--sa-hero-grid-angle": `${gridOptions?.angle ?? 66}deg`,
    "--sa-hero-grid-size": `${gridOptions?.cellSize ?? 56}px`,
    "--sa-hero-grid-opacity": `${gridOptions?.opacity ?? 0.22}`,
    "--sa-hero-grid-line": gridOptions?.lineColor ?? "color-mix(in oklab, var(--copper) 7%, transparent)",
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
          <button type="button" className="sa-btn sa-btn--primary sa-btn--lg" onClick={onCtaClick}>
            {ctaText}
          </button>
          <a className="sa-btn sa-btn--ghost sa-btn--lg" href={secondaryCtaHref}>
            {secondaryCtaText}
          </a>
        </div>

        {bottomSlot ? (
          <div className="sa-heroDark__bottom">{bottomSlot}</div>
        ) : null}
      </div>
    </section>
  );
}
