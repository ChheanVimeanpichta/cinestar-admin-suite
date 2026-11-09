import { BookingLedgerEntry } from "../../types";

const avatarColors = [
  "bg-blue-500/30 text-blue-300",
  "bg-purple-500/30 text-purple-300",
  "bg-teal-500/30 text-teal-300",
  "bg-orange-500/30 text-orange-300",
];

function avatarColor(seed: string) {
  const idx = (seed || "C").charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

function getPaymentBadge(method?: string) {
  const m = (method || "").toLowerCase().trim();
  if (m.includes("aba")) {
    return {
      bg: "bg-[#004B7A]/25 border-[#004B7A]/50 text-[#38BDF8]",
      label: method || "ABA Pay",
    };
  }
  if (m.includes("acleda")) {
    return {
      bg: "bg-[#1B4FA0]/25 border-[#1B4FA0]/50 text-[#60A5FA]",
      label: method || "ACLEDA",
    };
  }
  if (m.includes("wing")) {
    return {
      bg: "bg-[#14A44D]/25 border-[#14A44D]/50 text-[#4ADE80]",
      label: method || "Wing",
    };
  }
  if (m.includes("card") || m.includes("visa") || m.includes("master")) {
    return {
      bg: "bg-amber-500/25 border-amber-500/50 text-amber-300",
      label: method || "Card",
    };
  }
  return {
    bg: "bg-white/10 border-white/20 text-onSurface",
    label: method || "Other",
  };
}

export default function TransactionLedgerRow({ entry }: { entry: BookingLedgerEntry }) {
  const isConfirmed = entry.status === "confirmed" || entry.status === "Active" || !entry.status;
  const isCancelled = entry.status === "cancelled" || entry.status === "Cancelled";

  // Parse seats safely from any format (array, JSON string, comma-separated string)
  const parsedSeats: string[] = Array.isArray(entry.seats)
    ? entry.seats
    : typeof entry.seats === "string"
    ? (() => {
        try {
          const p = JSON.parse(entry.seats);
          return Array.isArray(p) ? p : [entry.seats];
        } catch {
          return (entry.seats as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      })()
    : [];

  const paymentBadge = getPaymentBadge(entry.paymentMethod);

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      {/* 1. Booking ID */}
      <td className="py-4 pl-6 pr-4 text-red-400 font-mono text-xs font-semibold whitespace-nowrap">
        {entry.id}
      </td>

      {/* 2. Customer */}
      <td className="pr-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${avatarColor(
              entry.customerInitials || "CU"
            )}`}
          >
            {entry.customerInitials || "CU"}
          </span>
          <div className="min-w-0">
            <span className="text-onSurface text-sm font-medium block truncate max-w-[140px]">
              {entry.customerName || "Customer"}
            </span>
          </div>
        </div>
      </td>

      {/* 3. Movie Title */}
      <td className="pr-4 text-onSurface text-sm font-semibold max-w-[180px] truncate" title={entry.movieTitle}>
        {entry.movieTitle}
      </td>

      {/* 4. Screening */}
      <td className="pr-4 whitespace-nowrap">
        <p className="text-onSurface text-xs font-medium">{entry.screeningDate || "Today"}</p>
        <p className="text-onSurfaceVariant text-[11px] font-mono mt-0.5">{entry.screeningTime || "18:00"}</p>
      </td>

      {/* 5. Seats */}
      <td className="pr-4">
        {parsedSeats.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap max-w-[170px]">
            {parsedSeats.slice(0, 3).map((seat, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono font-medium text-white border border-white/10 shadow-sm"
              >
                {seat}
              </span>
            ))}
            {parsedSeats.length > 3 && (
              <span
                title={`All ${parsedSeats.length} seats: ${parsedSeats.join(", ")}`}
                className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold cursor-help hover:bg-red-500/25 transition-colors"
              >
                +{parsedSeats.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-onSurfaceVariant font-mono">—</span>
        )}
      </td>

      {/* 6. Total */}
      <td className="pr-4 font-mono text-xs font-bold text-onSurface whitespace-nowrap">
        {entry.totalPrice !== undefined && entry.totalPrice !== null && !isNaN(Number(entry.totalPrice))
          ? `$${Number(entry.totalPrice).toFixed(2)}`
          : "—"}
      </td>

      {/* 7. Payment */}
      <td className="pr-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider ${paymentBadge.bg}`}
        >
          {paymentBadge.label}
        </span>
      </td>

      {/* 8. Status */}
      <td className="pr-6 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
            isConfirmed
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : isCancelled
              ? "bg-red-500/15 border-red-500/30 text-red-400"
              : "bg-amber-500/15 border-amber-500/30 text-amber-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConfirmed
                ? "bg-emerald-400 animate-pulse"
                : isCancelled
                ? "bg-red-400"
                : "bg-amber-400"
            }`}
          />
          {entry.status || "confirmed"}
        </span>
      </td>
    </tr>
  );
}
