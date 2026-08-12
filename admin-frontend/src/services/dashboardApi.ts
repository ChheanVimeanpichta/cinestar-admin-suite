import { DashboardStats } from "../types";
import { apiGet } from "./api";
import { TrendingMovie } from "../components/admin/TrendingMovies";
import { FeedEntry } from "../components/admin/SystemLiveFeed";
import { mockLiveFeed } from "../mocks/liveFeed";

export function fetchDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>("/dashboard/stats");
}

export function fetchWeeklySales(): Promise<{ day: string; revenue: number }[]> {
  return apiGet<{ day: string; revenue: number }[]>("/dashboard/weekly-sales");
}

export function fetchTrendingMovies(): Promise<TrendingMovie[]> {
  return apiGet<TrendingMovie[]>("/dashboard/trending-movies");
}

export async function fetchLiveFeed(): Promise<FeedEntry[]> {
  try {
    return await apiGet<FeedEntry[]>("/dashboard/live-feed");
  } catch {
    return mockLiveFeed;
  }
}

export function fetchInventoryStats(): Promise<{
  liveScreens: number;
  avgOccupancyPct: number;
  nextShowTime: string;
}> {
  return apiGet("/dashboard/inventory-stats");
}
