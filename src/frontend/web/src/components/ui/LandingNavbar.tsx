import { useEffect, useMemo, useState } from "react";
import "./LandingNavbar.css";

type NavItem = {
  title: string;
  url: string;
};

const menu: NavItem[] = [
  { title: "Features", url: "#features" },
  { title: "How It Works", url: "#how-it-works" },
  { title: "Pricing", url: "#pricing" },
  { title: "Testimonials", url: "#testimonials" },
  { title: "FAQ", url: "#faq" },
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M3 5.5h14M3 10h14M3 14.5h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M5 5l10 10M15 5 5 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LandingNavbar({ onLoginClick }: { onLoginClick?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileId = useMemo(() => "sa-mobile-nav", []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`sa-nav${scrolled ? " sa-nav--scrolled" : ""}`}
      aria-label="Site header"
    >
      <a className="sa-nav__brand" href="#top">
        <img
          src="/sacatucuenta-logo.png"
          alt="Sacatucuenta logo"
          width={768}
          height={768}
          loading="eager"
        />
        <span>Sacatucuenta</span>
      </a>

      <nav className="sa-nav__desktop" aria-label="Primary navigation">
        {menu.map((item) => (
          <a key={item.title} className="sa-nav__link" href={item.url}>
            {item.title}
          </a>
        ))}
      </nav>

      <div className="sa-nav__actions">
        <button type="button" className="sa-nav__login" onClick={onLoginClick}>
          Log In
        </button>
        <a className="sa-nav__cta" href="#contact">
          Get Early Access
        </a>
        <button
          type="button"
          className="sa-nav__mobileTrigger"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={mobileOpen ? "sa-mobileNav sa-mobileNav--open" : "sa-mobileNav"}
        id={mobileId}
      >
        <div className="sa-mobileNav__panel" role="dialog" aria-label="Mobile navigation">
          <div className="sa-mobileNav__links">
            {menu.map((item) => (
              <a
                key={item.title}
                className="sa-mobileNav__link"
                href={item.url}
                onClick={() => setMobileOpen(false)}
              >
                {item.title}
              </a>
            ))}
          </div>

          <div className="sa-mobileNav__footer">
            <button
              type="button"
              className="sa-nav__login"
              onClick={() => {
                setMobileOpen(false);
                onLoginClick?.();
              }}
            >
              Log In
            </button>
            <a
              className="sa-nav__cta"
              href="#contact"
              onClick={() => setMobileOpen(false)}
            >
              Get Early Access
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
