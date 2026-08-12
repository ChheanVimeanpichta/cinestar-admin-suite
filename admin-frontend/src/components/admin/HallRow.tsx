import { Map, Pencil } from "lucide-react";
import { TheaterHall } from "../../types";

const screenTypeStyles: Record<string, string> = {
  IMAX: "bg-blue-500/15 text-blue-300",
  "4DX": "bg-purple-500/15 text-purple-300",
  STANDARD: "bg-white/10 text-onSurfaceVariant",
  DOLBY: "bg-teal-500/15 text-teal-300",
  "2D": "bg-white/10 text-onSurfaceVariant",
};

const soundSystemColor: Record<string, string> = {
  "Dolby Atmos": "text-accent",
  "THX Certified": "text-purple-300",
};

export default function HallRow({ hall }: { hall: TheaterHall }) {
  const isMaintenance = hall.status === "Maintenance";

  return (
    <tr className={`border-b border-white/5 last:border-0 ${isMaintenance ? "opacity-50" : ""}`}>
      <td className="py-4 pl-6 pr-4">
        <span className="text-onSurface font-body font-medium text-sm">{hall.name}</span>
        {isMaintenance && (
          <span className="ml-2 text-onSurfaceVariant text-xs font-mono">(Maintenance)</span>
        )}
      </td>
      <td className="py-4 pl-4 pr-4">
        <span
          className={`px-2 py-1 rounded text-[10px] font-mono font-semibold ${
            screenTypeStyles[hall.screenType] ?? "bg-white/10 text-onSurfaceVariant"
          }`}
        >
          {hall.screenType}
        </span>
      </td>
      <td className={`py-4 pl-4 pr-4 text-sm ${soundSystemColor[hall.soundSystem] ?? "text-onSurfaceVariant"}`}>
        {hall.soundSystem}
      </td>
      <td className="py-4 pl-4 pr-4 text-onSurface text-sm font-mono">{hall.capacity}</td>
      <td className="py-4 pl-4 pr-4">
        <div className="w-14 h-7 rounded bg-white/5 border border-white/10" />
      </td>
      <td className="py-4 pl-4 pr-6">
        <div className="flex items-center gap-3">
          <button className="text-onSurfaceVariant hover:text-onSurface">
            <Map size={15} />
          </button>
          <button className="text-onSurfaceVariant hover:text-onSurface">
            <Pencil size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
