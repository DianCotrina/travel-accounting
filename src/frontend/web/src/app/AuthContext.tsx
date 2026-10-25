import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "sa_auth_user";
const DEV_BEARER_TOKEN = import.meta.env.VITE_AUTH_BEARER_TOKEN?.trim() ?? "";

export type AuthError = "required" | "missingToken";

interface User {
  email: string;
  token: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  /** Why the last login failed; the UI maps it to localized text. */
  error: AuthError | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<User>;
    if (!parsed.email || !parsed.token) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return { email: parsed.email, token: parsed.token };
  } catch (error) {
    console.error("Unable to parse saved auth session.", error);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession);
  const [error, setError] = useState<AuthError | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    if (!email.trim() || !password.trim()) {
      setError("required");
      return false;
    }

    if (!DEV_BEARER_TOKEN) {
      setError("missingToken");
      return false;
    }

    const sessionUser: User = { email: email.trim(), token: DEV_BEARER_TOKEN };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    setError(null);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      user,
      token: user?.token ?? null,
      error,
      login,
      logout,
      clearError,
    }),
    [user, error, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
