import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

const VALID_EMAIL = "test@gmail.com";
const VALID_PASSWORD = "123456789";
const STORAGE_KEY = "sa_auth_user";

interface User {
  email: string;
}

interface AuthContextValue {
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {
    /* ignore */
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const u: User = { email };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
      setError(null);
      return true;
    }
    setError("Invalid email or password. Please try again.");
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({ user, error, login, logout, clearError }),
    [user, error, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
