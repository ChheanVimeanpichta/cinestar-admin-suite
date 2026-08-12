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
  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="py-4 pl-6 pr-4 text-accent font-mono text-sm">{entry.id}</td>
      <td className="pr-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold shrink-0 ${avatarColor(
              entry.customerInitials
            )}`}
          >
            {entry.customerInitials}
          </span>
          <span className="text-onSurface text-sm">{entry.customerName}</span>
        </div>
      </td>
      <td className="pr-4 text-onSurface text-sm">{entry.movieTitle}</td>
      <td className="pr-4">
        <p className="text-onSurface text-sm">{entry.screeningDate}</p>
        <p className="text-onSurfaceVariant text-xs font-mono mt-0.5">{entry.screeningTime}</p>
      </td>
      <td className="pr-6 text-onSurfaceVariant text-sm font-mono">{entry.seats.join(", ")}</td>
    </tr>
  );
}
