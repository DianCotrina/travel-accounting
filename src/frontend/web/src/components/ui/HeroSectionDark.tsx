import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import "./HeroSectionDark.css";

interface HeroStatItem {
  label: string;
  value: string;
}

interface HeroSectionDarkProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: {
    regular: string;
    gradient: string;
  };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  bottomImage?: {
    light: string;
    dark: string;
  };
  stats?: HeroStatItem[];
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
  title = "Travel Accounting Platform",
  subtitle = {
    regular: "Track foreign travel expenses without losing ",
    gradient: "accounting clarity.",
  },
  description = "Log local-currency travel spending, monitor home-currency impact, and export clean summaries for reimbursement and bookkeeping.",
  ctaText = "Start Free Trial",
  ctaHref = "#pricing",
  secondaryCtaText = "Explore Features",
  secondaryCtaHref = "#features",
  bottomImage,
  stats,
  bottomSlot,
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
        <a className="sa-heroDark__pill" href={ctaHref}>
          <span>{title}</span>
          <ChevronRight className="sa-heroDark__pillIcon" aria-hidden="true" />
        </a>

        <h1 id="sa-hero-title" className="sa-heroDark__title">
          {subtitle.regular}
          <span className="sa-heroDark__titleAccent">{subtitle.gradient}</span>
        </h1>

        <p className="sa-heroDark__description">{description}</p>

        <div className="sa-heroDark__actions">
          <a className="sa-btn sa-btn--primary" href={ctaHref}>
            {ctaText}
          </a>
          <a className="sa-btn sa-btn--ghost" href={secondaryCtaHref}>
            {secondaryCtaText}
          </a>
        </div>

        {stats && stats.length > 0 ? (
          <ul className="sa-heroDark__stats" aria-label="Usage metrics">
            {stats.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        ) : null}

        {bottomSlot ? <div className="sa-heroDark__bottom">{bottomSlot}</div> : null}

        {!bottomSlot && bottomImage ? (
          <div className="sa-heroDark__bottom">
            <img
              src={bottomImage.dark}
              alt="Dashboard preview"
              className="sa-heroDark__image sa-heroDark__image--dark"
              loading="eager"
              width={1400}
              height={840}
            />
            <img
              src={bottomImage.light}
              alt="Dashboard preview"
              className="sa-heroDark__image sa-heroDark__image--light"
              loading="eager"
              width={1400}
              height={840}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

