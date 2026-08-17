// Base API client — central place to configure fetch/axios instance & shared endpoints

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("cinestar_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
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
  return apiGet<{ totalUsers: number }>("/users/stats").catch(() => ({ totalUsers: 2485 }));
}

export function fetchUserGrowthMetrics(): Promise<GrowthMetricPoint[]> {
  return apiGet<GrowthMetricPoint[]>("/users/growth-metrics").catch(() => mockGrowthMetrics);
}

interface FetchUsersParams {
  role: UserRole | "All";
  status: UserAccountStatus | "All";
  search: string;
  page: number;
}

export function fetchUsers(params: FetchUsersParams): Promise<AdminUserRecord[]> {
  const query = new URLSearchParams({
    role: params.role,
    status: params.status,
    search: params.search,
    page: String(params.page),
  });
  return apiGet<AdminUserRecord[]>(`/users?${query.toString()}`).catch(() =>
    filterMockUsers(params)
  );
}

const mockUsers: AdminUserRecord[] = [
  { id: "u-1", name: "Sophia Laurent", email: "s.laurent@cinestar.io", initials: "SL", role: "Admin", status: "Active", joinDate: "Oct 12, 2022", bookingCount: 48 },
  { id: "u-2", name: "Marcus Chen", email: "m.chen@cinestar.io", initials: "MC", role: "Staff", status: "Active", joinDate: "Mar 03, 2023", bookingCount: 22 },
  { id: "u-3", name: "Elena Rodriguez", email: "e.rodriguez@gmail.com", initials: "ER", role: "Customer", status: "Active", joinDate: "Jan 18, 2024", bookingCount: 12 },
  { id: "u-4", name: "James O'Brien", email: "j.obrien@gmail.com", initials: "JO", role: "Customer", status: "Suspended", joinDate: "Jun 05, 2023", bookingCount: 5 },
  { id: "u-5", name: "Aiko Tanaka", email: "a.tanaka@cinestar.io", initials: "AT", role: "Staff", status: "Active", joinDate: "Sep 20, 2023", bookingCount: 31 },
  { id: "u-6", name: "David Park", email: "d.park@gmail.com", initials: "DP", role: "Customer", status: "Active", joinDate: "Feb 14, 2024", bookingCount: 8 },
  { id: "u-7", name: "Maria Silva", email: "m.silva@gmail.com", initials: "MS", role: "Customer", status: "Active", joinDate: "Apr 02, 2023", bookingCount: 15 },
  { id: "u-8", name: "Robert Kim", email: "r.kim@cinestar.io", initials: "RK", role: "Admin", status: "Active", joinDate: "Jul 10, 2022", bookingCount: 56 },
  { id: "u-9", name: "Lisa Andersson", email: "l.andersson@gmail.com", initials: "LA", role: "Customer", status: "Suspended", joinDate: "Nov 30, 2023", bookingCount: 3 },
  { id: "u-10", name: "Tom Becker", email: "t.becker@cinestar.io", initials: "TB", role: "Staff", status: "Active", joinDate: "May 15, 2023", bookingCount: 27 },
];

const mockGrowthMetrics: GrowthMetricPoint[] = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 185 },
  { day: "Wed", value: 210 },
  { day: "Thu", value: 260 },
  { day: "Fri", value: 340 },
  { day: "Sat", value: 400 },
  { day: "Sun", value: 480 },
];

function filterMockUsers(params: FetchUsersParams): AdminUserRecord[] {
  let result = [...mockUsers];

  if (params.role !== "All") {
    result = result.filter((u) => u.role === params.role);
  }
  if (params.status !== "All") {
    result = result.filter((u) => u.status === params.status);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }

  const PAGE_SIZE = 5;
  const start = (params.page - 1) * PAGE_SIZE;
  return result.slice(start, start + PAGE_SIZE);
}