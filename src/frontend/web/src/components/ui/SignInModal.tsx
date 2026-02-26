import { useRef, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
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
    icon: <span className="sa-signInModal__providerBadge sa-signInModal__providerBadge--icloud">A</span>,
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
          <span aria-hidden="true">×</span>
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
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
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
                placeholder="you@company.com…"
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
                placeholder="Enter your password…"
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
