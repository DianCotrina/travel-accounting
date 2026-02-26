import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import "./SignInModal.css";

type Provider = "google" | "phone" | "icloud" | "passkey";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

interface ProviderButton {
  id: Provider;
  label: string;
  icon: ReactNode;
}

const PROVIDERS: ProviderButton[] = [
  {
    id: "google",
    label: "Gmail",
    icon: <span className="sa-signInModal__providerBadge sa-signInModal__providerBadge--google">G</span>,
  },
  {
    id: "phone",
    label: "Phone",
    icon: <Phone className="sa-signInModal__providerIcon" />,
  },
  {
    id: "icloud",
    label: "iCloud",
    icon: <span className="sa-signInModal__providerBadge sa-signInModal__providerBadge--icloud"></span>,
  },
  {
    id: "passkey",
    label: "Passkey",
    icon: <KeyRound className="sa-signInModal__providerIcon" />,
  },
];

export function SignInModal({ open, onClose }: SignInModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => emailInputRef.current?.focus(), 20);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="sa-signInModal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className="sa-signInModal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          type="button"
          className="sa-signInModal__close"
          aria-label="Close sign in dialog"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="sa-signInModal__header">
          <p className="sa-kicker">Secure sign in</p>
          <h2 id={titleId}>Sign in to Sacatucuenta</h2>
          <p id={descriptionId}>
            Access your travel expense records, exchange-rate visibility, and finance-ready exports.
          </p>
        </div>

        <div className="sa-signInModal__social">
          <LabelRow title="Continue with" />
          <div className="sa-signInModal__providerGrid" role="group" aria-label="Sign-in providers">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                type="button"
                className={cn(
                  "sa-signInModal__providerButton",
                  selectedProvider === provider.id && "is-selected",
                )}
                onClick={() => setSelectedProvider(provider.id)}
              >
                {provider.icon}
                <span>{provider.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sa-signInModal__divider" aria-hidden="true">
          <span />
          <small>or use email</small>
          <span />
        </div>

        <form
          className="sa-signInModal__form"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="sa-signInModal__field">
            <label htmlFor="sa-signin-email">Email</label>
            <div className="sa-signInModal__inputWrap">
              <Mail className="sa-signInModal__inputIcon" aria-hidden="true" />
              <input
                ref={emailInputRef}
                id="sa-signin-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="you@company.com…"
                required
              />
            </div>
          </div>

          <div className="sa-signInModal__field">
            <div className="sa-signInModal__fieldRow">
              <label htmlFor="sa-signin-password">Password</label>
              <a href="#faq">Forgot Password?</a>
            </div>
            <div className="sa-signInModal__inputWrap">
              <KeyRound className="sa-signInModal__inputIcon" aria-hidden="true" />
              <input
                id="sa-signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password…"
                required
              />
              <button
                type="button"
                className="sa-signInModal__toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="sa-signInModal__submit">
            Sign In
            <ArrowRight aria-hidden="true" />
          </button>
        </form>

        <div className="sa-signInModal__footer">
          <button type="button" className="sa-signInModal__magicLink">
            <Sparkles aria-hidden="true" />
            Email me a sign-in link
          </button>
          <p>
            <ShieldCheck aria-hidden="true" />
            Protected access for travel accounting records. By continuing, you agree to Terms & Privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

function LabelRow({ title }: { title: string }) {
  return <p className="sa-signInModal__labelRow">{title}</p>;
}
