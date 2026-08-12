import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Download,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Clapperboard,
} from "lucide-react";
import { Movie } from "../../types";
import { fetchAllMovies } from "../../services/movieApi";
import { fetchInventoryStats } from "../../services/dashboardApi";
import MovieFormModal from "../../components/movies/MovieFormModal";
import MovieTable from "../../components/movies/MovieTable";
import { mockMovies } from "../../mocks/movies";

const mockInventoryStats = {
  liveScreens: 8,
  avgOccupancyPct: 64,
  nextShowTime: "14:30",
};

const badgeOptions = ["IMAX", "4DX", "CineStar", "DOLBY", "2D"];

const PAGE_SIZE = 8;

export default function MovieManagement() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [inventoryStats, setInventoryStats] = useState(mockInventoryStats);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterBadge, setFilterBadge] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [query, setQuery] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAllMovies()
      .then(setMovies)
      .catch(() => setMovies(mockMovies));

    fetchInventoryStats()
      .then(setInventoryStats)
      .catch(() => setInventoryStats(mockInventoryStats));
  }, []);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      if (query && !m.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (filterBadge && m.badge !== filterBadge) return false;
      if (filterGenre) {
        const genres = m.genre
          ? m.genre.split("/").map((g) => g.trim().toLowerCase())
          : [];
        if (!genres.some((g) => g.includes(filterGenre.toLowerCase())))
          return false;
      }
      return true;
    });
  }, [movies, query, filterBadge, filterGenre]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedMovies = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const genres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.genre) {
        m.genre.split("/").forEach((g) => set.add(g.trim()));
      }
    });
    return Array.from(set).sort();
  }, [movies]);

  useEffect(() => {
    setPage(1);
  }, [query, filterBadge, filterGenre]);

  const handleSave = (movie: Movie) => {
    if (editingMovie) {
      setMovies((prev) => prev.map((m) => (m.id === movie.id ? movie : m)));
    } else {
      setMovies((prev) => [movie, ...prev]);
    }
    setEditingMovie(null);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowModal(true);
  };

  const handleDelete = (movie: Movie) => {
    if (window.confirm(`Delete "${movie.title}"?`)) {
      setMovies((prev) => prev.filter((m) => m.id !== movie.id));
    }
  };

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
      const allOnPage = paginatedMovies.every((m) => next.has(m.id));
      if (allOnPage) {
        paginatedMovies.forEach((m) => next.delete(m.id));
      } else {
        paginatedMovies.forEach((m) => next.add(m.id));
      }
      return next;
    });
  }

  function handleBulkEdit() {
    if (selectedIds.size === 1) {
      const movie = movies.find((m) => selectedIds.has(m.id));
      if (movie) {
        setEditingMovie(movie);
        setShowModal(true);
      }
    }
    setSelectedIds(new Set());
  }

  function handleBulkDelete() {
    if (
      window.confirm(`Delete ${selectedIds.size} selected movie(s)?`)
    ) {
      setMovies((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    }
    setSelectedIds(new Set());
  }

  const allOnPageSelected =
    paginatedMovies.length > 0 &&
    paginatedMovies.every((m) => selectedIds.has(m.id));

  return (
    <div className="h-full flex flex-col -m-4 md:-m-8 bg-surface text-onSurface">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
              <Clapperboard size={30} className="text-accent" />
              Movie Roster
            </h1>
            <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
              Manage the cinematic catalog. Filter by genre, update release
              status, or add new titles to the lineup.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mt-2">
              {filtered.length} of {movies.length} titles
            </p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-variant px-4 py-2 text-sm font-medium text-onSurface transition-colors hover:bg-surface-variant">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => {
                setEditingMovie(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-onSurface shadow-sm shadow-red-950 transition-colors hover:bg-red-500"
            >
              <Plus className="h-4 w-4" />
              Add Movie
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface-variant/60 p-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-onSurfaceVariant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-lg border border-white/10 bg-surface py-2 pl-9 pr-3 text-sm text-onSurface placeholder:text-onSurfaceVariant outline-none ring-red-600/40 focus:ring-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium transition-colors ${
                showFilter
                  ? "bg-red-600/20 text-red-400 ring-1 ring-inset ring-red-600/40"
                  : "bg-surface-variant text-onSurface hover:bg-surface-variant"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </button>
            {filterBadge && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-2 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-600/40">
                {filterBadge}
                <button onClick={() => setFilterBadge("")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterGenre && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-2 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-600/40">
                {filterGenre}
                <button onClick={() => setFilterGenre("")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Filter bar */}
        {showFilter && (
          <div className="mb-4 flex flex-wrap items-center gap-3 p-4 rounded-xl border border-white/10 bg-surface-variant/60">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-onSurfaceVariant whitespace-nowrap">
                Badge:
              </span>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setFilterBadge("")}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-medium transition-colors ${
                    !filterBadge
                      ? "bg-red-600/20 text-red-400 ring-1 ring-inset ring-red-600/40"
                      : "text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant"
                  }`}
                >
                  All
                </button>
                {badgeOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilterBadge(b === filterBadge ? "" : b)}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase font-medium transition-colors ${
                      filterBadge === b
                        ? "bg-red-600/20 text-red-400 ring-1 ring-inset ring-red-600/40"
                        : "text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-onSurfaceVariant whitespace-nowrap">
                Genre:
              </span>
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="bg-surface-variant border border-white/10 rounded px-3 py-1.5 text-xs text-onSurface outline-none focus:border-red-600/40 cursor-pointer"
              >
                <option value="">All</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {(filterBadge || filterGenre) && (
              <button
                onClick={() => {
                  setFilterBadge("");
                  setFilterGenre("");
                }}
                className="ml-auto px-3 py-1.5 rounded text-xs text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Selection action bar */}
        {selectedIds.size > 0 && (
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

        {/* Table */}
        <div>
          <MovieTable
            movies={paginatedMovies}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            allSelected={allOnPageSelected}
          />

          {/* Pagination + Stats */}
          <div className="flex items-center justify-between rounded-b-xl border border-t-0 border-white/10 px-4 py-3 text-xs text-onSurfaceVariant bg-surface-variant/40">
            <div className="flex items-center gap-4 flex-wrap">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} titles
              </span>
              <span className="hidden sm:inline text-onSurfaceVariant">|</span>
              <span className="hidden sm:inline">
                Live Screens:{" "}
                <span className="text-red-400 font-semibold">
                  {inventoryStats.liveScreens}
                </span>
              </span>
              <span className="hidden sm:inline text-onSurfaceVariant">|</span>
              <span className="hidden sm:inline">
                Avg Occupancy:{" "}
                <span className="text-onSurface font-semibold">
                  {inventoryStats.avgOccupancyPct}%
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md p-1.5 text-onSurfaceVariant hover:bg-surface-variant disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from(
                { length: Math.min(3, totalPages) },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-md text-xs font-medium ${
                    page === p
                      ? "bg-red-600 text-onSurface"
                      : "text-onSurfaceVariant hover:bg-surface-variant"
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && (
                <span className="px-1 text-onSurfaceVariant">&hellip;</span>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="rounded-md p-1.5 text-onSurfaceVariant hover:bg-surface-variant disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <MovieFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMovie(null);
        }}
        onSave={handleSave}
        editMovie={editingMovie}
      />
    </div>
  );
}
