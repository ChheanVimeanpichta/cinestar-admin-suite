import { useState, useRef, useEffect } from "react";
import {
  ChevronsUpDown,
  Search,
  Check,
  Plus,
  Building2,
  MapPin,
  X,
  LayoutGrid,
} from "lucide-react";
import { TheaterVenue } from "../../types";

interface VenueSwitcherProps {
  venues: TheaterVenue[];
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string | null) => void;
  onAddNewVenue?: () => void;
}

export default function VenueSwitcher({
  venues,
  selectedVenueId,
  onSelectVenue,
  onAddNewVenue,
}: VenueSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filter venues based on search query
  const filteredVenues = venues.filter((venue) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      venue.name.toLowerCase().includes(q) ||
      (venue.address && venue.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm ${
          isOpen
            ? "bg-white/10 border-red-500/50 text-white ring-2 ring-red-500/20"
            : "bg-surface border-white/10 hover:border-white/20 text-onSurface hover:bg-white/5"
        }`}
        title="Switch cinema venue"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedVenue ? (
            <>
              <img
                src={
                  selectedVenue.imageUrl ||
                  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop"
                }
                alt={selectedVenue.name}
                className="w-5 h-5 rounded-md object-cover border border-white/10 shrink-0 bg-black/40"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop";
                }}
              />
              <span className="font-heading font-bold text-sm text-onSurface truncate max-w-[160px] sm:max-w-[220px]">
                {selectedVenue.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 shrink-0">
                {selectedVenue.hallCount} halls
              </span>
            </>
          ) : (
            <>
              <Building2 size={15} className="text-red-500 shrink-0" />
              <span className="font-heading font-bold text-sm text-onSurface truncate">
                All Venues ({venues.length})
              </span>
            </>
          )}
        </div>

        <ChevronsUpDown
          size={14}
          className={`text-onSurfaceVariant transition-transform ${
            isOpen ? "rotate-180 text-red-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#161616] border border-white/15 shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {/* Search Box Header */}
          <div className="p-3 border-b border-white/10 bg-white/[0.02]">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search among ${venues.length} venues...`}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-onSurface placeholder:text-onSurfaceVariant focus:outline-none focus:border-red-500/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-onSurfaceVariant hover:text-white p-0.5 rounded"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-onSurfaceVariant font-mono mt-2 px-1">
              <span>
                {filteredVenues.length} of {venues.length} locations
              </span>
              <span>ESC to close</span>
            </div>
          </div>

          {/* Quick Option: All Venues Directory */}
          <div className="p-1.5 border-b border-white/5">
            <button
              type="button"
              onClick={() => {
                onSelectVenue(null);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                selectedVenueId === null
                  ? "bg-red-600/15 border border-red-500/30 text-white font-semibold"
                  : "hover:bg-white/5 text-onSurface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/5 text-onSurfaceVariant">
                  <LayoutGrid size={14} />
                </div>
                <div>
                  <p className="font-heading font-bold text-xs text-onSurface">
                    All Venues Directory
                  </p>
                  <p className="text-[10px] text-onSurfaceVariant">
                    Overview of all {venues.length} cinema complexes
                  </p>
                </div>
              </div>
              {selectedVenueId === null && (
                <Check size={14} className="text-red-400" />
              )}
            </button>
          </div>

          {/* Scrollable Venue List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
            {filteredVenues.length === 0 ? (
              <div className="py-8 text-center text-xs text-onSurfaceVariant">
                No venues found matching "{searchQuery}"
              </div>
            ) : (
              filteredVenues.map((venue) => {
                const isSelected = venue.id === selectedVenueId;
                return (
                  <button
                    key={venue.id}
                    type="button"
                    onClick={() => {
                      onSelectVenue(venue.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? "bg-red-600/15 border border-red-500/30 text-white shadow-sm"
                        : "hover:bg-white/5 text-onSurface border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <img
                        src={
                          venue.imageUrl ||
                          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop"
                        }
                        alt={venue.name}
                        className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0 bg-black/40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop";
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-heading font-bold text-xs text-onSurface truncate">
                            {venue.name}
                          </p>
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              venue.status === "Active"
                                ? "bg-green-400"
                                : "bg-yellow-400"
                            }`}
                          />
                        </div>
                        <p className="flex items-center gap-1 text-[10px] text-onSurfaceVariant truncate mt-0.5">
                          <MapPin size={10} className="shrink-0 text-red-400/80" />
                          <span className="truncate">{venue.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-onSurfaceVariant border border-white/5">
                        {venue.hallCount} {venue.hallCount === 1 ? "hall" : "halls"}
                      </span>
                      {isSelected && (
                        <Check size={14} className="text-red-400 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Action: Add New Venue */}
          {onAddNewVenue && (
            <div className="p-2 border-t border-white/10 bg-white/[0.01]">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAddNewVenue();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-red-600/20 hover:text-red-300 text-onSurface text-xs font-semibold border border-white/10 transition"
              >
                <Plus size={13} className="text-red-400" />
                <span>Add New Venue</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
