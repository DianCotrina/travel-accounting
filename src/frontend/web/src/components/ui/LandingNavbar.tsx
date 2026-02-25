import { useEffect, useMemo, useRef, useState } from "react";
import "./LandingNavbar.css";

type NavLeafItem = {
  title: string;
  url: string;
  description?: string;
};

type NavMenuItem = NavLeafItem & {
  items?: NavLeafItem[];
};

const productItems: NavLeafItem[] = [
  {
    title: "Trip Logging",
    url: "#features",
    description: "Capture local-currency expenses by category and subcategory.",
  },
  {
    title: "Ledger Summary",
    url: "#features",
    description: "Review totals by day and category before reimbursement.",
  },
  {
    title: "CSV Export",
    url: "#pricing",
    description: "Export finance-ready summaries for bookkeeping and review.",
  },
  {
    title: "Exchange Rates",
    url: "#faq",
    description: "Track home-equivalent visibility for international trips.",
  },
];

const resourceItems: NavLeafItem[] = [
  {
    title: "Testimonials",
    url: "#testimonials",
    description: "How travelers and operators use Sacatucuenta today.",
  },
  {
    title: "FAQ",
    url: "#faq",
    description: "Answers for travel accounting and finance workflows.",
  },
  {
    title: "Contact",
    url: "#contact",
    description: "Talk to us about early access and onboarding.",
  },
];

const menu: NavMenuItem[] = [
  { title: "Features", url: "#features", items: productItems },
  { title: "Resources", url: "#faq", items: resourceItems },
  { title: "Pricing", url: "#pricing" },
  { title: "Testimonials", url: "#testimonials" },
];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4 6.25 8 10l4-3.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

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

function DropdownMenu({
  item,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavMenuItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearTimer();
    timeoutRef.current = window.setTimeout(onClose, 120);
  };

  useEffect(() => clearTimer, []);

  return (
    <div
      className="sa-navmenu"
      onMouseEnter={() => {
        clearTimer();
        onOpen();
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="sa-navmenu__trigger"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        <span>{item.title}</span>
        <ChevronIcon />
      </button>

      {isOpen ? (
        <div className="sa-navmenu__panel" role="menu" aria-label={`${item.title} menu`}>
          <ul className="sa-navmenu__grid">
            {(item.items ?? []).map((subItem) => (
              <li key={subItem.title}>
                <a className="sa-navmenu__item" href={subItem.url} role="menuitem" onClick={onClose}>
                  <span className="sa-navmenu__itemTitle">{subItem.title}</span>
                  {subItem.description ? (
                    <span className="sa-navmenu__itemDesc">{subItem.description}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function LandingNavbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileId = useMemo(() => "sa-mobile-nav", []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sa-nav" aria-label="Site header">
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
        {menu.map((item) =>
          item.items ? (
            <DropdownMenu
              key={item.title}
              item={item}
              isOpen={openDropdown === item.title}
              onOpen={() => setOpenDropdown(item.title)}
              onClose={() => setOpenDropdown((current) => (current === item.title ? null : current))}
            />
          ) : (
            <a key={item.title} className="sa-nav__link" href={item.url}>
              {item.title}
            </a>
          ),
        )}
      </nav>

      <div className="sa-nav__actions">
        <a className="sa-nav__login" href="#contact">
          Log In
        </a>
        <a className="sa-nav__cta" href="#contact">
          Get Early Access
        </a>
        <button
          type="button"
          className="sa-nav__mobileTrigger"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className={mobileOpen ? "sa-mobileNav sa-mobileNav--open" : "sa-mobileNav"} id={mobileId}>
        <div className="sa-mobileNav__panel" role="dialog" aria-label="Mobile navigation">
          <div className="sa-mobileNav__section">
            {menu.map((item) =>
              item.items ? (
                <details key={item.title} className="sa-mobileNav__details">
                  <summary>{item.title}</summary>
                  <ul>
                    {item.items.map((subItem) => (
                      <li key={subItem.title}>
                        <a href={subItem.url} onClick={() => setMobileOpen(false)}>
                          <span>{subItem.title}</span>
                          {subItem.description ? <small>{subItem.description}</small> : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a
                  key={item.title}
                  className="sa-mobileNav__link"
                  href={item.url}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </a>
              ),
            )}
          </div>

          <div className="sa-mobileNav__footer">
            <a className="sa-nav__login" href="#contact" onClick={() => setMobileOpen(false)}>
              Log In
            </a>
            <a className="sa-nav__cta" href="#contact" onClick={() => setMobileOpen(false)}>
              Get Early Access
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

