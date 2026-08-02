// Base API client — central place to configure fetch/axios instance & shared endpoints

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

// Shared user endpoints (used by Profile / Admin Users pages)
import { UserProfile } from "../types";

export function fetchCurrentUser(): Promise<UserProfile> {
  return apiGet<UserProfile>("/users/me");
}

export function fetchAllUsers(): Promise<UserProfile[]> {
  return apiGet<UserProfile[]>("/users");
}