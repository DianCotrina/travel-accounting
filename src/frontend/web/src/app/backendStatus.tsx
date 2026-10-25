import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { apiRoutes } from "./apiRoutes";

export type BackendStatus = "checking" | "online" | "offline";

type BackendStatusValue = { status: BackendStatus; recheck: () => void };

const BackendStatusContext = createContext<BackendStatusValue | null>(null);

/** Tracks API reachability so screens can disable writes with an explanation instead of failing silently. */
export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<BackendStatus>("checking");

  const probe = useCallback(() => {
    fetch(apiRoutes.health())
      .then((res) => setStatus(res.ok ? "online" : "offline"))
      .catch((error: unknown) => {
        console.warn("API health check failed.", error);
        setStatus("offline");
      });
  }, []);

  const recheck = useCallback(() => {
    setStatus("checking");
    probe();
  }, [probe]);

  useEffect(probe, [probe]);

  const value = useMemo(() => ({ status, recheck }), [status, recheck]);
  return <BackendStatusContext.Provider value={value}>{children}</BackendStatusContext.Provider>;
}

export function useBackendStatus(): BackendStatusValue {
  const ctx = useContext(BackendStatusContext);
  if (!ctx) throw new Error("useBackendStatus must be used within BackendStatusProvider");
  return ctx;
}
