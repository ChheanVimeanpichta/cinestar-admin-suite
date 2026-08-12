import { useEffect, useState } from "react";
import { ClipboardList, Film } from "lucide-react";
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

  useEffect(() => {
    fetchBookingLogStats().then(setStats);
    fetchTransactionLedger().then(setLedger);
    fetchSecurityStream().then(setSecurityEvents);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main content: hero + stats + ledger */}
      <div className="col-span-2 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
              <ClipboardList size={30} className="text-accent" />
              Booking Log
            </h1>
            <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
              All customer bookings
            </p>
          </div>
        </div>

        {/* Hero banner */}
        <div className="bg-surface-variant rounded p-6">
          <p className="flex items-center gap-2 text-accent font-mono text-[11px] uppercase tracking-wide">
            <Film size={13} />
            Live Transaction Stream
          </p>
          <h2 className="font-heading font-bold text-2xl text-onSurface mt-2">
            Booking &amp; Ticket Control
          </h2>
          <p className="text-onSurfaceVariant text-sm mt-2 max-w-lg">
            Oversee all customer reservations, manage validation statuses, and issue digital
            credentials across the CineStar network.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <BookingStatCard
            label="Total Sales Today"
            value={stats?.totalSalesToday ?? "--"}
            accentBorder
          />
          <BookingStatCard label="Active Bookings" value={stats ? String(stats.activeBookings) : "--"} />
          <BookingStatCard
            label="Pending Validation"
            value={stats ? String(stats.pendingValidation) : "--"}
          />
        </div>

        {/* Transaction ledger */}
        <div className="bg-surface-variant rounded overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
            <span className="font-mono text-xs text-onSurfaceVariant">&#x1F4CB;</span>
            <p className="font-heading font-semibold text-onSurface">Transaction Ledger</p>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10">
                <th className="py-3 px-6 font-medium">Booking ID</th>
                <th className="font-medium">Customer Name</th>
                <th className="font-medium">Movie Title</th>
                <th className="font-medium">Screening Date</th>
                <th className="font-medium pr-6">Seats</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry) => (
                <TransactionLedgerRow key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right column: security stream */}
      <div className="bg-surface-variant rounded p-6">
        <SecurityStreamPanel events={securityEvents} />
      </div>
    </div>
  );
}
