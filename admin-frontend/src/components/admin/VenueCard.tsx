import { TheaterVenue } from "../../types";
import { MapPin } from "lucide-react";

interface VenueCardProps {
  venue: TheaterVenue;
  onManageHalls?: () => void;
}

export default function VenueCard({ venue, onManageHalls }: VenueCardProps) {
  return (
    <div className="bg-surface-variant rounded overflow-hidden">
      <div
        className="relative h-28 bg-cover bg-center"
        style={{ backgroundImage: `url(${venue.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span
          className={`absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[10px] uppercase px-2 py-1 rounded ${
            venue.status === "Active"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              venue.status === "Active" ? "bg-green-400" : "bg-yellow-400"
            }`}
          />
          {venue.status}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-heading font-bold text-onSurface text-lg">{venue.name}</h3>
        <p className="flex items-center gap-1.5 text-onSurfaceVariant text-sm mt-1.5">
          <MapPin size={13} />
          {venue.address}
        </p>

        <div className="flex items-center gap-8 mt-4">
          <div>
            <p className="font-mono text-[10px] uppercase text-onSurfaceVariant tracking-wide">Halls</p>
            <p className="text-onSurface font-heading font-bold text-lg mt-0.5">{venue.hallCount}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-onSurfaceVariant tracking-wide">Capacity</p>
            <p className="text-onSurface font-heading font-bold text-lg mt-0.5">
              {venue.capacity.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={onManageHalls}
          className="w-full mt-5 py-2.5 rounded bg-white/5 text-onSurface text-sm font-body font-medium hover:bg-white/10 transition-colors"
        >
          Manage Halls
        </button>
      </div>
    </div>
  );
}
