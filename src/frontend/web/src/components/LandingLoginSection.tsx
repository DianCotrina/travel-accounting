import { useMemo, useState } from "react";
import "./LandingLoginSection.css";

type LandingLoginSectionProps = {
  onGoToWorkspace?: () => void;
};

type LoginMethod = "gmail" | "phone" | "icloud" | "passkey";

type MethodOption = {
  id: LoginMethod;
  label: string;
  helper: string;
  cta: string;
  iconLabel: string;
};

const methodOptions: MethodOption[] = [
  {
    id: "gmail",
    label: "Gmail",
    helper: "Use your Google account email to continue.",
    cta: "Continue with Gmail",
    iconLabel: "G",
  },
  {
    id: "phone",
    label: "Phone number",
    helper: "Send a one-time code to your number.",
    cta: "Continue with phone number",
    iconLabel: "\u260E",
  },
  {
    id: "icloud",
    label: "iCloud",
    helper: "Sign in with Apple / iCloud identity.",
    cta: "Continue with iCloud",
    iconLabel: "\u2301",
  },
  {
    id: "passkey",
    label: "Passkey",
    helper: "Use a device passkey for faster, passwordless access.",
    cta: "Continue with passkey",
    iconLabel: "\u2318",
  },
];

export function LandingLoginSection({
  onGoToWorkspace,
}: LandingLoginSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>("gmail");
  const [identifier, setIdentifier] = useState("");
  const panelId = `login-panel-${selectedMethod}`;

  const selectedOption = useMemo(
    () =>
      methodOptions.find((option) => option.id === selectedMethod) ??
      methodOptions[0],
    [selectedMethod],
  );

  function getIdentifierLabel(method: LoginMethod): string {
    if (method === "phone") {
      return "Phone number";
    }
    if (method === "passkey") {
      return "Account email (optional)";
    }
    if (method === "icloud") {
      return "Apple ID / iCloud email";
    }

    return "Gmail address";
  }

  function getIdentifierPlaceholder(method: LoginMethod): string {
    if (method === "phone") {
      return "+1 555 123 4567\u2026";
    }
    if (method === "passkey") {
      return "name@example.com\u2026";
    }
    if (method === "icloud") {
      return "name@icloud.com\u2026";
    }

    return "name@gmail.com\u2026";
  }

  function getAutocomplete(method: LoginMethod): string {
    return method === "phone" ? "tel" : "email";
  }

  function getInputMode(method: LoginMethod): "tel" | "email" {
    return method === "phone" ? "tel" : "email";
  }

  return (
    <section
      id="login-options"
      className="landing-login"
      aria-labelledby="landing-login-title"
    >
      <div className="landing-login__copy">
        <p className="eyebrow">Sign in options</p>
        <h2 id="landing-login-title">
          Start with the login method that works best for you
        </h2>
        <p>
          Landing-page login entry point (UI preview). We can connect this to
          the real authentication backend later without redesigning the screen.
        </p>

        <ul className="landing-login__benefits">
          <li>Gmail account sign-in</li>
          <li>Phone number code login</li>
          <li>iCloud account access</li>
          <li>Passkey-ready passwordless flow</li>
        </ul>
      </div>

      <div className="landing-login-card">
        <div
          className="landing-login-card__methods"
          role="tablist"
          aria-label="Login methods"
        >
          {methodOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              id={`login-tab-${option.id}`}
              aria-selected={selectedMethod === option.id}
              aria-controls={`login-panel-${option.id}`}
              className={
                selectedMethod === option.id
                  ? "login-method-pill login-method-pill--active"
                  : "login-method-pill"
              }
              onClick={() => setSelectedMethod(option.id)}
            >
              <span
                className={`login-method-pill__icon login-method-pill__icon--${option.id}`}
                aria-hidden="true"
              >
                {option.iconLabel}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <form
          className="landing-login-card__form"
          role="tabpanel"
          id={panelId}
          aria-labelledby={`login-tab-${selectedMethod}`}
          onSubmit={(event) => {
            event.preventDefault();
            onGoToWorkspace?.();
          }}
        >
          <div className="landing-login-card__header" aria-live="polite">
            <p>{selectedOption.label}</p>
            <span>{selectedOption.helper}</span>
          </div>

          <label className="landing-login-card__label">
            {getIdentifierLabel(selectedMethod)}
            <input
              type={selectedMethod === "phone" ? "tel" : "email"}
              name={selectedMethod === "phone" ? "phone" : "email"}
              value={identifier}
              placeholder={getIdentifierPlaceholder(selectedMethod)}
              autoComplete={getAutocomplete(selectedMethod)}
              inputMode={getInputMode(selectedMethod)}
              spellCheck={false}
              autoCapitalize="none"
              aria-describedby="landing-login-hint"
              onChange={(event) => setIdentifier(event.target.value)}
            />
          </label>

          {selectedMethod === "passkey" ? (
            <button type="submit" className="landing-login-card__cta">
              Use passkey on this device
            </button>
          ) : (
            <button type="submit" className="landing-login-card__cta">
              {selectedOption.cta}
            </button>
          )}

          <p id="landing-login-hint" className="landing-login-card__hint">
            UI preview only: final auth flow will be connected to backend auth
            in a later phase.
          </p>
        </form>
      </div>
    </section>
  );
}
