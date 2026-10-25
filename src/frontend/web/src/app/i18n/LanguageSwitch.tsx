import { Languages } from "lucide-react";
import { useI18n } from "./index";
import "./LanguageSwitch.css";

/** Compact toggle to the other language; announces the target language in that language. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, t, setLocale } = useI18n();
  const next = locale === "es" ? "en" : "es";
  return (
    <button
      type="button"
      className={className ? `sa-langSwitch ${className}` : "sa-langSwitch"}
      lang={next}
      aria-label={t.locale.switchToLabel}
      onClick={() => setLocale(next)}
    >
      <Languages aria-hidden="true" />
      <span>{next.toUpperCase()}</span>
    </button>
  );
}
