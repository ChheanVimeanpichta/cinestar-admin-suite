import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../types";
import { MoreVertical, Pencil, Trash2, Check, Clock } from "lucide-react";

interface MovieTableProps {
  movies: Movie[];
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onEdit?: (movie: Movie) => void;
  onDelete?: (movie: Movie) => void;
  allSelected?: boolean;
  emptyMessage?: string;
}

const formatBadgeStyles: Record<string, string> = {
  IMAX: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "4DX": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  CineStar: "bg-red-500/15 text-red-300 border-red-500/30",
  DOLBY: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  "2D": "bg-white/10 text-onSurfaceVariant border-white/10",
};

function formatRuntime(mins?: number) {
  if (mins == null) return "\u2014";
  return `${mins}m`;
}

function formatDate(iso?: string) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isMovieUpcoming(releaseDate?: string) {
  if (!releaseDate) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = releaseDate.split("-");
    let target: Date;
    if (parts.length === 3) {
      target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      target = new Date(releaseDate);
    }
    if (!isNaN(target.getTime())) {
      target.setHours(0, 0, 0, 0);
      return target.getTime() > today.getTime();
    }
  } catch {}
  return false;
}

function ActionMenu({
  movie,
  onEdit,
  onDelete,
}: {
  movie: Movie;
  onEdit?: (movie: Movie) => void;
  onDelete?: (movie: Movie) => void;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md p-1 text-onSurfaceVariant hover:bg-surface-variant hover:text-onSurface"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-4 top-10 z-20 w-40 rounded-lg border border-white/10 bg-surface-variant py-1 shadow-xl">
            <button
              onClick={() => {
                navigate(`/admin/showtimes?movieId=${movie.id}&openAdd=true`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-accent hover:bg-white/5 transition-colors"
            >
              <Clock className="h-3.5 w-3.5" />
              Add Showtime
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(movie);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-onSurface hover:bg-white/5 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(movie);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function MovieTable({
  movies,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  allSelected,
  emptyMessage = "No titles match your search.",
}: MovieTableProps) {
  const hasActions = !!onEdit || !!onDelete;
  const hasSelection = !!onToggleSelect && !!onToggleSelectAll;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-variant/40">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-onSurfaceVariant">
            {hasSelection && (
              <th className="w-10 px-4 py-3">
                <button
                  onClick={onToggleSelectAll}
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    allSelected
                      ? "border-red-600 bg-red-600 text-onSurface"
                      : "border-white/10 hover:border-white/10"
                  }`}
                >
                  {allSelected && <Check className="h-3 w-3" />}
                </button>
              </th>
            )}
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Genre</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Runtime</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Badge</th>
            <th className="px-4 py-3 font-medium">Release</th>
            {hasActions && <th className="w-10 px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr
              key={movie.id}
              className="border-b border-white/10 last:border-b-0 hover:bg-surface-variant/30"
            >
              {hasSelection && (
                <td className="px-4 py-3 align-middle">
                  <button
                    onClick={() => onToggleSelect!(movie.id)}
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      selectedIds?.has(movie.id)
                        ? "border-red-600 bg-red-600 text-onSurface"
                        : "border-white/10 hover:border-white/10"
                    }`}
                  >
                    {selectedIds?.has(movie.id) && <Check className="h-3 w-3" />}
                  </button>
                </td>
              )}
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-surface-variant border border-white/10">
                    {movie.poster && (
                      <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-body font-medium text-sm text-onSurface">
                      {movie.title}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 align-middle">
                <div className="flex flex-wrap gap-1">
                  {movie.genre ? (
                    movie.genre.split("/").map((g) => (
                      <span
                        key={g}
                        className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wide text-onSurfaceVariant border border-white/10"
                      >
                        {g.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-onSurfaceVariant font-mono text-xs">—</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 align-middle">
                {isMovieUpcoming(movie.releaseDate) ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Coming Soon
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border bg-green-500/15 border-green-500/30 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Now Showing
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-middle text-onSurface font-mono text-xs">
                {formatRuntime(movie.durationMins)}
              </td>
              <td className="px-4 py-3 align-middle">
                {movie.score != null ? (
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-mono font-semibold border ${
                      movie.score >= 8
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : movie.score >= 6
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-white/10 text-onSurfaceVariant border-white/10"
                    }`}
                  >
                    {movie.score.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-onSurfaceVariant font-mono text-xs">—</span>
                )}
              </td>
              <td className="px-4 py-3 align-middle">
                {movie.badge ? (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      formatBadgeStyles[movie.badge] ?? "bg-white/10 text-onSurfaceVariant border-white/10"
                    }`}
                  >
                    {movie.badge}
                  </span>
                ) : (
                  <span className="text-onSurfaceVariant font-mono text-xs">—</span>
                )}
              </td>
              <td className="px-4 py-3 align-middle text-onSurface font-mono text-xs">
                {formatDate(movie.releaseDate)}
              </td>
              {hasActions && (
                <td className="px-4 py-3 align-middle">
                  <ActionMenu
                    movie={movie}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              )}
            </tr>
          ))}

          {movies.length === 0 && (
            <tr>
              <td
                colSpan={
                  hasActions
                    ? hasSelection
                      ? 8
                      : 7
                    : hasSelection
                      ? 7
                      : 6
                }
                className="px-4 py-10 text-center text-onSurfaceVariant"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
