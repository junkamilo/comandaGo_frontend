import type { AuthResponse } from "@/features/auth/types/auth.types";

const ACCESS_TOKEN_KEY = "cg_access_token";
const REFRESH_TOKEN_KEY = "cg_refresh_token";
const SESSION_KEY = "cg_session";
const COOKIE_NAME = "cg_access_token";
const ROL_COOKIE = "cg_rol";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSession(): AuthResponse | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

export function setSession(auth: AuthResponse): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  localStorage.setItem(SESSION_KEY, JSON.stringify(auth));
  const maxAge = auth.expiresIn > 0 ? auth.expiresIn : 86400;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(auth.token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${ROL_COOKIE}=${encodeURIComponent(auth.rol)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${ROL_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
