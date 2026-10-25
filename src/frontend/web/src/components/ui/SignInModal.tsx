import { useRef, useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Info, KeyRound, Mail, X } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { useI18n } from "@/app/i18n";
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

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Preview access. Real accounts don't exist yet (PRD R-2), so the dialog says so plainly and only
 * offers what works: email + password into the preview. Other sign-in methods are named as coming
 * soon instead of rendering buttons that do nothing.
 */
export function SignInModal({ open, onClose }: SignInModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const { t } = useI18n();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const success = auth.login(String(data.get("email") ?? ""), String(data.get("password") ?? ""));
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
          aria-label={t.common.close}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </Button>

        <DialogHeader className="sa-signInModal__header">
          <DialogTitle>{t.signIn.title}</DialogTitle>
          <DialogDescription>{t.signIn.description}</DialogDescription>
        </DialogHeader>

        <p className="sa-signInModal__notice">
          <Info aria-hidden="true" />
          <span>{t.signIn.notice}</span>
        </p>

        <form className="sa-signInModal__form" onSubmit={handleSubmit}>
          {auth.error && (
            <div className="sa-signInModal__error" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{auth.error === "required" ? t.signIn.required : t.signIn.missingToken}</span>
            </div>
          )}
          <div className="sa-signInModal__field">
            <Label htmlFor="sa-signin-email">{t.signIn.email}</Label>
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
                placeholder={t.signIn.emailPlaceholder}
                required
              />
            </div>
          </div>

          <div className="sa-signInModal__field">
            <Label htmlFor="sa-signin-password">{t.signIn.password}</Label>
            <div className="sa-signInModal__inputWrap">
              <KeyRound className="sa-signInModal__inputIcon" aria-hidden="true" />
              <Input
                id="sa-signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="sa-signInModal__toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? t.signIn.hidePassword : t.signIn.showPassword}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="sa-signInModal__submit">
            {t.signIn.submit}
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
