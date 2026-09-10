import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Clapperboard,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Movie } from "../../types";
import {
  fetchAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  bulkDeleteMovies,
} from "../../services/movieApi";
import { fetchInventoryStats } from "../../services/dashboardApi";
import MovieFormModal from "../../components/movies/MovieFormModal";
import MovieTable, { isMovieUpcoming } from "../../components/movies/MovieTable";
import { mockMovies } from "../../mocks/movies";
import { useAdminAuth } from "../../context/AdminAuthContext";

const MOVIES_CACHE_KEY = "cinestar_admin_cached_movies";

export function broadcastMoviesUpdated(moviesList: Movie[]) {
  try {
    localStorage.setItem(MOVIES_CACHE_KEY, JSON.stringify(moviesList));
    window.dispatchEvent(new CustomEvent("cinestar:movies-updated", { detail: moviesList }));
  } catch {}
}

const mockInventoryStats = {
  liveScreens: 8,
  avgOccupancyPct: 64,
  nextShowTime: "14:30",
};

const badgeOptions = ["IMAX", "4DX", "CineStar", "DOLBY", "2D"];

const PAGE_SIZE = 8;

export default function MovieManagement() {
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role === "admin" || admin?.email?.toLowerCase() === "admin@gmail.com";

  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [inventoryStats, setInventoryStats] = useState(mockInventoryStats);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterBadge, setFilterBadge] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "now-showing" | "coming-soon">("");
  const [query, setQuery] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Dynamic async states
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete modal state (styled identically to Users page)
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Bulk delete modal state
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isSubmittingBulkDelete, setIsSubmittingBulkDelete] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState("");

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [moviesResult, statsResult] = await Promise.allSettled([
        fetchAllMovies(),
        fetchInventoryStats(),
      ]);

      if (moviesResult.status === "fulfilled") {
        setMovies(moviesResult.value);
        broadcastMoviesUpdated(moviesResult.value);
      } else {
        console.warn("Failed to fetch movies from API, using fallback:", moviesResult.reason);
        try {
          const cached = localStorage.getItem(MOVIES_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMovies(parsed);
              return;
            }
          }
        } catch {}
        setMovies(mockMovies);
      }

      if (statsResult.status === "fulfilled") {
        setInventoryStats(statsResult.value);
      }
    } catch (err: any) {
      console.warn("Failed to fetch movie data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();

    const interval = setInterval(() => {
      fetchInventoryStats().then(setInventoryStats).catch(() => {});
    }, 15000);

    const onFocus = () => {
      fetchInventoryStats().then(setInventoryStats).catch(() => {});
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

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
      if (filterStatus === "coming-soon" && !isMovieUpcoming(m.releaseDate))
        return false;
      if (filterStatus === "now-showing" && isMovieUpcoming(m.releaseDate))
        return false;
      return true;
    });
  }, [movies, query, filterBadge, filterGenre, filterStatus]);

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
  }, [query, filterBadge, filterGenre, filterStatus]);

  const handleSave = async (movieData: Movie) => {
    try {
      setIsSaving(true);
      if (editingMovie) {
        const updated = await updateMovie(editingMovie.id, movieData);
        setMovies((prev) => {
          const updatedList = prev.map((m) => (m.id === updated.id ? updated : m));
          broadcastMoviesUpdated(updatedList);
          return updatedList;
        });
        setFeedback({ type: "success", message: `Updated "${updated.title}" successfully!` });
      } else {
        const created = await createMovie(movieData);
        setMovies((prev) => {
          const updatedList = [created, ...prev];
          broadcastMoviesUpdated(updatedList);
          return updatedList;
        });
        setFeedback({ type: "success", message: `Added "${created.title}" to catalog!` });
      }
      setEditingMovie(null);
      setShowModal(false);
    } catch (err: any) {
      console.error("Failed to save movie:", err);
      setFeedback({ type: "error", message: err.message || "Failed to save movie" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowModal(true);
  };

  const handleDelete = (movie: Movie) => {
    setDeletingMovie(movie);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingMovie) return;
    try {
      setIsSubmittingDelete(true);
      setDeleteError("");
      await deleteMovie(deletingMovie.id);
      setMovies((prev) => {
        const updatedList = prev.filter((m) => m.id !== deletingMovie.id);
        broadcastMoviesUpdated(updatedList);
        return updatedList;
      });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingMovie.id);
        return next;
      });
      setFeedback({ type: "success", message: `"${deletingMovie.title}" was deleted.` });
      setDeletingMovie(null);
    } catch (err: any) {
      console.error("Failed to delete movie:", err);
      setDeleteError(err.message || "Failed to delete movie");
    } finally {
      setIsSubmittingDelete(false);
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

  const handleOpenBulkDelete = () => {
    setShowBulkDeleteModal(true);
    setBulkDeleteError("");
  };

  const handleConfirmBulkDelete = async () => {
    const count = selectedIds.size;
    if (count === 0) return;
    try {
      setIsSubmittingBulkDelete(true);
      setBulkDeleteError("");
      const ids = Array.from(selectedIds);
      await bulkDeleteMovies(ids);
      setMovies((prev) => {
        const updatedList = prev.filter((m) => !selectedIds.has(m.id));
        broadcastMoviesUpdated(updatedList);
        return updatedList;
      });
      setSelectedIds(new Set());
      setFeedback({ type: "success", message: `Successfully deleted ${count} movie(s).` });
      setShowBulkDeleteModal(false);
    } catch (err: any) {
      console.error("Failed to bulk delete movies:", err);
      setBulkDeleteError(err.message || "Failed to bulk delete movies");
    } finally {
      setIsSubmittingBulkDelete(false);
    }
  };

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
            <button
              onClick={loadMovies}
              disabled={loading}
              title="Refresh movies from database"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-variant px-3 py-2 text-sm font-medium text-onSurface transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-accent" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {isAdmin ? (
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
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-mono font-medium text-emerald-300">
                Staff (Read-Only)
              </span>
            )}
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedback && (
          <div
            className={`mb-4 flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm transition-all animate-in fade-in duration-200 ${
              feedback.type === "success"
                ? "border border-green-500/30 bg-green-500/10 text-green-300"
                : "border border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              )}
              <span className="font-medium">{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

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
              onClick={() => { loadMovies(); }}
              title="Refresh movie catalog & stats"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface-variant px-3 py-2 text-xs font-medium text-onSurface hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-red-400" : ""}`} />
              Refresh
            </button>
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
            {filterStatus && (
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium ring-1 ring-inset ${
                  filterStatus === "now-showing"
                    ? "bg-emerald-500/20 text-emerald-400 ring-emerald-500/40"
                    : "bg-cyan-500/20 text-cyan-400 ring-cyan-500/40"
                }`}
              >
                {filterStatus === "now-showing" ? "Now Showing" : "Coming Soon"}
                <button onClick={() => setFilterStatus("")}>
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
                Status:
              </span>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setFilterStatus("")}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-medium transition-colors ${
                    !filterStatus
                      ? "bg-red-600/20 text-red-400 ring-1 ring-inset ring-red-600/40"
                      : "text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() =>
                    setFilterStatus(filterStatus === "now-showing" ? "" : "now-showing")
                  }
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-medium transition-colors ${
                    filterStatus === "now-showing"
                      ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-inset ring-emerald-500/40"
                      : "text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant"
                  }`}
                >
                  Now Showing
                </button>
                <button
                  onClick={() =>
                    setFilterStatus(filterStatus === "coming-soon" ? "" : "coming-soon")
                  }
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-medium transition-colors ${
                    filterStatus === "coming-soon"
                      ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-inset ring-cyan-500/40"
                      : "text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant"
                  }`}
                >
                  Coming Soon
                </button>
              </div>
            </div>

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

            {(filterBadge || filterGenre || filterStatus) && (
              <button
                onClick={() => {
                  setFilterBadge("");
                  setFilterGenre("");
                  setFilterStatus("");
                }}
                className="ml-auto px-3 py-1.5 rounded text-xs text-onSurfaceVariant hover:text-onSurface hover:bg-surface-variant transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Selection action bar */}
        {selectedIds.size > 0 && isAdmin && (
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
              onClick={handleOpenBulkDelete}
              className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-600/20 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-600/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete{selectedIds.size > 1 ? ` (${selectedIds.size})` : ""}
            </button>
          </div>
        )}

        {/* Table */}
        <div>
          {loading && movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-white/10 bg-surface-variant/40">
              <RefreshCw className="h-8 w-8 animate-spin text-accent mb-3" />
              <p className="text-sm text-onSurfaceVariant font-mono">Loading movies from database...</p>
            </div>
          ) : (
            <MovieTable
              movies={paginatedMovies}
              selectedIds={isAdmin ? selectedIds : undefined}
              onToggleSelect={isAdmin ? toggleSelect : undefined}
              onToggleSelectAll={isAdmin ? toggleSelectAll : undefined}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              allSelected={isAdmin ? allOnPageSelected : false}
            />
          )}

          {/* Pagination + Stats */}
          <div className="flex items-center justify-between rounded-b-xl border border-t-0 border-white/10 px-4 py-3 text-xs text-onSurfaceVariant bg-surface-variant/40">
            <div className="flex items-center gap-4 flex-wrap">
              <span>
                Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
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
        isSaving={isSaving}
      />

      {/* Delete Movie Confirmation Modal (styled same as Users page) */}
      {deletingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-variant border border-white/10 rounded-lg max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle size={24} />
              <h3 className="font-heading font-bold text-lg text-onSurface">
                Delete Movie
              </h3>
            </div>

            <p className="text-onSurfaceVariant text-sm mb-4 leading-relaxed">
              Are you sure you want to delete movie{" "}
              <strong className="text-onSurface">{deletingMovie.title}</strong>?
              This action is permanent and cannot be undone.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingMovie(null)}
                disabled={isSubmittingDelete}
                className="px-4 py-2 rounded bg-white/5 text-onSurface text-sm font-medium hover:bg-white/10 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmittingDelete}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition flex items-center gap-2"
              >
                {isSubmittingDelete && (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isSubmittingDelete ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Movies Confirmation Modal (styled same as Users page) */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-variant border border-white/10 rounded-lg max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle size={24} />
              <h3 className="font-heading font-bold text-lg text-onSurface">
                Delete Selected Movies
              </h3>
            </div>

            <p className="text-onSurfaceVariant text-sm mb-4 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-onSurface">{selectedIds.size} selected movie(s)</strong>?
              This action is permanent and cannot be undone.
            </p>

            {bulkDeleteError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                {bulkDeleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                disabled={isSubmittingBulkDelete}
                className="px-4 py-2 rounded bg-white/5 text-onSurface text-sm font-medium hover:bg-white/10 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                disabled={isSubmittingBulkDelete}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition flex items-center gap-2"
              >
                {isSubmittingBulkDelete && (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isSubmittingBulkDelete ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
