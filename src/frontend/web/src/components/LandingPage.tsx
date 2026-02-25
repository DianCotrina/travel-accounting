import "./LandingPage.css";

type LandingPageProps = {
  onGoToWorkspace?: () => void;
};

export function LandingPage({ onGoToWorkspace }: LandingPageProps) {
  return (
    <section className="landing-reset" aria-labelledby="landing-reset-title">
      <div className="landing-reset__panel">
        <img
          src="/sacatucuenta-logo.png"
          alt="Sacatucuenta logo"
          className="landing-reset__logo"
          width={768}
          height={768}
          fetchPriority="high"
        />

        <p className="landing-reset__eyebrow">Landing Page Reset</p>
        <h1 id="landing-reset-title">New Landing Page Coming Soon</h1>
        <p className="landing-reset__copy">
          The previous landing page was removed so we can design a new version
          from scratch with a cleaner direction.
        </p>

        <div className="landing-reset__actions">
          <button
            type="button"
            className="landing-reset__button"
            onClick={() => onGoToWorkspace?.()}
          >
            Start Redesign
          </button>
        </div>
      </div>
    </section>
  );
}
