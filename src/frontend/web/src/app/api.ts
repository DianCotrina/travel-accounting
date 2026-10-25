import { useCallback } from "react";
import { useAuth } from "./AuthContext";
import type { Messages } from "./i18n/en";

/**
 * API failure. `message` is the server's specific explanation (backend `{ error }` or ASP.NET
 * validation details) and may be empty; `errorMessage` falls back to a localized generic text.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, message = "", fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type ProblemBody = { error?: unknown; title?: unknown; errors?: unknown };

function isRecordOfStringArrays(value: unknown): value is Record<string, string[]> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((v) => Array.isArray(v) && v.every((item) => typeof item === "string"))
  );
}

async function toApiError(res: Response): Promise<ApiError> {
  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("json")) {
    return new ApiError(res.status);
  }
  const body = (await res.json()) as ProblemBody;
  const fieldErrors = isRecordOfStringArrays(body.errors) ? body.errors : {};
  const firstFieldError = Object.values(fieldErrors)[0]?.[0];
  // ASP.NET's generic ProblemDetails title ("One or more validation errors occurred.") adds nothing.
  const message = (typeof body.error === "string" && body.error) || firstFieldError || "";
  return new ApiError(res.status, message, fieldErrors);
}

/** User-facing text for a failure: the server's specific message, else a localized generic one. */
export function errorMessage(error: unknown, errors: Messages["errors"]): string {
  if (error instanceof ApiError) {
    if (error.message) return error.message;
    if (error.status === 401) return errors.sessionExpired;
    if (error.status === 404) return errors.notFound;
    return error.status >= 500 ? errors.server : errors.request(error.status);
  }
  if (error instanceof TypeError) return errors.network;
  return errors.generic;
}

/** Authenticated fetch helpers; every non-2xx response throws an ApiError. */
export function useApi() {
  const { token } = useAuth();

  const send = useCallback(
    async (path: string, init?: RequestInit): Promise<Response> => {
      if (!token) {
        throw new ApiError(401);
      }
      const headers = new Headers(init?.headers);
      if (init?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      headers.set("Authorization", `Bearer ${token}`);
      const res = await fetch(path, { ...init, headers });
      if (!res.ok) {
        throw await toApiError(res);
      }
      return res;
    },
    [token],
  );

  const json = useCallback(
    async <T,>(path: string, init?: RequestInit): Promise<T> => {
      const res = await send(path, init);
      if (res.status === 204) {
        return undefined as T;
      }
      return (await res.json()) as T;
    },
    [send],
  );

  return { send, json };
}
