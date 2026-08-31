// Base API client — central place to configure fetch/axios instance & shared endpoints

const RAW_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const BASE_URL = RAW_URL.replace(/\/+$/, "");

function buildUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("cinestar_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // Non-JSON response (e.g. 404/502 HTML from proxy)
    if (res.status === 404) {
      return "Endpoint not found (404). Please ensure the backend server is running.";
    }
    if (res.status === 502 || res.status === 503) {
      return "Backend service unavailable. Please check if the backend is running.";
    }
  }
  return fallback;
}

export async function apiGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path), { headers: authHeaders() });
  } catch {
    throw new Error(
      "Unable to connect to the backend server. Please verify the admin backend is running."
    );
  }

  if (!res.ok) {
    const errorMessage = await extractErrorMessage(res, `GET ${path} failed with status ${res.status}`);
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend server. Please verify the admin backend is running."
    );
  }

  if (!res.ok) {
    const errorMessage = await extractErrorMessage(res, `POST ${path} failed with status ${res.status}`);
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path), {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend server. Please verify the admin backend is running."
    );
  }

  if (!res.ok) {
    const errorMessage = await extractErrorMessage(res, `PUT ${path} failed with status ${res.status}`);
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: authHeaders(),
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend server. Please verify the admin backend is running."
    );
  }

  if (!res.ok) {
    const errorMessage = await extractErrorMessage(res, `DELETE ${path} failed with status ${res.status}`);
    throw new Error(errorMessage);
  }
  return res.json();
}

// Shared user endpoints (used by Profile / Admin Users pages)
import { UserProfile, AdminUserRecord, GrowthMetricPoint, UserRole, UserAccountStatus } from "../types";

export function fetchCurrentUser(): Promise<UserProfile> {
  return apiGet<UserProfile>("/users/me");
}

export function fetchAllUsers(): Promise<UserProfile[]> {
  return apiGet<UserProfile[]>("/users");
}

export function fetchUserManagementStats(): Promise<{ totalUsers: number }> {
  return apiGet<{ totalUsers: number }>("/users/stats").catch(() => ({ totalUsers: 0 }));
}

export function fetchUserGrowthMetrics(): Promise<GrowthMetricPoint[]> {
  return apiGet<GrowthMetricPoint[]>("/users/growth-metrics").catch(() => []);
}

export interface FetchUsersParams {
  role: UserRole | "All";
  status: UserAccountStatus | "All";
  search: string;
  page: number;
}

export interface FetchUsersResponse {
  records: AdminUserRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchUsers(params: FetchUsersParams): Promise<FetchUsersResponse> {
  const query = new URLSearchParams({
    role: params.role,
    status: params.status,
    search: params.search,
    page: String(params.page),
  });
  try {
    const res = await apiGet<any>(`/users?${query.toString()}`);
    if (Array.isArray(res)) {
      return {
        records: res,
        total: res.length,
        page: params.page,
        pageSize: 5,
        totalPages: Math.max(1, Math.ceil(res.length / 5)),
      };
    }
    return {
      records: res.records || [],
      total: typeof res.total === 'number' ? res.total : (res.records?.length || 0),
      page: typeof res.page === 'number' ? res.page : params.page,
      pageSize: typeof res.pageSize === 'number' ? res.pageSize : 5,
      totalPages: typeof res.totalPages === 'number' ? res.totalPages : Math.max(1, Math.ceil((res.total || 0) / 5)),
    };
  } catch {
    return { records: [], total: 0, page: 1, pageSize: 5, totalPages: 1 };
  }
}

export function updateAdminUser(id: string, data: { name: string; email: string; avatarUrl?: string }): Promise<AdminUserRecord> {
  return apiPut<AdminUserRecord>(`/users/${id}`, data);
}

export function deleteAdminUser(id: string): Promise<{ success: boolean; message: string }> {
  return apiDelete<{ success: boolean; message: string }>(`/users/${id}`);
}