import { BookingLedgerEntry } from "../../types";

const avatarColors = [
  "bg-blue-500/30 text-blue-300",
  "bg-purple-500/30 text-purple-300",
  "bg-teal-500/30 text-teal-300",
  "bg-orange-500/30 text-orange-300",
];

function avatarColor(seed: string) {
  const idx = seed.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

export default function TransactionLedgerRow({ entry }: { entry: BookingLedgerEntry }) {
  const isConfirmed = entry.status === "confirmed" || entry.status === "Active" || !entry.status;
  const isCancelled = entry.status === "cancelled" || entry.status === "Cancelled";

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="py-4 pl-6 pr-4 text-accent font-mono text-xs font-semibold">{entry.id}</td>
      <td className="pr-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold shrink-0 ${avatarColor(
              entry.customerInitials || "CU"
            )}`}
          >
            {entry.customerInitials || "CU"}
          </span>
          <div>
            <span className="text-onSurface text-sm font-medium block">{entry.customerName}</span>
          </div>
        </div>
      </td>
      <td className="pr-4 text-onSurface text-sm font-medium max-w-[180px] truncate">{entry.movieTitle}</td>
      <td className="pr-4">
        <p className="text-onSurface text-xs">{entry.screeningDate}</p>
        <p className="text-onSurfaceVariant text-[11px] font-mono mt-0.5">{entry.screeningTime}</p>
      </td>
      <td className="pr-4">
        {entry.seats && entry.seats.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap max-w-[170px]">
            {entry.seats.slice(0, 3).map((seat, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono font-medium text-white border border-white/10 shadow-sm"
              >
                {seat}
              </span>
            ))}
            {entry.seats.length > 3 && (
              <span
                title={`All ${entry.seats.length} seats: ${entry.seats.join(", ")}`}
                className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold cursor-help hover:bg-red-500/25 transition-colors"
              >
                +{entry.seats.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-onSurfaceVariant font-mono">—</span>
        )}
      </td>
      <td className="pr-4 font-mono text-xs font-semibold text-onSurface">
        {entry.totalPrice !== undefined && entry.totalPrice !== null
          ? `$${Number(entry.totalPrice).toFixed(2)}`
          : "—"}
      </td>
      <td className="pr-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/5 text-onSurfaceVariant border border-white/10">
          {entry.paymentMethod || "ABA Pay"}
        </span>
      </td>
      <td className="pr-6">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
            isConfirmed
              ? "bg-green-500/15 border-green-500/30 text-green-400"
              : isCancelled
              ? "bg-red-500/15 border-red-500/30 text-red-400"
              : "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConfirmed
                ? "bg-green-400"
                : isCancelled
                ? "bg-red-400"
                : "bg-yellow-400"
            }`}
          />
          {entry.status || "confirmed"}
        </span>
      </td>
    </tr>
  );
}
