import { useEffect, useState } from "react";
import { Wallet, Ticket, Armchair, LayoutGrid } from "lucide-react";
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

  useEffect(() => {
    fetchDashboardStats().then(setStats);
    fetchWeeklySales().then(setSales);
    fetchTrendingMovies().then(setTrending);
    fetchLiveFeed().then(setFeed);

    // Optional: poll for new feed entries every 10s to simulate "live" streaming
    const interval = setInterval(() => {
      fetchLiveFeed().then(setFeed);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="Total Revenue"
          value={stats ? `$${(stats.totalRevenue / 1000).toFixed(1)}k` : "--"}
          icon={<Wallet size={18} />}
          trend={
            stats ? { value: `${stats.revenueChangePct}% from last week`, positive: true } : undefined
          }
        />
        <StatCard
          label="Active Bookings"
          value={stats ? String(stats.activeBookings) : "--"}
          icon={<Ticket size={18} />}
          footer={<p className="text-onSurfaceVariant text-xs mt-1">🕒 Next update in 14m</p>}
        />
        <StatCard
          label="Theater Occupancy"
          value={stats ? `${stats.theaterOccupancyPct}%` : "--"}
          icon={<Armchair size={18} />}
          footer={<div className="mt-2"><OccupancyBar percent={stats?.theaterOccupancyPct ?? 0} /></div>}
        />
      </div>

      {/* Chart + trending panel row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-surface-variant rounded p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="font-heading font-semibold text-onSurface">Weekly Sales Revenue</p>
            <select className="bg-white/5 text-onSurfaceVariant text-xs font-mono rounded px-3 py-1.5 outline-none border border-white/10">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <p className="text-onSurfaceVariant text-sm mb-4">
            Comparative analysis of daily box office returns
          </p>
          <WeeklySalesChart data={sales} />
        </div>

        <TrendingMovies
          movies={trending}
          aiInsight={'"Neon Dusk" is predicted to sell out this weekend. Consider adding more slots in Hall 4.'}
        />
      </div>

      {/* System Live Feed — appears below the fold, revealed on scroll */}
      <SystemLiveFeed entries={feed} live />
    </div>
  );
}
