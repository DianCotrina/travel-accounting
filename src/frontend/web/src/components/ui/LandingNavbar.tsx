import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/i18n";
import { LanguageSwitch } from "@/app/i18n/LanguageSwitch";
import "./LandingNavbar.css";

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

export function LandingNavbar({ onTryPreview }: { onTryPreview: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileId = useMemo(() => "sa-mobile-nav", []);
  const { t } = useI18n();
  const menu = [
    { title: t.nav.features, url: "#features" },
    { title: t.nav.howItWorks, url: "#how-it-works" },
    { title: t.nav.pricing, url: "#pricing" },
    { title: t.nav.faq, url: "#faq" },
  ];

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
      aria-label={t.nav.siteHeader}
    >
      <a className="sa-nav__brand" href="#top" aria-label={t.nav.brandHome}>
        <img
          src="/sacatucuenta-logo.png"
          alt=""
          width={768}
          height={768}
          loading="eager"
        />
        <span>{t.common.brand}</span>
      </a>

      <nav className="sa-nav__desktop" aria-label={t.nav.primary}>
        {menu.map((item) => (
          <a key={item.title} className="sa-nav__link" href={item.url}>
            {item.title}
          </a>
        ))}
      </nav>

      <div className="sa-nav__actions">
        <LanguageSwitch />
        <button type="button" className="sa-nav__cta" onClick={onTryPreview}>
          {t.common.tryPreview}
        </button>
        <button
          type="button"
          className="sa-nav__mobileTrigger"
          aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
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
        <div className="sa-mobileNav__panel" role="dialog" aria-label={t.nav.mobileMenu}>
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

        </div>
      </div>
    </header>
  );
}
