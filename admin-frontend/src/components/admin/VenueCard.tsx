import { TheaterVenue } from "../../types";
import { MapPin, Pencil, Trash2, CheckCircle2, ChevronRight } from "lucide-react";

interface VenueCardProps {
  venue: TheaterVenue;
  isSelected?: boolean;
  onManageHalls?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function VenueCard({
  venue,
  isSelected = false,
  onManageHalls,
  onEdit,
  onDelete,
}: VenueCardProps) {
  return (
    <div
      onClick={onManageHalls}
      className={`cursor-pointer bg-surface-variant rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/5 ${
        isSelected
          ? "border-red-500/80 ring-2 ring-red-500/30 shadow-lg shadow-red-500/10"
          : "border-white/10"
      }`}
    >
      <div>
        {/* Cover Photo */}
        <div className="relative h-36 overflow-hidden bg-black/50 group">
          <img
            src={venue.imageUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop"}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

          {/* Status Badge */}
          <span
            className={`absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[10px] uppercase px-2.5 py-1 rounded-full backdrop-blur-md border ${
              venue.status === "Active"
                ? "bg-green-500/20 border-green-500/40 text-green-400"
                : "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                venue.status === "Active" ? "bg-green-400" : "bg-yellow-400"
              }`}
            />
            {venue.status}
          </span>

          {/* Action Quick Buttons */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                title="Edit Venue"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-colors"
              >
                <Pencil size={13} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Delete Venue"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600/60 text-white/80 hover:text-red-300 backdrop-blur-sm border border-white/10 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="font-heading font-bold text-onSurface text-lg leading-snug">
            {venue.name}
          </h3>
          <p className="flex items-center gap-1.5 text-onSurfaceVariant text-xs mt-1.5 line-clamp-1">
            <MapPin size={13} className="shrink-0 text-red-400" />
            <span className="truncate">{venue.address}</span>
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 gap-4 mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div>
              <p className="font-mono text-[10px] uppercase text-onSurfaceVariant tracking-wider">
                Halls
              </p>
              <p className="text-onSurface font-heading font-bold text-xl mt-0.5">
                {venue.hallCount}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-onSurfaceVariant tracking-wider">
                Capacity
              </p>
              <p className="text-onSurface font-heading font-bold text-xl mt-0.5">
                {venue.capacity.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={onManageHalls}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            isSelected
              ? "bg-red-600 text-white shadow-md shadow-red-600/30"
              : "bg-white/5 text-onSurface hover:bg-white/10 border border-white/10"
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={14} />
              Managing Halls
            </>
          ) : (
            <>
              Manage Halls
              <ChevronRight size={14} className="opacity-60" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
