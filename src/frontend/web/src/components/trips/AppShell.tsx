import { LogOut } from "lucide-react";
import { Link, Outlet } from "react-router";
import { useAuth } from "@/app/AuthContext";
import { useBackendStatus } from "@/app/backendStatus";
import { useI18n } from "@/app/i18n";
import { LanguageSwitch } from "@/app/i18n/LanguageSwitch";

/** Authenticated app frame: brand, identity, and API reachability. */
export function AppShell() {
  const { user, logout } = useAuth();
  const { status, recheck } = useBackendStatus();
  const { t } = useI18n();

  return (
    <div className="sa-app">
      <header className="sa-app__topbar">
        <Link to="/trips" className="sa-app__brand">
          <img src="/sacatucuenta-logo.png" alt="" width={28} height={28} className="sa-app__logo" />
          {t.common.brand}
        </Link>
        <div className="sa-app__user">
          <span className="sa-app__email" title={user?.email}>
            {user?.email}
          </span>
          <LanguageSwitch />
          <button type="button" className="sa-btn-secondary sa-btn-secondary--sm" onClick={logout}>
            <LogOut aria-hidden="true" />
            {t.shell.logout}
          </button>
        </div>
      </header>

      {status === "offline" && (
        <div className="sa-app__banner" role="alert">
          <span>{t.shell.offline}</span>
          <button type="button" className="sa-app__bannerAction" onClick={recheck}>
            {t.common.tryAgain}
          </button>
        </div>
      )}

      <main className="sa-app__content">
        <Outlet />
      </main>
    </div>
  );
}
