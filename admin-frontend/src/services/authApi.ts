import { AdminAccount, AuthResponse } from "../types";
import { apiGet, apiPost } from "./api";

const TOKEN_KEY = "cinestar_admin_token";

export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const storeToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export function loginAdmin(email: string, password: string): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/auth/login", { email, password });
}

export function registerAdmin(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/auth/register", { name, email, password });
}

export function fetchCurrentAdmin(): Promise<AdminAccount> {
  return apiGet<AdminAccount>("/auth/me");
}
