import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const GoogleIcon = () => (
  <svg className="sa-signInModal__providerIcon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg className="sa-signInModal__providerIcon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const PROVIDERS: ProviderButton[] = [
  {
    id: "google",
    label: "Gmail",
    icon: <GoogleIcon />,
  },
  {
    id: "phone",
    label: "Phone",
    icon: <Phone className="sa-signInModal__providerIcon" />,
  },
  {
    id: "icloud",
    label: "iCloud",
    icon: <AppleIcon />,
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
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const success = auth.login(email, password);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <DialogContent
        overlayClassName="sa-signInModal"
        showCloseButton={false}
        className="sa-signInModal__panel"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          emailInputRef.current?.focus();
        }}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="sa-signInModal__close"
          aria-label="Close sign in dialog"
          onClick={onClose}
        >
          <span aria-hidden="true">x</span>
        </Button>

        <DialogHeader className="sa-signInModal__header">
          <p className="sa-kicker">Secure sign in</p>
          <DialogTitle>Sign in to Sacatucuenta</DialogTitle>
          <DialogDescription>
            Access your travel expense records, exchange-rate visibility, and finance-ready exports.
          </DialogDescription>
        </DialogHeader>

        <div className="sa-signInModal__social">
          <LabelRow title="Continue with" />
          <div className="sa-signInModal__providerGrid" role="group" aria-label="Sign-in providers">
            {PROVIDERS.map((provider) => (
              <Button
                key={provider.id}
                type="button"
                variant="outline"
                className={cn(
                  "sa-signInModal__providerButton",
                  selectedProvider === provider.id && "is-selected",
                )}
                onClick={() => setSelectedProvider(provider.id)}
              >
                {provider.icon}
                <span>{provider.label}</span>
              </Button>
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
          onSubmit={handleSubmit}
        >
          {auth.error && (
            <div className="sa-signInModal__error" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{auth.error}</span>
            </div>
          )}
          <div className="sa-signInModal__field">
            <Label htmlFor="sa-signin-email">Email</Label>
            <div className="sa-signInModal__inputWrap">
              <Mail className="sa-signInModal__inputIcon" aria-hidden="true" />
              <Input
                ref={emailInputRef}
                id="sa-signin-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="you@company.com..."
                required
              />
            </div>
          </div>

          <div className="sa-signInModal__field">
            <div className="sa-signInModal__fieldRow">
              <Label htmlFor="sa-signin-password">Password</Label>
              <a href="#faq">Forgot Password?</a>
            </div>
            <div className="sa-signInModal__inputWrap">
              <KeyRound className="sa-signInModal__inputIcon" aria-hidden="true" />
              <Input
                id="sa-signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password..."
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="sa-signInModal__toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="sa-signInModal__submit">
            Sign In
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        <div className="sa-signInModal__footer">
          <Button type="button" variant="ghost" className="sa-signInModal__magicLink">
            <Sparkles aria-hidden="true" />
            Email me a sign-in link
          </Button>
          <p>
            <ShieldCheck aria-hidden="true" />
            Protected access for travel accounting records. By continuing, you agree to Terms & Privacy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LabelRow({ title }: { title: string }) {
  return <p className="sa-signInModal__labelRow">{title}</p>;
}

