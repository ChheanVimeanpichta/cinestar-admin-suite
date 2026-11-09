import { useEffect, useState, useCallback } from "react";
import { Wallet, Ticket, Armchair, LayoutGrid, RefreshCw } from "lucide-react";
import { DashboardStats } from "../../types";
import {
  fetchDashboardStats,
  fetchWeeklySales,
  fetchTrendingMovies,
  fetchLiveFeed,
} from "../../services/dashboardApi";
import StatCard from "../../components/admin/StatCard";
import OccupancyBar from "../../components/admin/OccupancyBar";
import WeeklySalesChart from "../../components/admin/WeeklySalesChart";
import TrendingMovies, { TrendingMovie } from "../../components/admin/TrendingMovies";
import SystemLiveFeed, { FeedEntry } from "../../components/admin/SystemLiveFeed";

export default function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sales, setSales] = useState<{ day: string; revenue: number }[]>([]);
  const [trending, setTrending] = useState<TrendingMovie[]>([]);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadData = useCallback(async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const [statsData, salesData, trendingData, feedData] = await Promise.all([
        fetchDashboardStats(),
        fetchWeeklySales(),
        fetchTrendingMovies(),
        fetchLiveFeed(),
      ]);
      setStats(statsData);
      setSales(salesData);
      setTrending(trendingData);
      setFeed(feedData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed to refresh dashboard:", err);
    } finally {
      if (showSpin) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto-poll every 6s to stream live data from RDS
    const interval = setInterval(() => {
      loadData(false);
    }, 6000);
    return () => clearInterval(interval);
  }, [loadData]);

  const formatRevenueValue = (rev?: number | null) => {
    if (rev === null || rev === undefined) return "--";
    if (rev >= 1000) {
      return `$${(rev / 1000).toFixed(1)}k`;
    }
    return `$${rev.toFixed(2)}`;
  };

  const topTrendingMovie = trending[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
            <LayoutGrid size={30} className="text-accent" />
            Dashboard
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
            Monitor revenue, occupancy, and system activity across all venues in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] font-mono text-onSurfaceVariant flex items-center gap-1.5 hidden sm:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Sync ({lastUpdated})
            </span>
          )}
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-onSurface text-xs font-mono uppercase tracking-wider rounded border border-white/10 transition"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-accent" : ""} />
            Sync
          </button>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="Total Revenue"
          value={formatRevenueValue(stats?.totalRevenue)}
          icon={<Wallet size={18} />}
          trend={
            stats ? { value: `${stats.revenueChangePct}% from last week`, positive: true } : undefined
          }
        />
        <StatCard
          label="Active Bookings"
          value={stats ? String(stats.activeBookings) : "--"}
          icon={<Ticket size={18} />}
          footer={<p className="text-onSurfaceVariant text-xs mt-1">🕒 Live Sync Active</p>}
        />
        <StatCard
          label="Theater Occupancy"
          value={stats ? `${stats.theaterOccupancyPct}%` : "--"}
          icon={<Armchair size={18} />}
          footer={
            <div className="mt-2">
              <OccupancyBar percent={stats?.theaterOccupancyPct ?? 0} />
            </div>
          }
        />
      </div>

      {/* Chart + trending panel row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-surface-variant rounded p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="font-heading font-semibold text-onSurface">Weekly Sales Revenue</p>
            <span className="bg-white/5 text-onSurfaceVariant text-xs font-mono rounded px-3 py-1.5 border border-white/10">
              Past 7 Days
            </span>
          </div>
          <p className="text-onSurfaceVariant text-sm mb-4">
            Comparative analysis of daily box office returns from live transactions
          </p>
          <WeeklySalesChart data={sales} />
        </div>

        <TrendingMovies
          movies={trending}
          aiInsight={
            topTrendingMovie
              ? `"${topTrendingMovie.title}" is currently leading ticket sales. Consider adding more slots in Hall 1.`
              : "High weekend traffic anticipated across all halls."
          }
        />
      </div>

      {/* System Live Feed — appears below the fold, revealed on scroll */}
      <SystemLiveFeed entries={feed} live />
    </div>
  );
}
