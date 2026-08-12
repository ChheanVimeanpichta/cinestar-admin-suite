import { useState } from "react";
import { MoreVertical, Check, Pencil, Trash2 } from "lucide-react";

export type ShowtimeStatus = "ALMOST FULL" | "ON SALE" | "CONFLICT";

export interface ShowtimeRowData {
  id: string;
  posterUrl: string;
  title: string;
  durationMins: number;
  genre: string;
  theaterName: string;
  hall: string;
  time: string;
  timeLabel: string; // e.g. "Today"
  format: string;
  seatsFilled: number;
  seatsTotal: number;
  status: ShowtimeStatus;
}

const statusStyles: Record<ShowtimeStatus, string> = {
  "ALMOST FULL": "bg-accent/15 text-accent",
  "ON SALE": "bg-blue-500/15 text-blue-400",
  CONFLICT: "bg-yellow-500/15 text-yellow-400",
};

const formatStyles: Record<string, string> = {
  IMAX: "bg-blue-500/15 text-blue-300",
  "4DX": "bg-purple-500/15 text-purple-300",
  "2D": "bg-white/10 text-onSurfaceVariant",
  DOLBY: "bg-teal-500/15 text-teal-300",
};

export default function ShowtimeRow({
  data,
  selected = false,
  onToggleSelect,
  onEdit,
  onDelete,
}: {
  data: ShowtimeRowData;
  selected?: boolean;
  onToggleSelect?: () => void;
  onEdit?: (data: ShowtimeRowData) => void;
  onDelete?: (data: ShowtimeRowData) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const occupancyPct = Math.round((data.seatsFilled / data.seatsTotal) * 100);
  const barColor =
    data.status === "CONFLICT"
      ? "bg-yellow-500"
      : occupancyPct > 80
      ? "bg-accent"
      : "bg-blue-400";

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      {/* Checkbox */}
      <td className="py-4 pl-6 pr-2 align-top">
        <button
          onClick={onToggleSelect}
          className={`flex h-4 w-4 items-center justify-center rounded border ${
            selected
              ? "border-red-600 bg-red-600 text-onSurface"
              : "border-white/10 hover:border-white/10"
          }`}
        >
          {selected && <Check className="h-3 w-3" />}
        </button>
      </td>
      {/* Movie */}
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <img src={data.posterUrl} alt={data.title} className="w-10 h-12 rounded object-cover" />
          <div>
            <p className="text-onSurface font-body font-medium text-sm">{data.title}</p>
            <p className="text-onSurfaceVariant text-xs font-mono mt-0.5">
              {data.durationMins} MIN • {(data.genre ?? "").toUpperCase()}
            </p>
          </div>
        </div>
      </td>

      {/* Theater & hall */}
      <td className="pr-4">
        <p className="text-onSurface text-sm">{data.theaterName}</p>
        <p className="text-onSurfaceVariant text-xs">{data.hall}</p>
      </td>

      {/* Time */}
      <td className="pr-4">
        <p className="text-onSurface text-sm font-mono">{data.time}</p>
        <p className="text-onSurfaceVariant text-xs">{data.timeLabel}</p>
      </td>

      {/* Format */}
      <td className="pr-4">
        <span
          className={`px-2 py-1 rounded text-[10px] font-mono font-semibold ${
            formatStyles[data.format] ?? "bg-white/10 text-onSurfaceVariant"
          }`}
        >
          {data.format}
        </span>
      </td>

      {/* Seats / occupancy */}
      <td className="pr-4 w-40">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${occupancyPct}%` }} />
          </div>
          <span className="text-onSurface text-xs font-mono w-9 text-right">{occupancyPct}%</span>
        </div>
        <p className="text-onSurfaceVariant text-[11px] font-mono mt-1">
          {data.status === "CONFLICT" ? "Pending" : `${data.seatsFilled}/${data.seatsTotal} Avail`}
        </p>
      </td>

      {/* Status + actions */}
      <td className="pr-2">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-semibold uppercase ${statusStyles[data.status]}`}
          >
            {data.status === "CONFLICT" && "⚠ "}
            {data.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-onSurfaceVariant hover:text-onSurface"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-white/10 bg-surface-variant py-1 shadow-xl">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(data);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-onSurface hover:bg-surface-variant"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(data);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-surface-variant"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
