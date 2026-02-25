import { useMemo, useState } from "react";

type LandingLoginSectionProps = {
  onGoToWorkspace?: () => void;
};

type LoginMethod = "gmail" | "phone" | "icloud" | "passkey";

type MethodOption = {
  id: LoginMethod;
  label: string;
  helper: string;
  cta: string;
};

const methodOptions: MethodOption[] = [
  {
    id: "gmail",
    label: "Gmail",
    helper: "Use your Google account email to continue.",
    cta: "Continue with Gmail",
  },
  {
    id: "phone",
    label: "Phone number",
    helper: "Send a one-time code to your number.",
    cta: "Continue with phone number",
  },
  {
    id: "icloud",
    label: "iCloud",
    helper: "Sign in with Apple / iCloud identity.",
    cta: "Continue with iCloud",
  },
  {
    id: "passkey",
    label: "Passkey",
    helper: "Use a device passkey for faster, passwordless access.",
    cta: "Continue with passkey",
  },
];

export function LandingLoginSection({
  onGoToWorkspace,
}: LandingLoginSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>("gmail");
  const [identifier, setIdentifier] = useState("");

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
      return "+1 555 123 4567";
    }
    if (method === "passkey") {
      return "name@example.com";
    }
    if (method === "icloud") {
      return "name@icloud.com";
    }

    return "name@gmail.com";
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
              aria-selected={selectedMethod === option.id}
              className={
                selectedMethod === option.id
                  ? "login-method-pill login-method-pill--active"
                  : "login-method-pill"
              }
              onClick={() => setSelectedMethod(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form
          className="landing-login-card__form"
          onSubmit={(event) => {
            event.preventDefault();
            onGoToWorkspace?.();
          }}
        >
          <div className="landing-login-card__header">
            <p>{selectedOption.label}</p>
            <span>{selectedOption.helper}</span>
          </div>

          <label className="landing-login-card__label">
            {getIdentifierLabel(selectedMethod)}
            <input
              type={selectedMethod === "phone" ? "tel" : "email"}
              value={identifier}
              placeholder={getIdentifierPlaceholder(selectedMethod)}
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

          <p className="landing-login-card__hint">
            UI preview only: final auth flow will be connected to backend auth
            in a later phase.
          </p>
        </form>
      </div>
    </section>
  );
}
