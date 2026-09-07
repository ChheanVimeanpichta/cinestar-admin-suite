import { useEffect, useState } from "react";
import { X, Tv, Volume2, Users, LayoutGrid } from "lucide-react";
import { TheaterHall } from "../../types";

interface HallFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (hall: Partial<TheaterHall>) => void;
  venueName: string;
  editHall?: TheaterHall | null;
  isSaving?: boolean;
}

const SCREEN_TYPES = ["IMAX", "4DX", "STANDARD", "DOLBY", "2D"] as const;
const SOUND_SYSTEMS = ["Dolby Atmos", "THX Certified", "DTS:X", "7.1 Surround"] as const;

export default function HallFormModal({
  open,
  onClose,
  onSave,
  venueName,
  editHall,
  isSaving = false,
}: HallFormModalProps) {
  const [name, setName] = useState("");
  const [screenType, setScreenType] = useState<TheaterHall["screenType"]>("STANDARD");
  const [soundSystem, setSoundSystem] = useState("Dolby Atmos");
  const [capacity, setCapacity] = useState<number>(120);
  const [status, setStatus] = useState<"Active" | "Maintenance">("Active");

  const isEditing = !!editHall;

  useEffect(() => {
    if (editHall) {
      setName(editHall.name || "");
      setScreenType(editHall.screenType || "STANDARD");
      setSoundSystem(editHall.soundSystem || "Dolby Atmos");
      setCapacity(editHall.capacity || 120);
      setStatus(editHall.status || "Active");
    } else {
      setName("");
      setScreenType("STANDARD");
      setSoundSystem("Dolby Atmos");
      setCapacity(120);
      setStatus("Active");
    }
  }, [editHall, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(editHall ? { id: editHall.id, venueId: editHall.venueId } : {}),
      name: name.trim(),
      screenType,
      soundSystem,
      capacity: Number(capacity) || 64,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-onSurface">
                {isEditing ? "Edit Hall" : "Add Cinema Hall"}
              </h2>
              <p className="text-xs text-onSurfaceVariant">
                {venueName ? `Assigning to ${venueName}` : "Configure hall specifications"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Hall Name */}
          <div>
            <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
              Hall Name *
            </label>
            <div className="relative">
              <Tv
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hall 1 - IMAX"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-white/10 text-sm text-onSurface placeholder:text-onSurfaceVariant/50 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
              />
            </div>
          </div>

          {/* Screen Type & Sound System */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
                Screen Format
              </label>
              <select
                value={screenType}
                onChange={(e) => setScreenType(e.target.value as TheaterHall["screenType"])}
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-white/10 text-sm text-onSurface outline-none focus:border-red-500/50 cursor-pointer"
              >
                {SCREEN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
                Sound System
              </label>
              <div className="relative">
                <Volume2
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant pointer-events-none"
                />
                <select
                  value={soundSystem}
                  onChange={(e) => setSoundSystem(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-white/10 text-sm text-onSurface outline-none focus:border-red-500/50 cursor-pointer"
                >
                  {SOUND_SYSTEMS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
              Seating Capacity (Seats) *
            </label>
            <div className="relative">
              <Users
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
              />
              <input
                type="number"
                min={20}
                max={500}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-white/10 text-sm text-onSurface outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
              Hall Operational Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("Active")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  status === "Active"
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-surface border-white/10 text-onSurfaceVariant hover:bg-white/5"
                }`}
              >
                ● Active
              </button>
              <button
                type="button"
                onClick={() => setStatus("Maintenance")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  status === "Maintenance"
                    ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                    : "bg-surface border-white/10 text-onSurfaceVariant hover:bg-white/5"
                }`}
              >
                ▲ Maintenance
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg text-sm text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-colors shadow-lg shadow-red-600/25 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isEditing ? "Save Changes" : "Add Hall"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
