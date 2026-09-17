import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Table2,
  Plus,
  Search,
  Ticket,
  Users2,
  AlertTriangle,
  LayoutGrid,
  Check,
  Pencil,
  Trash2,
  X,
  Clock,
  Film,
  Building2,
  MapPin,
} from "lucide-react";
import ShowtimeStatCard from "../../components/admin/ShowtimeStatCard";
import ShowtimeRow, { ShowtimeRowData } from "../../components/admin/ShowtimeRow";
import ShowtimeFormModal from "../../components/showtimes/ShowtimeFormModal";
import { allShowtimeRows } from "../../mocks/showtimes";
import { mockMovies } from "../../mocks/movies";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { fetchAllMovies } from "../../services/movieApi";
import { fetchTheaterVenues } from "../../services/theaterApi";
import { Movie, TheaterVenue } from "../../types";

const STORAGE_KEY = "cinestar_admin_static_showtimes_v2";
const MOVIES_CACHE_KEY = "cinestar_admin_cached_movies";

const FALLBACK_VENUES: TheaterVenue[] = [
  {
    id: "v-001",
    name: "CineStar Grand Mall",
    address: "Level 4, Grand Mall, Monivong Blvd, Phnom Penh",
    status: "Active",
    hallCount: 6,
    capacity: 720,
    formats: ["IMAX", "4DX", "DOLBY", "2D"],
  },
  {
    id: "v-002",
    name: "CineStar Riverside IMAX",
    address: "Preah Sisowath Quay, Phnom Penh",
    status: "Active",
    hallCount: 4,
    capacity: 480,
    formats: ["IMAX", "4DX", "2D"],
  },
  {
    id: "v-003",
    name: "CineStar City Center",
    address: "Russian Federation Blvd, Phnom Penh",
    status: "Active",
    hallCount: 3,
    capacity: 360,
    formats: ["DOLBY", "2D"],
  },
];

function loadInitialShowtimes(): ShowtimeRowData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return allShowtimeRows;
}

export default function ShowtimeManager() {
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role === "admin" || admin?.email?.toLowerCase() === "admin@gmail.com";

  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedMovieId = searchParams.get("movieId") || "";
  const autoOpenAdd = searchParams.get("openAdd") === "true";

  const [view, setView] = useState<"table" | "calendar">("table");
  const [allShowtimes, setAllShowtimes] = useState<ShowtimeRowData[]>(loadInitialShowtimes);
  const [venues, setVenues] = useState<TheaterVenue[]>(FALLBACK_VENUES);
  const [selectedVenueId, setSelectedVenueId] = useState<string>(
    searchParams.get("venueId") || FALLBACK_VENUES[0].id
  );

  const [page, setPage] = useState(1);
  const pageSize = 4;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTheater, setFilterTheater] = useState("All Halls");
  const [filterFormat, setFilterFormat] = useState("All Formats");
  const [showModal, setShowModal] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeRowData | null>(null);

  const selectedVenue = venues.find((v) => v.id === selectedVenueId) || venues[0];

  // Load venues on mount
  useEffect(() => {
    fetchTheaterVenues()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVenues(data);
          setSelectedVenueId((prev) => {
            const urlVenueId = searchParams.get("venueId");
            if (urlVenueId && data.some((v) => v.id === urlVenueId)) return urlVenueId;
            if (prev && prev !== "all" && data.some((v) => v.id === prev)) return prev;
            return data[0].id;
          });
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch theater venues in showtime manager:", err);
      });
  }, [searchParams]);

  // Update venue from URL query if user navigates with ?venueId=...
  useEffect(() => {
    const vId = searchParams.get("venueId");
    if (vId) {
      setSelectedVenueId(vId);
      setFilterTheater("All Halls");
    }
  }, [searchParams]);

  // Dynamic movie list loaded from Movie Management
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const cached = localStorage.getItem(MOVIES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return mockMovies;
  });
  const [loadingMovies, setLoadingMovies] = useState(false);

  const refreshMovies = async () => {
    try {
      setLoadingMovies(true);
      const res = await fetchAllMovies();
      if (Array.isArray(res) && res.length > 0) {
        setMovies(res);
        try {
          localStorage.setItem(MOVIES_CACHE_KEY, JSON.stringify(res));
        } catch {}
      }
    } catch (err) {
      console.warn("Failed to fetch movies from API in showtime manager:", err);
      try {
        const cached = localStorage.getItem(MOVIES_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) setMovies(parsed);
        }
      } catch {}
    } finally {
      setLoadingMovies(false);
    }
  };

  useEffect(() => {
    refreshMovies();

    const onMoviesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Movie[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setMovies(customEvent.detail);
      } else {
        refreshMovies();
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === MOVIES_CACHE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) setMovies(parsed);
        } catch {}
      }
    };

    window.addEventListener("cinestar:movies-updated", onMoviesUpdated);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refreshMovies);

    return () => {
      window.removeEventListener("cinestar:movies-updated", onMoviesUpdated);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refreshMovies);
    };
  }, []);

  // Handle direct navigation from Movie Management (?movieId=...&openAdd=true)
  useEffect(() => {
    if (autoOpenAdd && isAdmin) {
      setEditingShowtime(null);
      setShowModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [autoOpenAdd, isAdmin, setSearchParams]);

  // Synchronize state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allShowtimes));
    } catch {}
  }, [allShowtimes]);

  const theaterOptions = useMemo(() => {
    if (selectedVenue) {
      const hallsSet = new Set<string>();
      if (selectedVenue.halls) {
        selectedVenue.halls.forEach((h) => hallsSet.add(h.name));
      }
      allShowtimes.forEach((r) => {
        if (
          r.venueId === selectedVenue.id ||
          r.theaterName.toLowerCase() === selectedVenue.name.toLowerCase()
        ) {
          if (r.hall) hallsSet.add(r.hall);
        }
      });
      return ["All Halls", ...Array.from(hallsSet)];
    }

    return ["All Halls"];
  }, [selectedVenue, allShowtimes]);

  const formatOptions = useMemo(() => [
    "All Formats",
    "IMAX",
    "4DX",
    "DOLBY",
    "2D",
    "STANDARD",
  ], []);

  // Compute live stats scoped to selected theater
  const scopedShowtimes = useMemo(() => {
    if (!selectedVenue) return allShowtimes;
    return allShowtimes.filter(
      (r) =>
        r.venueId === selectedVenue.id ||
        (selectedVenue.name && r.theaterName?.toLowerCase() === selectedVenue.name.toLowerCase())
    );
  }, [allShowtimes, selectedVenue]);

  const stats = useMemo(() => {
    const todaysShows = scopedShowtimes.filter(
      (r) => r.timeLabel === "Today" || r.timeLabel?.toLowerCase().includes("today")
    ).length;
    const totalFilled = scopedShowtimes.reduce((acc, r) => acc + (r.seatsFilled || 0), 0);
    const totalSeats = scopedShowtimes.reduce((acc, r) => acc + (r.seatsTotal || 120), 0);
    const totalCapacityPct = totalSeats > 0 ? Math.round((totalFilled / totalSeats) * 100) : 72;
    const conflicts = scopedShowtimes.filter((r) => r.status === "CONFLICT").length;
    const activeHalls = new Set(scopedShowtimes.map((r) => r.hall)).size;

    return {
      todaysShows: todaysShows || (scopedShowtimes.length > 0 ? 1 : 0),
      totalCapacityPct,
      conflicts,
      activeHalls: activeHalls || (selectedVenue?.hallCount ?? 4),
    };
  }, [scopedShowtimes, selectedVenue]);

  // Client-side instant filter and search
  const filteredRows = useMemo(() => {
    return allShowtimes.filter((r) => {
      // 1. Theater venue filter (strictly scoped to selected theater)
      if (selectedVenue) {
        const matchesVenue =
          r.venueId === selectedVenue.id ||
          (selectedVenue.name && r.theaterName?.toLowerCase() === selectedVenue.name.toLowerCase());
        if (!matchesVenue) return false;
      }

      // 2. Search query
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.hall && r.hall.toLowerCase().includes(q)) ||
        (r.theaterName && r.theaterName.toLowerCase().includes(q)) ||
        (r.genre && r.genre.toLowerCase().includes(q)) ||
        (r.format && r.format.toLowerCase().includes(q)) ||
        (r.time && r.time.toLowerCase().includes(q));

      // 3. Hall dropdown filter
      const matchTheater =
        filterTheater === "All Halls" ||
        filterTheater === "All Theaters" ||
        r.hall === filterTheater;

      // 4. Format filter
      const matchFormat =
        filterFormat === "All Formats" ||
        r.format.toUpperCase() === filterFormat.toUpperCase();

      return matchSearch && matchTheater && matchFormat;
    });
  }, [allShowtimes, selectedVenue, searchQuery, filterTheater, filterFormat]);

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allOnPage = paginatedRows.every((r) => next.has(r.id));
      if (allOnPage) {
        paginatedRows.forEach((r) => next.delete(r.id));
      } else {
        paginatedRows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  }

  function handleBulkEdit() {
    if (!isAdmin) return;
    if (selectedIds.size === 1) {
      const selected = allShowtimes.find((r) => selectedIds.has(r.id));
      if (selected) {
        setEditingShowtime(selected);
        setShowModal(true);
      }
    }
    setSelectedIds(new Set());
  }

  function handleBulkDelete() {
    if (!isAdmin) return;
    if (window.confirm(`Delete ${selectedIds.size} selected showtime(s)?`)) {
      setAllShowtimes((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
    }
  }

  function handleAddShowtime(targetVenueId?: string) {
    if (!isAdmin) return;
    refreshMovies();
    setEditingShowtime(null);
    const chosenVenueId = targetVenueId || selectedVenue?.id || selectedVenueId;
    if (chosenVenueId && typeof chosenVenueId === "string") {
      setSelectedVenueId(chosenVenueId);
    }
    setShowModal(true);
  }

  function handleEditRow(data: ShowtimeRowData) {
    if (!isAdmin) return;
    setEditingShowtime(data);
    setShowModal(true);
  }

  function handleSaveShowtime(data: ShowtimeRowData) {
    if (!isAdmin) return;
    if (editingShowtime) {
      setAllShowtimes((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    } else {
      setAllShowtimes((prev) => [data, ...prev]);
      setPage(1);
    }
    setEditingShowtime(null);
  }

  function handleDeleteRow(data: ShowtimeRowData) {
    if (!isAdmin) return;
    if (window.confirm(`Delete showtime for "${data.title}" at ${data.time}?`)) {
      setAllShowtimes((prev) => prev.filter((r) => r.id !== data.id));
    }
  }

  const allOnPageSelected =
    paginatedRows.length > 0 && paginatedRows.every((r) => selectedIds.has(r.id));

  // Calendar dates calculation (7 days starting today)
  const calendarDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const label =
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        dateObj: d,
        label,
        dateStr,
        isToday: i === 0,
        dayIndex: i,
      };
    });
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
              <CalendarIcon size={30} className="text-accent" />
              Showtimes
            </h1>
            {!isAdmin && (
              <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                Staff (View-Only)
              </span>
            )}
          </div>
          <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
            {isAdmin
              ? "Manage scheduling, resolve conflicts, and optimize hall utilization across all cinema venues."
              : "View scheduled showtimes, calendar, and hall availability. Showtime creation and scheduling are restricted to Administrators."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex bg-surface-variant rounded overflow-hidden border border-white/10">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-body transition-colors ${
                view === "table" ? "bg-white/10 text-onSurface font-semibold" : "text-onSurfaceVariant hover:text-onSurface"
              }`}
            >
              <Table2 size={15} />
              Table
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-body transition-colors ${
                view === "calendar" ? "bg-white/10 text-onSurface font-semibold" : "text-onSurfaceVariant hover:text-onSurface"
              }`}
            >
              <CalendarIcon size={15} />
              Calendar
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => handleAddShowtime(selectedVenue?.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-accent text-onSurface text-sm font-body font-semibold hover:brightness-110 transition shadow"
            >
              <Plus size={15} />
              Add Showtime
            </button>
          )}
        </div>
      </div>

      {/* Theater (Venue) Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono uppercase text-onSurfaceVariant flex items-center gap-1.5">
            <Building2 size={14} className="text-accent" />
            Cinema Venue / Theater
          </label>
          <span className="text-xs text-onSurfaceVariant/70 font-mono">
            {venues.length} Venues Active
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {venues.map((venue) => {
            const isSelected = (selectedVenue?.id || selectedVenueId) === venue.id;
            const venueShowsCount = allShowtimes.filter(
              (r) => r.venueId === venue.id || r.theaterName.toLowerCase() === venue.name.toLowerCase()
            ).length;

            return (
              <button
                key={venue.id}
                type="button"
                onClick={() => {
                  setSelectedVenueId(venue.id);
                  setFilterTheater("All Halls");
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium font-body flex items-center gap-2 transition-all shrink-0 border ${
                  isSelected
                    ? "bg-accent/20 border-accent/50 text-accent font-semibold shadow-sm shadow-accent/20"
                    : "bg-surface-variant/60 border-white/10 text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant"
                }`}
              >
                <Building2 size={14} />
                <span>{venue.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? "bg-accent/30 text-accent font-bold" : "bg-white/10 text-onSurfaceVariant"
                }`}>
                  {venueShowsCount} shows
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Theater Highlight Card */}
        {selectedVenue && (
          <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 shrink-0">
                <Building2 size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-heading font-bold text-base text-onSurface">
                    {selectedVenue.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-500/15 border border-green-500/30 text-green-400">
                    Active Theater
                  </span>
                </div>
                <p className="text-xs text-onSurfaceVariant flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-onSurfaceVariant/70 shrink-0" />
                  <span>{selectedVenue.address || "Cinema Branch"}</span>
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[11px] font-mono text-onSurfaceVariant">
                    {selectedVenue.hallCount || 4} Halls configured
                  </span>
                  {selectedVenue.formats && selectedVenue.formats.map((f) => (
                    <span key={f} className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white/10 text-onSurfaceVariant">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ShowtimeStatCard
          label="Today's Shows"
          value={String(stats.todaysShows)}
          icon={<Ticket size={18} />}
        />
        <ShowtimeStatCard
          label="Total Capacity"
          value={`${stats.totalCapacityPct}%`}
          icon={<Users2 size={18} />}
        />
        <ShowtimeStatCard
          label="Conflicts"
          value={String(stats.conflicts)}
          icon={<AlertTriangle size={18} />}
          tone="warning"
        />
        <ShowtimeStatCard
          label="Active Halls"
          value={String(stats.activeHalls)}
          icon={<LayoutGrid size={18} />}
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
          />
          <input
            placeholder="Search movie, hall, format, time..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface-variant border border-white/10 rounded pl-9 pr-4 py-2.5 text-sm text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition"
          />
        </div>
        <select
          value={filterTheater}
          onChange={(e) => {
            setFilterTheater(e.target.value);
            setPage(1);
          }}
          className="bg-surface-variant border border-white/10 rounded px-4 py-2.5 text-sm text-onSurface outline-none cursor-pointer"
        >
          {theaterOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={filterFormat}
          onChange={(e) => {
            setFilterFormat(e.target.value);
            setPage(1);
          }}
          className="bg-surface-variant border border-white/10 rounded px-4 py-2.5 text-sm text-onSurface outline-none cursor-pointer"
        >
          {formatOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Selection action bar */}
      {isAdmin && selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3">
          <span className="text-sm font-medium text-red-300">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto rounded-md p-1 text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant"
          >
            <X className="h-4 w-4" />
          </button>
          {selectedIds.size === 1 && (
            <button
              onClick={handleBulkEdit}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-variant px-3 py-2 text-xs font-medium text-onSurface transition-colors hover:bg-surface-variant"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-600/20 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-600/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete{selectedIds.size > 1 ? ` (${selectedIds.size})` : ""}
          </button>
        </div>
      )}

      {/* Table View */}
      {view === "table" ? (
        <div className="bg-surface-variant rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-onSurfaceVariant text-xs font-mono uppercase tracking-wider">
                <th className="py-3 pl-6 w-12">
                  {isAdmin ? (
                    <button
                      onClick={toggleSelectAll}
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        allOnPageSelected
                          ? "border-accent bg-accent text-onSurface"
                          : "border-white/20 bg-surface-variant hover:border-white/40"
                      }`}
                    >
                      {allOnPageSelected && <Check className="h-3 w-3" />}
                    </button>
                  ) : (
                    <span className="text-white/20 text-xs font-mono">•</span>
                  )}
                </th>
                <th className="py-3 font-medium">Movie</th>
                <th className="font-medium">Theater &amp; Hall</th>
                <th className="font-medium">Time</th>
                <th className="font-medium">Format</th>
                <th className="font-medium">Seats</th>
                <th className="font-medium pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="px-6">
              {paginatedRows.map((row) => (
                <ShowtimeRow
                  key={row.id}
                  data={row}
                  selected={isAdmin && selectedIds.has(row.id)}
                  onToggleSelect={isAdmin ? () => toggleSelect(row.id) : undefined}
                  onEdit={isAdmin ? handleEditRow : undefined}
                  onDelete={isAdmin ? handleDeleteRow : undefined}
                />
              ))}
              {paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-onSurfaceVariant text-sm">
                    No showtimes match your filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-onSurfaceVariant text-xs font-mono">
              {totalCount > 0
                ? `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(
                    currentPage * pageSize,
                    totalCount
                  )} of ${totalCount}`
                : "0 of 0"}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5 disabled:opacity-30 transition"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono transition ${
                    currentPage === p
                      ? "bg-accent text-onSurface font-bold"
                      : "text-onSurfaceVariant hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5 disabled:opacity-30 transition"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-surface-variant rounded-xl border border-white/10 p-5">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {calendarDays.map((day) => {
              // Map static showtimes across days
              const dayShows = scopedShowtimes.filter((r) => {
                if (day.isToday) {
                  return r.timeLabel === "Today" || r.timeLabel?.toLowerCase().includes("today");
                }
                if (day.dayIndex === 1) {
                  return r.timeLabel === "Tomorrow" || r.timeLabel === "Aug 4";
                }
                return r.timeLabel === day.dateStr || r.timeLabel === "Aug 5";
              });

              return (
                <div
                  key={day.dateStr}
                  className={`rounded-xl border p-3 min-h-[260px] flex flex-col ${
                    day.isToday
                      ? "border-accent/60 bg-accent/5"
                      : "border-white/10 bg-black/20"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-wider ${
                          day.isToday ? "text-accent" : "text-onSurface"
                        }`}
                      >
                        {day.label}
                      </p>
                      <p className="text-[11px] text-onSurfaceVariant font-mono">
                        {day.dateStr}
                      </p>
                    </div>
                    {day.isToday && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-accent text-onSurface">
                        TODAY
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    {dayShows.map((show) => {
                      const CardWrapper = isAdmin ? "button" : "div";
                      return (
                        <CardWrapper
                          key={show.id}
                          {...(isAdmin ? { type: "button", onClick: () => handleEditRow(show) } : {})}
                          className={`p-2 rounded-lg bg-surface border border-white/10 text-left transition ${
                            isAdmin ? "hover:border-accent group cursor-pointer" : "cursor-default"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-mono font-bold text-accent flex items-center gap-1">
                              <Clock size={11} />
                              {show.time}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white/10 text-onSurfaceVariant uppercase">
                              {show.format}
                            </span>
                          </div>
                          <p className={`text-xs font-semibold text-onSurface truncate ${isAdmin ? "group-hover:text-accent transition-colors" : ""}`}>
                            {show.title}
                          </p>
                          <p className="text-[10px] text-onSurfaceVariant font-mono mt-0.5 flex items-center gap-1 truncate">
                            <Film size={10} className="shrink-0" />
                            <span className="truncate">{show.theaterName ? `${show.theaterName} • ${show.hall}` : show.hall}</span>
                          </p>
                        </CardWrapper>
                      );
                    })}
                    {dayShows.length === 0 && (
                      <div className="flex-1 flex items-center justify-center text-center p-3 text-[11px] text-onSurfaceVariant">
                        No screenings
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Showtime Modal */}
      <ShowtimeFormModal
        open={showModal && isAdmin}
        onClose={() => {
          setShowModal(false);
          setEditingShowtime(null);
        }}
        onSave={handleSaveShowtime}
        editData={editingShowtime}
        movies={movies}
        isLoadingMovies={loadingMovies}
        initialMovieId={preselectedMovieId || undefined}
        venues={venues}
        defaultVenueId={selectedVenue?.id || selectedVenueId}
      />
    </div>
  );
}
