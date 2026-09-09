import { AdminAccount, AuthResponse } from "../types";
import { apiGet, apiPost } from "./api";

const TOKEN_KEY = "cinestar_admin_token";

// Security: purge any legacy persistent token from localStorage
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage access errors
  }
}

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
};

export const storeToken = (token: string) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage access errors
  }
};

export function loginAdmin(email: string, password: string): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/auth/login", { email, password });
}

export function registerAdmin(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/auth/register", { name, email, password });
}

export function fetchCurrentAdmin(): Promise<AdminAccount> {
  return apiGet<AdminAccount>("/auth/me");
}
