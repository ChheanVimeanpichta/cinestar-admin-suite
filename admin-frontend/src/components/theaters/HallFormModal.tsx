import { useEffect, useState } from "react";
import { X, Tv, Volume2, Users, LayoutGrid, AlertTriangle, ChevronDown } from "lucide-react";
import { TheaterHall } from "../../types";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface HallFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (hall: Partial<TheaterHall>) => void;
  venueName: string;
  editHall?: TheaterHall | null;
  existingHalls?: TheaterHall[];
  isSaving?: boolean;
}

const SCREEN_TYPES = ["IMAX", "4DX", "STANDARD", "DOLBY", "2D"] as const;
const SOUND_SYSTEMS = ["Dolby Atmos", "THX Certified", "DTS:X", "7.1 Surround"] as const;
export const CAPACITY_OPTIONS = [80, 100, 120, 150] as const;

export const getHallKey = (rawName: string): string => {
  const clean = rawName.trim().toLowerCase();
  if (!clean) return "";

  // Match prefix like "hall 2", "hall2", "screen 3", "vip 1", etc.
  const prefixMatch = clean.match(/^([a-z\s]+?)\s*(\d+)/i);
  if (prefixMatch) {
    const word = prefixMatch[1].trim().replace(/\s+/g, " ");
    const num = parseInt(prefixMatch[2], 10);
    return `${word} ${num}`;
  }

  // Fallback for non-numbered names (e.g. "Grand Ballroom") -> alphanumeric only
  return clean.replace(/[^a-z0-9]/g, "");
};

export const isHallDuplicate = (inputName: string, existingHallName: string): boolean => {
  const inputClean = inputName.trim().toLowerCase();
  const existClean = existingHallName.trim().toLowerCase();
  if (!inputClean || !existClean) return false;

  // 1. Direct exact or whitespace-collapsed match
  if (inputClean.replace(/\s+/g, " ") === existClean.replace(/\s+/g, " ")) {
    return true;
  }

  // 2. Base hall key match (e.g. "hall 2", "hall2", "hall 2 - 4dx")
  const inputKey = getHallKey(inputName);
  const existKey = getHallKey(existingHallName);

  return !!(inputKey && existKey && inputKey === existKey);
};

export default function HallFormModal({
  open,
  onClose,
  onSave,
  venueName,
  editHall,
  existingHalls = [],
  isSaving = false,
}: HallFormModalProps) {
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role?.toLowerCase() === "admin" || admin?.email?.toLowerCase() === "admin@gmail.com";
  const [name, setName] = useState("");
  const [screenType, setScreenType] = useState<TheaterHall["screenType"]>("STANDARD");
  const [soundSystem, setSoundSystem] = useState("Dolby Atmos");
  const [capacity, setCapacity] = useState<number>(120);
  const [status, setStatus] = useState<"Active" | "Maintenance">("Active");

  const isEditing = !!editHall;

  const duplicateHall =
    name.trim().length > 0
      ? existingHalls.find(
          (h) =>
            (!editHall || h.id !== editHall.id) &&
            isHallDuplicate(name, h.name)
        )
      : undefined;
  const isDuplicateName = !!duplicateHall;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Automatically format "hall1" -> "Hall 1", "hall 2" -> "Hall 2", etc.
    const formatted = raw.replace(/\b(hall)\s*(\d+)/gi, (_match, _p1, p2) => {
      return `Hall ${p2}`;
    });
    setName(formatted);
  };

  const handleNameBlur = () => {
    setName((prev) => {
      return prev
        .trim()
        .replace(/\b(hall)\s*(\d+)/gi, (_match, _p1, p2) => `Hall ${p2}`);
    });
  };

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

  if (!open || !isAdmin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name
      .trim()
      .replace(/\b(hall)\s*(\d+)/gi, (_match, _p1, p2) => `Hall ${p2}`);
    if (!cleanName || isDuplicateName) return;

    onSave({
      ...(editHall ? { id: editHall.id, venueId: editHall.venueId } : {}),
      name: cleanName,
      screenType,
      soundSystem,
      capacity: Number(capacity) || 120,
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant">
                Hall Name *
              </label>
              {isDuplicateName && (
                <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                  <AlertTriangle size={12} /> Hall already exists
                </span>
              )}
            </div>
            <div className="relative">
              <Tv
                size={16}
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                  isDuplicateName ? "text-amber-400" : "text-onSurfaceVariant"
                }`}
              />
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                placeholder="e.g. Hall 1 - IMAX"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border text-sm text-onSurface placeholder:text-onSurfaceVariant/50 outline-none transition-all ${
                  isDuplicateName
                    ? "border-amber-500/70 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                    : "border-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                }`}
              />
            </div>
            {!isDuplicateName && (
              <p className="text-[11px] text-onSurfaceVariant/60 mt-1.5 flex items-center gap-1">
                <span>Tip: Typing <code className="bg-white/5 px-1 py-0.5 rounded text-onSurfaceVariant font-mono text-[10px]">hall1</code> automatically formats to <strong className="text-onSurface font-semibold">Hall 1</strong></span>
              </p>
            )}
            {isDuplicateName && duplicateHall && (
              <div className="mt-2 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300 animate-fadeIn">
                <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-300">
                    Warning: Hall already exists in this venue
                  </p>
                  <p className="text-amber-300/80 mt-0.5 text-[11px] leading-relaxed">
                    {duplicateHall.name.trim().toLowerCase() === name.trim().toLowerCase() ? (
                      <>A hall named <strong className="text-amber-200">"{duplicateHall.name}"</strong> already exists in {venueName ? <strong className="text-white">{venueName}</strong> : "this venue"}.</>
                    ) : (
                      <>Conflicts with existing <strong className="text-amber-200">"{duplicateHall.name}"</strong> in {venueName ? <strong className="text-white">{venueName}</strong> : "this venue"}.</>
                    )} Please choose a unique hall name or number.
                  </p>
                </div>
              </div>
            )}
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

          {/* Seating Capacity (Combo Box with fixed tiers: 80, 100, 120, 150) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant">
                Seating Capacity (Seats) *
              </label>
              <span className="text-[11px] font-mono text-onSurfaceVariant">
                Standard hall tiers
              </span>
            </div>
            <div className="relative">
              <Users
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant pointer-events-none"
              />
              <select
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-surface border border-white/10 text-sm text-onSurface outline-none focus:border-red-500/50 cursor-pointer appearance-none"
              >
                {!CAPACITY_OPTIONS.includes(capacity as any) && capacity > 0 && (
                  <option value={capacity} className="bg-[#1e1e1e] text-onSurface">
                    {capacity} Seats (Current)
                  </option>
                )}
                {CAPACITY_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-[#1e1e1e] text-onSurface">
                    {c} Seats
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant pointer-events-none"
              />
            </div>

            {/* Quick-Select Capacity Pills */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {CAPACITY_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCapacity(c)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-mono font-medium transition-all ${
                    capacity === c
                      ? "bg-red-600/20 border-red-500/50 text-red-400 font-bold shadow-sm shadow-red-500/20"
                      : "bg-surface border-white/10 text-onSurfaceVariant hover:bg-white/5 hover:text-onSurface"
                  }`}
                >
                  {c} seats
                </button>
              ))}
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
              disabled={isSaving || isDuplicateName || !name.trim()}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-colors shadow-lg shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isDuplicateName
                ? "Hall Already Exists"
                : isEditing
                ? "Save Changes"
                : "Add Hall"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
