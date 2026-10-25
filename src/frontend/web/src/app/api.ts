import { useCallback } from "react";
import { useAuth } from "./AuthContext";

/** API failure with a user-presentable message (backend `{ error }` or ASP.NET validation details). */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
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
  const fallback = res.status >= 500 ? "The server couldn't complete the request. Try again." : `Request failed (${res.status}).`;
  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("json")) {
    return new ApiError(res.status, res.status === 404 ? "We couldn't find that." : fallback);
  }
  const body = (await res.json()) as ProblemBody;
  const fieldErrors = isRecordOfStringArrays(body.errors) ? body.errors : {};
  const firstFieldError = Object.values(fieldErrors)[0]?.[0];
  const message =
    (typeof body.error === "string" && body.error) || firstFieldError || (typeof body.title === "string" && body.title) || fallback;
  return new ApiError(res.status, message, fieldErrors);
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return "Couldn't reach the server. Check your connection and try again.";
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
}

/** Authenticated fetch helpers; every non-2xx response throws an ApiError. */
export function useApi() {
  const { token } = useAuth();

  const send = useCallback(
    async (path: string, init?: RequestInit): Promise<Response> => {
      if (!token) {
        throw new ApiError(401, "Your session expired. Log in again.");
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
