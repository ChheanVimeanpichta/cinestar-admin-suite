import { useEffect, useState } from "react";
import { X, Calendar, Clock, Building2, LayoutGrid, DollarSign, Film } from "lucide-react";
import { Movie, TheaterVenue, TheaterHall } from "../../types";
import { ShowtimeRowData } from "../admin/ShowtimeRow";
import { fetchHallsForVenue } from "../../services/theaterApi";

interface ShowtimeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ShowtimeRowData) => void;
  editData?: ShowtimeRowData | null;
  movies: Movie[];
  isLoadingMovies?: boolean;
  initialMovieId?: string;
  venues?: TheaterVenue[];
  defaultVenueId?: string | null;
}

const formatOptions = ["IMAX", "4DX", "DOLBY", "2D", "STANDARD"];

const FALLBACK_VENUES: TheaterVenue[] = [
  {
    id: "v-001",
    name: "CineStar Downtown",
    address: "Level 4, Monivong Blvd, Phnom Penh",
    status: "Active",
    hallCount: 4,
    capacity: 720,
    formats: ["IMAX", "4DX", "DOLBY", "2D"],
  },
  {
    id: "v-002",
    name: "CineStar Riverside",
    address: "Preah Sisowath Quay, Phnom Penh",
    status: "Active",
    hallCount: 2,
    capacity: 240,
    formats: ["DOLBY", "VIP"],
  },
  {
    id: "v-003",
    name: "CineStar Westgate",
    address: "Russian Federation Blvd, Phnom Penh",
    status: "Active",
    hallCount: 2,
    capacity: 220,
    formats: ["STANDARD", "2D"],
  },
  {
    id: "v-1788767915971",
    name: "Cinestar Olypia Mall",
    address: "Monireth blvd, Veal Vong Street, Phnom Penh",
    status: "Active",
    hallCount: 3,
    capacity: 340,
    formats: ["2D", "STANDARD"],
  },
];

const FALLBACK_HALLS: Record<string, TheaterHall[]> = {
  "v-001": [
    { id: "th-hall-1", venueId: "v-001", name: "Hall 1 - Standard", screenType: "STANDARD", soundSystem: "Dolby Atmos", capacity: 150, status: "Active" },
    { id: "th-hall-2", venueId: "v-001", name: "Hall 2 - Standard", screenType: "STANDARD", soundSystem: "Dolby Atmos", capacity: 140, status: "Active" },
    { id: "th-hall-3", venueId: "v-001", name: "Hall 3 - IMAX", screenType: "IMAX", soundSystem: "Dolby Atmos", capacity: 180, status: "Active" },
    { id: "th-hall-4", venueId: "v-001", name: "Hall 4 - 4DX", screenType: "4DX", soundSystem: "Dolby Atmos", capacity: 120, status: "Active" },
  ],
  "v-002": [
    { id: "th-hall-5", venueId: "v-002", name: "Hall 5 - VIP Lounge", screenType: "STANDARD", soundSystem: "Dolby Atmos", capacity: 100, status: "Active" },
    { id: "th-hall-6", venueId: "v-002", name: "Hall 6 - Dolby Atmos", screenType: "DOLBY", soundSystem: "Dolby Atmos", capacity: 140, status: "Active" },
  ],
  "v-003": [
    { id: "th-hall-7", venueId: "v-003", name: "Hall 7 - ScreenX", screenType: "STANDARD", soundSystem: "THX Certified", capacity: 120, status: "Active" },
    { id: "th-hall-8", venueId: "v-003", name: "Hall 8 - Laser 2D", screenType: "2D", soundSystem: "THX Certified", capacity: 100, status: "Active" },
  ],
  "v-1788767915971": [
    { id: "h-1788768009783", venueId: "v-1788767915971", name: "Hall 6 - 2D", screenType: "2D", soundSystem: "Dolby Atmos", capacity: 100, status: "Active" },
    { id: "h-1788866998828", venueId: "v-1788767915971", name: "Hall 1 - 2D", screenType: "2D", soundSystem: "THX Certified", capacity: 120, status: "Active" },
    { id: "h-1788867016383", venueId: "v-1788767915971", name: "Hall 1 - Standard", screenType: "STANDARD", soundSystem: "Dolby Atmos", capacity: 120, status: "Active" },
  ],
};

export default function ShowtimeFormModal({
  open,
  onClose,
  onSave,
  editData,
  movies,
  isLoadingMovies = false,
  initialMovieId,
  venues = [],
  defaultVenueId,
}: ShowtimeFormModalProps) {
  const activeVenues = venues.length > 0 ? venues : FALLBACK_VENUES;

  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [venueId, setVenueId] = useState<string>("");
  const [halls, setHalls] = useState<TheaterHall[]>([]);
  const [loadingHalls, setLoadingHalls] = useState(false);
  const [hallName, setHallName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [format, setFormat] = useState("2D");
  const [price, setPrice] = useState<number>(12);
  const [seatsTotal, setSeatsTotal] = useState<number>(120);

  const isEditing = !!editData;

  useEffect(() => {
    if (!open) return;

    if (editData) {
      const matchedVenue = activeVenues.find(
        (v) => v.id === editData.venueId || v.name.toLowerCase() === editData.theaterName?.toLowerCase()
      );
      const initialVenue = matchedVenue || activeVenues[0];
      setVenueId(initialVenue?.id || "v-001");

      setHallName(editData.hall || "Hall 1");
      setTime(editData.time || "18:00");
      setFormat(editData.format || "2D");
      setPrice(12);
      setSeatsTotal(editData.seatsTotal || 120);

      const movie = movies.find((m) => m.title === editData.title);
      if (movie) setSelectedMovieId(movie.id);

      setDate(new Date().toISOString().slice(0, 10));
    } else {
      const initialVId = defaultVenueId && activeVenues.some((v) => v.id === defaultVenueId)
        ? defaultVenueId
        : activeVenues[0]?.id || "v-001";

      setVenueId(initialVId);
      setSelectedMovieId(initialMovieId || (movies[0]?.id ?? ""));
      setDate(new Date().toISOString().slice(0, 10));
      setTime("18:30");
      setPrice(12);
    }
  }, [editData, open, defaultVenueId, initialMovieId]);

  useEffect(() => {
    if (!venueId) return;

    let isMounted = true;
    const loadHalls = async () => {
      setLoadingHalls(true);
      try {
        const foundVenue = activeVenues.find((v) => v.id === venueId);
        if (foundVenue?.halls && foundVenue.halls.length > 0) {
          if (isMounted) {
            setHalls(foundVenue.halls);
            applyDefaultHall(foundVenue.halls);
          }
          return;
        }

        const apiHalls = await fetchHallsForVenue(venueId);
        if (isMounted) {
          const list = apiHalls.length > 0 ? apiHalls : (FALLBACK_HALLS[venueId] || []);
          setHalls(list);
          applyDefaultHall(list);
        }
      } catch {
        if (isMounted) {
          const list = FALLBACK_HALLS[venueId] || [];
          setHalls(list);
          applyDefaultHall(list);
        }
      } finally {
        if (isMounted) setLoadingHalls(false);
      }
    };

    const applyDefaultHall = (hallList: TheaterHall[]) => {
      if (hallList.length === 0) return;
      if (editData && hallList.some((h) => h.name === editData.hall)) {
        setHallName(editData.hall);
        const matched = hallList.find((h) => h.name === editData.hall);
        if (matched) {
          setSeatsTotal(matched.capacity || 120);
        }
      } else {
        const first = hallList[0];
        setHallName(first.name);
        setSeatsTotal(first.capacity || 120);
        if (first.screenType && formatOptions.includes(first.screenType.toUpperCase())) {
          setFormat(first.screenType.toUpperCase());
        }
      }
    };

    loadHalls();

    return () => {
      isMounted = false;
    };
  }, [venueId]);

  const handleVenueChange = (newVenueId: string) => {
    setVenueId(newVenueId);
  };

  const handleHallChange = (newHallName: string) => {
    setHallName(newHallName);
    const matched = halls.find((h) => h.name === newHallName);
    if (matched) {
      setSeatsTotal(matched.capacity || 120);
      if (matched.screenType && formatOptions.includes(matched.screenType.toUpperCase())) {
        setFormat(matched.screenType.toUpperCase());
      }
    }
  };

  const handleMovieSelect = (movieId: string) => {
    setSelectedMovieId(movieId);
    const movie = movies.find((m) => m.id === movieId);
    if (movie?.badge && formatOptions.includes(movie.badge.toUpperCase())) {
      setFormat(movie.badge.toUpperCase());
    }
  };

  if (!open) return null;

  const selectedMovie = movies.find((m) => m.id === selectedMovieId);
  const selectedVenue = activeVenues.find((v) => v.id === venueId) || activeVenues[0];

  function computeTimeLabel(dateStr: string): string {
    if (!dateStr) return "";
    const today = new Date().toISOString().slice(0, 10);
    if (dateStr === today) return "Today";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie || !date || !time) return;

    const currentHall = halls.find((h) => h.name === hallName);
    const showtime: ShowtimeRowData = {
      id: editData?.id || `sc-${Date.now()}`,
      movieId: selectedMovie.id,
      posterUrl: selectedMovie.poster || "",
      title: selectedMovie.title,
      durationMins: selectedMovie.durationMins || 120,
      genre: selectedMovie.genre || "",
      theaterName: selectedVenue?.name || "Cinema Venue",
      venueId: selectedVenue?.id,
      venueName: selectedVenue?.name,
      hall: hallName || "Hall 1",
      hallId: currentHall?.id,
      time,
      timeLabel: computeTimeLabel(date),
      date,
      format,
      seatsFilled: editData?.seatsFilled || 0,
      seatsTotal: currentHall?.capacity || seatsTotal || 120,
      status: editData?.status || "ON SALE",
    };
    onSave(showtime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-surface border border-white/10 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="font-heading font-bold text-xl text-onSurface uppercase tracking-wide">
              {isEditing ? "Edit Showtime" : "New Showtime"}
            </h2>
            <p className="font-mono text-[10px] text-onSurfaceVariant mt-1 uppercase tracking-wide">
              {isEditing
                ? `Editing: ${editData?.title}`
                : "Schedule a screening in a theater hall"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Movie selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">
                Movie (From Movie Management)
              </label>
              <span className="font-mono text-[10px] text-accent font-semibold">
                {isLoadingMovies ? "Loading..." : `${movies.length} Available`}
              </span>
            </div>
            <select
              value={selectedMovieId}
              onChange={(e) => handleMovieSelect(e.target.value)}
              required
              disabled={isLoadingMovies && movies.length === 0}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors cursor-pointer disabled:opacity-50"
            >
              <option value="" className="bg-surface">
                {isLoadingMovies && movies.length === 0
                  ? "Loading movies from catalog..."
                  : "Select a movie..."}
              </option>
              {movies.map((m) => (
                <option key={m.id} value={m.id} className="bg-surface">
                  {m.title} {m.durationMins ? `(${m.durationMins}m)` : ""} {m.badge ? `[${m.badge}]` : ""}
                </option>
              ))}
            </select>

            {/* Visual Movie Preview Card */}
            {selectedMovie && (
              <div className="mt-3 p-3 bg-white/[0.04] border border-white/10 rounded-lg flex items-center gap-3">
                {selectedMovie.poster ? (
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-12 h-16 object-cover rounded border border-white/10 shrink-0 bg-surface shadow"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-16 bg-white/10 rounded flex items-center justify-center text-[10px] text-onSurfaceVariant shrink-0">
                    No Poster
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-heading font-semibold text-sm text-onSurface truncate">
                      {selectedMovie.title}
                    </h4>
                    {selectedMovie.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/20 text-accent border border-accent/30">
                        {selectedMovie.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-onSurfaceVariant mt-1">
                    {selectedMovie.genre || "General"} &bull;{" "}
                    {selectedMovie.durationMins ? `${selectedMovie.durationMins} MIN` : "120 MIN"}
                    {selectedMovie.score != null && ` • ⭐ ${selectedMovie.score}`}
                  </p>
                  {selectedMovie.releaseDate && (
                    <p className="font-mono text-[10px] text-onSurfaceVariant/70 mt-0.5">
                      Release Date: {selectedMovie.releaseDate}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theater (Venue) Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant flex items-center gap-1.5">
                <Building2 size={13} className="text-accent" />
                Theater (Cinema Venue) *
              </label>
              <span className="text-[11px] font-mono text-onSurfaceVariant">
                {activeVenues.length} Venues
              </span>
            </div>
            <select
              value={venueId}
              onChange={(e) => handleVenueChange(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-onSurface outline-none focus:border-accent transition-colors cursor-pointer"
            >
              {activeVenues.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#1a1a1a] text-onSurface">
                  {v.name} ({v.hallCount || 0} Halls)
                </option>
              ))}
            </select>
            {selectedVenue && (
              <p className="text-[11px] text-onSurfaceVariant/70 mt-1 pl-0.5 truncate">
                📍 {selectedVenue.address || "Cinema branch"}
              </p>
            )}
          </div>

          {/* Hall & Screen Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase text-onSurfaceVariant flex items-center gap-1.5">
                  <LayoutGrid size={13} className="text-accent" />
                  Cinema Hall in Venue *
                </label>
                {loadingHalls && (
                  <span className="text-[10px] text-accent font-mono animate-pulse">Loading...</span>
                )}
              </div>
              <select
                value={hallName}
                onChange={(e) => handleHallChange(e.target.value)}
                required
                disabled={loadingHalls || halls.length === 0}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-onSurface outline-none focus:border-accent transition-colors cursor-pointer disabled:opacity-50"
              >
                {halls.length === 0 ? (
                  <option value="" className="bg-[#1a1a1a]">No halls configured</option>
                ) : (
                  halls.map((h) => (
                    <option key={h.id} value={h.name} className="bg-[#1a1a1a]">
                      {h.name} ({h.capacity} seats • {h.screenType})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5 flex items-center gap-1.5">
                <Film size={13} className="text-accent" />
                Screen Format *
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-onSurface outline-none focus:border-accent transition-colors cursor-pointer"
              >
                {formatOptions.map((f) => (
                  <option key={f} value={f} className="bg-[#1a1a1a]">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-accent" />
                Screening Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-onSurface outline-none focus:border-accent transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5 flex items-center gap-1.5">
                <Clock size={13} className="text-accent" />
                Start Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-onSurface outline-none focus:border-accent transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5 flex items-center gap-1.5">
                <DollarSign size={13} className="text-accent" />
                Ticket Price (USD) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value ? parseFloat(e.target.value) : 0)
                }
                min="0"
                step="0.5"
                required
                placeholder="12"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-onSurfaceVariant mb-1.5">
                Hall Capacity (Seats)
              </label>
              <input
                type="number"
                value={seatsTotal}
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-lg px-3.5 py-2.5 text-sm text-onSurface/70 outline-none cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded font-body text-sm text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-accent text-onSurface font-body font-semibold text-sm hover:brightness-110 transition"
            >
              {isEditing ? "Save Changes" : "Add Showtime"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
