import { X, Users, Tv, Armchair } from "lucide-react";
import { TheaterHall } from "../../types";

interface SeatMapModalProps {
  open: boolean;
  onClose: () => void;
  hall: TheaterHall | null;
  venueName?: string;
}

export default function SeatMapModal({ open, onClose, hall, venueName }: SeatMapModalProps) {
  if (!open || !hall) return null;

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
              <Tv size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-onSurface">
                {hall.name} - Seating Layout
              </h2>
              <p className="text-xs text-onSurfaceVariant">
                {venueName ? `${venueName} • ` : ""}{hall.screenType} • {hall.capacity} Total Seats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-onSurfaceVariant hover:text-onSurface hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Screen layout area */}
        <div className="p-6">
          {/* Curved Cinema Screen */}
          <div className="relative mb-8 text-center">
            <div className="h-2 w-3/4 mx-auto rounded-full bg-gradient-to-r from-red-600/20 via-red-500 to-red-600/20 shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-onSurfaceVariant/60 mt-2">
              Auditorium Screen
            </p>
          </div>

          {/* Seats grid */}
          <div className="flex flex-col gap-2 items-center justify-center">
            {rows.map((r, rIdx) => (
              <div key={r} className="flex items-center gap-2">
                <span className="w-5 text-right font-mono text-[10px] text-onSurfaceVariant font-bold">
                  {r}
                </span>

                <div className="flex items-center gap-1.5">
                  {cols.slice(0, 4).map((c) => (
                    <div
                      key={`${r}${c}`}
                      title={`${r}${c} • Standard`}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-110 cursor-default ${
                        rIdx >= 6
                          ? "bg-purple-600/25 border border-purple-500/40 text-purple-200"
                          : "bg-white/5 border border-white/10 text-onSurfaceVariant hover:border-red-500/50"
                      }`}
                    >
                      <Armchair size={13} />
                    </div>
                  ))}
                </div>

                {/* Aisle */}
                <div className="w-3" />

                <div className="flex items-center gap-1.5">
                  {cols.slice(4).map((c) => (
                    <div
                      key={`${r}${c}`}
                      title={`${r}${c} • Standard`}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-110 cursor-default ${
                        rIdx >= 6
                          ? "bg-purple-600/25 border border-purple-500/40 text-purple-200"
                          : "bg-white/5 border border-white/10 text-onSurfaceVariant hover:border-red-500/50"
                      }`}
                    >
                      <Armchair size={13} />
                    </div>
                  ))}
                </div>

                <span className="w-5 text-left font-mono text-[10px] text-onSurfaceVariant font-bold">
                  {r}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-around text-xs text-onSurfaceVariant">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10" />
              <span>Standard (Rows A–F)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-purple-600/25 border border-purple-500/40" />
              <span className="text-purple-300">VIP / Prime (Rows G–H)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-red-400" />
              <span>Max: {hall.capacity} seats</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-onSurface transition-colors"
          >
            Close Layout
          </button>
        </div>
      </div>
    </div>
  );
}
