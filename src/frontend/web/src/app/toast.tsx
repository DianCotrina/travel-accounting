import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

export type ToastTone = "success" | "error" | "info";
export type ToastAction = { label: string; onAction: () => void };
type Toast = { id: number; tone: ToastTone; message: string; action?: ToastAction };

type ToastContextValue = {
  notify: (message: string, options?: { tone?: ToastTone; action?: ToastAction; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 5000;

/** Announces outcomes politely (errors assertively) and supports a single inline action such as Undo. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const notify = useCallback<ToastContextValue["notify"]>(
    (message, options) => {
      const id = nextId.current++;
      setToasts((all) => [...all.slice(-2), { id, message, tone: options?.tone ?? "success", action: options?.action }]);
      window.setTimeout(() => dismiss(id), options?.durationMs ?? DEFAULT_DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="sa-toasts" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div key={toast.id} className={`sa-toast sa-toast--${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}>
            <span>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                className="sa-toast__action"
                onClick={() => {
                  toast.action?.onAction();
                  dismiss(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
