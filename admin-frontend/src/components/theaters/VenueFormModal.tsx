import { useEffect, useRef, useState } from "react";
import {
  X,
  Building2,
  MapPin,
  Image as ImageIcon,
  Upload,
  Sparkles,
} from "lucide-react";
import { TheaterVenue } from "../../types";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface VenueFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (venue: Partial<TheaterVenue>) => void;
  editVenue?: TheaterVenue | null;
  isSaving?: boolean;
}

const PRESET_IMAGES = [
  {
    label: "Modern Cinema Complex",
    url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop",
  },
  {
    label: "Luxury Riverside Lounge",
    url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=300&fit=crop",
  },
  {
    label: "Grand Theater Hall",
    url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=300&fit=crop",
  },
  {
    label: "Downtown Premiere Cinema",
    url: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=600&h=300&fit=crop",
  },
];

export default function VenueFormModal({
  open,
  onClose,
  onSave,
  editVenue,
  isSaving = false,
}: VenueFormModalProps) {
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role?.toLowerCase() === "admin" || admin?.email?.toLowerCase() === "admin@gmail.com";
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"Active" | "Maintenance">("Active");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEditing = !!editVenue;

  useEffect(() => {
    if (editVenue) {
      setName(editVenue.name || "");
      setAddress(editVenue.address || "");
      setImageUrl(editVenue.imageUrl || "");
      setStatus(editVenue.status || "Active");
    } else {
      setName("");
      setAddress("");
      setImageUrl(PRESET_IMAGES[0].url);
      setStatus("Active");
    }
  }, [editVenue, open]);

  if (!open || !isAdmin) return null;

  // Process a chosen or dropped file into a base64 Data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP, GIF).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalImage = imageUrl.trim() || PRESET_IMAGES[0].url;

    onSave({
      ...(editVenue ? { id: editVenue.id } : {}),
      name: name.trim(),
      address: address.trim(),
      imageUrl: finalImage,
      status,
      hallCount: editVenue?.hallCount ?? 0,
      capacity: editVenue?.capacity ?? 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-onSurface">
                {isEditing ? "Edit Venue" : "Add New Venue"}
              </h2>
              <p className="text-xs text-onSurfaceVariant">
                {isEditing
                  ? "Update venue location, photo, and status"
                  : "Register a new cinema venue location"}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Venue Name */}
          <div>
            <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
              Venue Name *
            </label>
            <div className="relative">
              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CineStar Olympia Mall"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-white/10 text-sm text-onSurface placeholder:text-onSurfaceVariant/50 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
              Physical Address *
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
              />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Monireth Blvd, Sangkat Veal Vong, Phnom Penh"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-white/10 text-sm text-onSurface placeholder:text-onSurfaceVariant/50 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
              Operational Status
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
                ● Active (Open)
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

          {/* Cover Image Upload & Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant">
                Venue Cover Photo
              </label>
              <span className="text-[11px] text-onSurfaceVariant/70">
                Click preview to upload, or paste link below
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Live Preview / Upload Click Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative h-44 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-black/60 flex items-center justify-center ${
                isDragging
                  ? "border-red-500 bg-red-500/10"
                  : "border-white/15 hover:border-red-500/60"
              }`}
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Venue preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                    }}
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white">
                    <Upload size={22} className="text-red-400" />
                    <span className="text-xs font-semibold drop-shadow">
                      Click to choose different image
                    </span>
                    <span className="text-[10px] text-white/70">
                      or drag &amp; drop a file here
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <div className="p-3 rounded-full bg-white/5 text-onSurfaceVariant group-hover:text-red-400 group-hover:bg-red-500/10 transition-colors">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-onSurface group-hover:text-red-400 transition-colors">
                      Click to upload photo from your computer
                    </p>
                    <p className="text-[10px] text-onSurfaceVariant mt-0.5">
                      Supports JPG, PNG, WebP (or drag &amp; drop)
                    </p>
                  </div>
                </div>
              )}

              {imageUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageUrl("");
                  }}
                  title="Clear photo"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600/80 text-white/90 hover:text-white backdrop-blur-sm border border-white/10 transition-colors z-10"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Direct URL or File Status Input */}
            <div className="mt-3 relative">
              <ImageIcon
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
              />
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (https://...) or upload file above"
                className="w-full pl-9 pr-24 py-2 rounded-lg bg-surface border border-white/10 text-xs text-onSurface placeholder:text-onSurfaceVariant/50 outline-none focus:border-red-500/50"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded text-[10px] font-mono uppercase font-semibold bg-white/10 hover:bg-white/20 text-onSurface transition-colors flex items-center gap-1"
              >
                <Upload size={11} />
                Browse
              </button>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-onSurfaceVariant mb-1.5 font-mono">
                <Sparkles size={12} className="text-red-400" />
                <span>Or select from Cinema Presets:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_IMAGES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`text-left p-2 rounded-lg border text-[11px] transition-all flex items-center gap-2 ${
                      imageUrl === p.url
                        ? "border-red-500/60 bg-red-500/15 text-white font-medium ring-1 ring-red-500/30"
                        : "border-white/10 bg-surface text-onSurfaceVariant hover:text-onSurface hover:bg-white/5"
                    }`}
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
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
              {isEditing ? "Save Changes" : "Create Venue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
