import { Map, Pencil, Trash2 } from "lucide-react";
import { TheaterHall } from "../../types";

const screenTypeStyles: Record<string, string> = {
  IMAX: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "4DX": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  STANDARD: "bg-white/10 text-onSurfaceVariant border-white/10",
  DOLBY: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  "2D": "bg-white/10 text-onSurfaceVariant border-white/10",
};

const soundSystemColor: Record<string, string> = {
  "Dolby Atmos": "text-red-400 font-medium",
  "THX Certified": "text-purple-300 font-medium",
  "DTS:X": "text-blue-300 font-medium",
  "7.1 Surround": "text-teal-300 font-medium",
};

interface HallRowProps {
  hall: TheaterHall;
  onOpenMap?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function HallRow({
  hall,
  onOpenMap,
  onEdit,
  onDelete,
}: HallRowProps) {
  const isMaintenance = hall.status === "Maintenance";

  return (
    <tr
      className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${
        isMaintenance ? "opacity-60" : ""
      }`}
    >
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-onSurface font-body font-medium text-sm">
            {hall.name}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isMaintenance
                ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                : "bg-green-500/15 text-green-400 border-green-500/30"
            }`}
          >
            {hall.status}
          </span>
        </div>
      </td>

      <td className="py-4 pl-4 pr-4">
        <span
          className={`px-2 py-1 rounded text-[10px] font-mono font-semibold border ${
            screenTypeStyles[hall.screenType] ??
            "bg-white/10 text-onSurfaceVariant border-white/10"
          }`}
        >
          {hall.screenType}
        </span>
      </td>

      <td
        className={`py-4 pl-4 pr-4 text-xs font-mono ${
          soundSystemColor[hall.soundSystem] ?? "text-onSurfaceVariant"
        }`}
      >
        {hall.soundSystem}
      </td>

      <td className="py-4 pl-4 pr-4 text-onSurface text-sm font-mono font-semibold">
        {hall.capacity}{" "}
        <span className="text-xs text-onSurfaceVariant font-normal">seats</span>
      </td>

      <td className="py-4 pl-4 pr-4">
        <button
          type="button"
          onClick={onOpenMap}
          title="Click to view seating layout"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-red-500/20 text-onSurfaceVariant hover:text-red-300 border border-white/10 hover:border-red-500/40 text-xs transition-colors group"
        >
          <Map size={13} className="text-red-400 group-hover:scale-110 transition-transform" />
          <span>Layout</span>
        </button>
      </td>

      <td className="py-4 pl-4 pr-6">
        <div className="flex items-center justify-end gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              title="Edit Hall"
              className="p-1.5 rounded-lg text-onSurfaceVariant hover:text-onSurface hover:bg-white/10 transition-colors"
            >
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Delete Hall"
              className="p-1.5 rounded-lg text-onSurfaceVariant hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
          {!onEdit && !onDelete && (
            <span className="text-[11px] text-onSurfaceVariant/60 italic font-mono">Read-only</span>
          )}
        </div>
      </td>
    </tr>
  );
}
