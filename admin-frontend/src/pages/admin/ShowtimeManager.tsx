import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
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
} from "lucide-react";
import ShowtimeStatCard from "../../components/admin/ShowtimeStatCard";
import ShowtimeRow, { ShowtimeRowData } from "../../components/admin/ShowtimeRow";
import ShowtimeFormModal from "../../components/showtimes/ShowtimeFormModal";
import { fetchShowtimeStats, fetchShowtimeRows } from "../../services/showtimeApi";
import { mockMovies } from "../../mocks/movies";

interface ShowtimeStats {
  todaysShows: number;
  totalCapacityPct: number;
  conflicts: number;
  activeHalls: number;
}

export default function ShowtimeManager() {
  const [view, setView] = useState<"table" | "calendar">("table");
  const [stats, setStats] = useState<ShowtimeStats | null>(null);
  const [rows, setRows] = useState<ShowtimeRowData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTheater, setFilterTheater] = useState("All Theaters");
  const [filterFormat, setFilterFormat] = useState("All Formats");
  const [showModal, setShowModal] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeRowData | null>(null);
  const theaterOptions = useMemo(() => ["Hall 1", "Hall 2", "Hall 3", "Hall 4"], []);
  const formatOptions = useMemo(() => ["All Formats", "IMAX", "4DX", "DOLBY", "2D", "STANDARD"], []);

  useEffect(() => {
    fetchShowtimeStats().then(setStats);
  }, []);

  useEffect(() => {
    fetchShowtimeRows(page).then((data) => {
      if (data?.rows) {
        setRows(data.rows);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        setPageSize(data.pageSize);
      }
    });
  }, [page]);

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
      const allOnPage = rows.every((r) => next.has(r.id));
      if (allOnPage) {
        rows.forEach((r) => next.delete(r.id));
      } else {
        rows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  }

  function handleBulkEdit() {
    if (selectedIds.size === 1) {
      const selected = rows.find((r) => selectedIds.has(r.id));
      if (selected) {
        setEditingShowtime(selected);
        setShowModal(true);
      }
    }
    setSelectedIds(new Set());
  }

  function handleBulkDelete() {
    if (
      window.confirm(`Delete ${selectedIds.size} selected showtime(s)?`)
    ) {
      setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    }
    setSelectedIds(new Set());
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
      setRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    } else {
      setRows((prev) => [data, ...prev]);
    }
    setEditingShowtime(null);
  }

  function handleDeleteRow(data: ShowtimeRowData) {
    if (window.confirm(`Delete showtime for "${data.title}" at ${data.time}?`)) {
      setRows((prev) => prev.filter((r) => r.id !== data.id));
    }
  }

  const allOnPageSelected =
    rows.length > 0 && rows.every((r) => selectedIds.has(r.id));

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
            <Calendar size={30} className="text-accent" />
            Showtimes
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
            Manage scheduling, resolve conflicts, and optimize hall utilization across all venues.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex bg-surface-variant rounded overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-body transition-colors ${
                view === "table" ? "bg-white/10 text-onSurface" : "text-onSurfaceVariant"
              }`}
            >
              <Table2 size={15} />
              Table
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-body transition-colors ${
                view === "calendar" ? "bg-white/10 text-onSurface" : "text-onSurfaceVariant"
              }`}
            >
              <Calendar size={15} />
              Calendar
            </button>
          </div>

          <button
            onClick={handleAddShowtime}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-accent text-onSurface text-sm font-body font-semibold hover:brightness-110 transition"
          >
            <Plus size={15} />
            Add Showtime
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <ShowtimeStatCard label="Today's Shows" value={stats ? String(stats.todaysShows) : "--"} icon={<Ticket size={18} />} />
        <ShowtimeStatCard label="Total Capacity" value={stats ? `${stats.totalCapacityPct}%` : "--"} icon={<Users2 size={18} />} />
        <ShowtimeStatCard label="Conflicts" value={stats ? String(stats.conflicts) : "--"} icon={<AlertTriangle size={18} />} tone="warning" />
        <ShowtimeStatCard label="Active Halls" value={stats ? String(stats.activeHalls) : "--"} icon={<LayoutGrid size={18} />} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
          <input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface-variant border border-white/10 rounded pl-9 pr-4 py-2.5 text-sm text-onSurface placeholder:text-onSurfaceVariant outline-none"
          />
        </div>
        <select
          value={filterTheater}
          onChange={(e) => {
            setFilterTheater(e.target.value);
            setPage(1);
          }}
          className="bg-surface-variant border border-white/10 rounded px-4 py-2.5 text-sm text-onSurface outline-none"
        >
          <option>All Theaters</option>
          {theaterOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={filterFormat}
          onChange={(e) => {
            setFilterFormat(e.target.value);
            setPage(1);
          }}
          className="bg-surface-variant border border-white/10 rounded px-4 py-2.5 text-sm text-onSurface outline-none"
        >
          {formatOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
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

      {/* Table */}
      {view === "table" ? (
        <div className="bg-surface-variant rounded overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10">
                <th className="py-3 pl-6 pr-2 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      allOnPageSelected
                        ? "border-red-600 bg-red-600 text-onSurface"
                        : "border-white/10 hover:border-white/10"
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
              {rows.map((row) => (
                <ShowtimeRow
                  key={row.id}
                  data={row}
                  selected={selectedIds.has(row.id)}
                  onToggleSelect={() => toggleSelect(row.id)}
                  onEdit={handleEditRow}
                  onDelete={handleDeleteRow}
                />
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-onSurfaceVariant text-sm">
                    No showtimes match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-onSurfaceVariant text-xs font-mono">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5 disabled:opacity-30"
              >
                ‹
              </button>
              {Array.from(
                { length: Math.min(3, totalPages) },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono ${
                    page === p ? "bg-accent text-onSurface" : "text-onSurfaceVariant hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && (
                <span className="text-onSurfaceVariant text-xs px-1">...</span>
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="w-7 h-7 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-variant rounded p-10 text-center text-onSurfaceVariant">
          Calendar view placeholder — wire in a calendar lib (e.g. react-big-calendar) here.
        </div>
      )}
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
