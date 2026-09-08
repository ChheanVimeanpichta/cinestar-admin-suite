import { useMemo, useState, useEffect } from "react";
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
} from "lucide-react";
import ShowtimeStatCard from "../../components/admin/ShowtimeStatCard";
import ShowtimeRow, { ShowtimeRowData } from "../../components/admin/ShowtimeRow";
import ShowtimeFormModal from "../../components/showtimes/ShowtimeFormModal";
import { allShowtimeRows } from "../../mocks/showtimes";
import { mockMovies } from "../../mocks/movies";

const STORAGE_KEY = "cinestar_admin_static_showtimes_v1";

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
  const [view, setView] = useState<"table" | "calendar">("table");
  const [allShowtimes, setAllShowtimes] = useState<ShowtimeRowData[]>(loadInitialShowtimes);
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTheater, setFilterTheater] = useState("All Theaters");
  const [filterFormat, setFilterFormat] = useState("All Formats");
  const [showModal, setShowModal] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeRowData | null>(null);

  // Synchronize state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allShowtimes));
    } catch {}
  }, [allShowtimes]);

  const theaterOptions = useMemo(() => {
    const set = new Set(["Hall 1", "Hall 2", "Hall 3", "Hall 4"]);
    allShowtimes.forEach((r) => {
      if (r.hall) set.add(r.hall);
      if (r.theaterName) set.add(r.theaterName);
    });
    return Array.from(set);
  }, [allShowtimes]);

  const formatOptions = useMemo(() => [
    "All Formats",
    "IMAX",
    "4DX",
    "DOLBY",
    "2D",
    "STANDARD",
  ], []);

  // Compute live stats from static data
  const stats = useMemo(() => {
    const todaysShows = allShowtimes.filter(
      (r) => r.timeLabel === "Today" || r.timeLabel?.toLowerCase().includes("today")
    ).length;
    const totalFilled = allShowtimes.reduce((acc, r) => acc + (r.seatsFilled || 0), 0);
    const totalSeats = allShowtimes.reduce((acc, r) => acc + (r.seatsTotal || 64), 0);
    const totalCapacityPct = totalSeats > 0 ? Math.round((totalFilled / totalSeats) * 100) : 72;
    const conflicts = allShowtimes.filter((r) => r.status === "CONFLICT").length;
    const activeHalls = new Set(allShowtimes.map((r) => r.hall || r.theaterName)).size;

    return {
      todaysShows: todaysShows || 3,
      totalCapacityPct,
      conflicts,
      activeHalls: activeHalls || 4,
    };
  }, [allShowtimes]);

  // Client-side instant filter and search
  const filteredRows = useMemo(() => {
    return allShowtimes.filter((r) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.hall && r.hall.toLowerCase().includes(q)) ||
        (r.theaterName && r.theaterName.toLowerCase().includes(q)) ||
        (r.genre && r.genre.toLowerCase().includes(q)) ||
        (r.format && r.format.toLowerCase().includes(q)) ||
        (r.time && r.time.toLowerCase().includes(q));

      const matchTheater =
        filterTheater === "All Theaters" ||
        r.hall === filterTheater ||
        r.theaterName === filterTheater;

      const matchFormat =
        filterFormat === "All Formats" ||
        r.format.toUpperCase() === filterFormat.toUpperCase();

      return matchSearch && matchTheater && matchFormat;
    });
  }, [allShowtimes, searchQuery, filterTheater, filterFormat]);

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
    if (window.confirm(`Delete ${selectedIds.size} selected showtime(s)?`)) {
      setAllShowtimes((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
    }
  }

  function handleAddShowtime() {
    setEditingShowtime(null);
    setShowModal(true);
  }

  function handleEditRow(data: ShowtimeRowData) {
    setEditingShowtime(data);
    setShowModal(true);
  }

  function handleSaveShowtime(data: ShowtimeRowData) {
    if (editingShowtime) {
      setAllShowtimes((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    } else {
      setAllShowtimes((prev) => [data, ...prev]);
      setPage(1);
    }
    setEditingShowtime(null);
  }

  function handleDeleteRow(data: ShowtimeRowData) {
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
            <CalendarIcon size={30} className="text-accent" />
            Showtimes
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
            Manage scheduling, resolve conflicts, and optimize hall utilization across all venues.
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

          <button
            onClick={handleAddShowtime}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-accent text-onSurface text-sm font-body font-semibold hover:brightness-110 transition shadow"
          >
            <Plus size={15} />
            Add Showtime
          </button>
        </div>
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
          <option>All Theaters</option>
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

      {/* Table View */}
      {view === "table" ? (
        <div className="bg-surface-variant rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-onSurfaceVariant text-xs font-mono uppercase tracking-wider">
                <th className="py-3 pl-6 w-12">
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
                  selected={selectedIds.has(row.id)}
                  onToggleSelect={() => toggleSelect(row.id)}
                  onEdit={handleEditRow}
                  onDelete={handleDeleteRow}
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
              const dayShows = allShowtimes.filter((r) => {
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
                    {dayShows.map((show) => (
                      <button
                        key={show.id}
                        type="button"
                        onClick={() => handleEditRow(show)}
                        className="p-2 rounded-lg bg-surface border border-white/10 hover:border-accent text-left transition group"
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
                        <p className="text-xs font-semibold text-onSurface truncate group-hover:text-accent transition-colors">
                          {show.title}
                        </p>
                        <p className="text-[10px] text-onSurfaceVariant font-mono mt-0.5 flex items-center gap-1">
                          <Film size={10} />
                          {show.hall || show.theaterName} • {show.seatsFilled}/{show.seatsTotal}
                        </p>
                      </button>
                    ))}
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
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingShowtime(null);
        }}
        onSave={handleSaveShowtime}
        editData={editingShowtime}
        movies={mockMovies}
      />
    </div>
  );
}
