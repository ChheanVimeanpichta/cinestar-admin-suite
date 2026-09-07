import { useEffect, useState, useCallback } from "react";
import { ClipboardList, Film, RefreshCw, Search } from "lucide-react";
import { BookingLedgerEntry, SecurityStreamEvent } from "../../types";
import {
  fetchBookingLogStats,
  fetchTransactionLedger,
  fetchSecurityStream,
} from "../../services/bookingApi";
import BookingStatCard from "../../components/admin/BookingStatCard";
import TransactionLedgerRow from "../../components/admin/TransactionLedgerRow";
import SecurityStreamPanel from "../../components/admin/SecurityStreamPanel";

interface BookingLogStats {
  totalSalesToday: string;
  activeBookings: number;
  pendingValidation: number;
}

export default function BookingLog() {
  const [stats, setStats] = useState<BookingLogStats | null>(null);
  const [ledger, setLedger] = useState<BookingLedgerEntry[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityStreamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadData = useCallback(async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const [sData, lData, secData] = await Promise.all([
        fetchBookingLogStats(),
        fetchTransactionLedger(),
        fetchSecurityStream(),
      ]);
      setStats(sData);
      setLedger(lData);
      setSecurityEvents(secData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed to refresh bookings:", err);
    } finally {
      setLoading(false);
      if (showSpin) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-poll every 6 seconds so user bookings appear in real time!
    const interval = setInterval(() => {
      loadData(false);
    }, 6000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Filter ledger entries
  const filteredLedger = ledger.filter((entry) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      entry.customerName.toLowerCase().includes(q) ||
      entry.id.toLowerCase().includes(q) ||
      entry.movieTitle.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "confirmed" &&
        (entry.status === "confirmed" || entry.status === "Active" || !entry.status)) ||
      (statusFilter === "pending" && entry.status === "pending");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content: hero + stats + ledger */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 font-heading font-black text-3xl sm:text-4xl uppercase text-onSurface">
              <ClipboardList size={30} className="text-red-500" />
              Booking Log
            </h1>
            <p className="text-onSurfaceVariant text-body-md mt-1 max-w-xl">
              Live customer transactions and reservation audit records from database.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {lastUpdated && (
              <span className="text-[11px] font-mono text-onSurfaceVariant flex items-center gap-1.5 hidden sm:flex">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Sync ({lastUpdated})
              </span>
            )}
            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-variant hover:bg-white/10 text-onSurface text-xs font-semibold border border-white/10 transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-red-400" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Hero banner */}
        <div className="bg-surface-variant rounded-2xl border border-white/10 p-6 shadow-md">
          <p className="flex items-center gap-2 text-red-500 font-mono text-[11px] uppercase tracking-wide">
            <Film size={13} />
            Live Transaction Stream &bull; Connected to MySQL RDS
          </p>
          <h2 className="font-heading font-bold text-2xl text-onSurface mt-2">
            Booking &amp; Ticket Control
          </h2>
          <p className="text-onSurfaceVariant text-sm mt-1 max-w-lg">
            Oversee all customer reservations, track incoming purchases in real time, and verify digital tickets.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <BookingStatCard
            label="Total Sales Today"
            value={stats?.totalSalesToday ?? "--"}
            accentBorder
          />
          <BookingStatCard
            label="Active Bookings"
            value={stats ? String(stats.activeBookings) : "--"}
          />
          <BookingStatCard
            label="Pending Validation"
            value={stats ? String(stats.pendingValidation) : "--"}
          />
        </div>

        {/* Transaction ledger */}
        <div className="bg-surface-variant rounded-2xl border border-white/10 overflow-hidden shadow-lg">
          {/* Ledger Toolbar: Search + Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-onSurfaceVariant">&#x1F4CB;</span>
              <p className="font-heading font-semibold text-onSurface text-base">
                Transaction Ledger ({filteredLedger.length})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer, ID, or movie..."
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-onSurface placeholder:text-onSurfaceVariant focus:outline-none focus:border-red-500/50 w-48 sm:w-56"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px]">
                {["ALL", "confirmed", "pending"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded-md capitalize transition ${
                      statusFilter === st
                        ? "bg-red-600 text-white font-semibold shadow-sm"
                        : "text-onSurfaceVariant hover:text-onSurface"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center items-center text-onSurfaceVariant text-xs">
              <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
              Loading transactions from database...
            </div>
          ) : filteredLedger.length === 0 ? (
            <div className="py-16 text-center text-onSurfaceVariant text-xs space-y-1">
              <p>No bookings match your search query.</p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-red-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10 bg-white/[0.01]">
                    <th className="py-3 px-6 font-medium">Booking ID</th>
                    <th className="py-3 pr-4 font-medium">Customer</th>
                    <th className="py-3 pr-4 font-medium">Movie Title</th>
                    <th className="py-3 pr-4 font-medium">Screening</th>
                    <th className="py-3 pr-4 font-medium">Seats</th>
                    <th className="py-3 pr-4 font-medium">Total</th>
                    <th className="py-3 pr-4 font-medium">Payment</th>
                    <th className="py-3 pr-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLedger.map((entry) => (
                    <TransactionLedgerRow key={entry.id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right column: security stream */}
      <div className="bg-surface-variant rounded-2xl border border-white/10 p-6 shadow-md h-fit lg:sticky lg:top-6">
        <SecurityStreamPanel events={securityEvents} />
      </div>
    </div>
  );
}
