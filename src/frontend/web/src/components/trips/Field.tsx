import { cloneElement, isValidElement, useId } from "react";
import type { ReactElement } from "react";

type ControlProps = { id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean };

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactElement<ControlProps>;
};

/** Visible label + optional hint/error wired to the control for screen readers. Never placeholder-only. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, { id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })
    : children;

  return (
    <div className="sa-field">
      <label htmlFor={id} className="sa-field__label">
        {label}
      </label>
      {control}
      {hint && (
        <p id={hintId} className="sa-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="sa-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
