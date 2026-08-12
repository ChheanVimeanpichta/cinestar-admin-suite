import { useState } from "react";
import { Movie } from "../../types";
import { MoreVertical, Pencil, Trash2, Check } from "lucide-react";

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
          <div className="absolute right-4 top-10 z-20 w-36 rounded-lg border border-white/10 bg-surface-variant py-1 shadow-xl">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(movie);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-onSurface hover:bg-surface-variant"
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
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-surface-variant"
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
                <td className="px-4 py-3 align-top">
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
              <td className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-surface-variant">
                    {movie.poster && (
                      <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-onSurface">
                      {movie.title}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex flex-wrap gap-1">
                  {movie.genre ? (
                    movie.genre.split("/").map((g) => (
                      <span
                        key={g}
                        className="rounded-md bg-surface-variant px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-onSurface"
                      >
                        {g.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-onSurfaceVariant">{"\u2014"}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 align-top text-onSurface">
                {formatRuntime(movie.durationMins)}
              </td>
              <td className="px-4 py-3 align-top">
                {movie.score != null ? (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      movie.score >= 8
                        ? "bg-emerald-500/10 text-emerald-400"
                        : movie.score >= 6
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-onSurfaceVariant/10 text-onSurfaceVariant"
                    }`}
                  >
                    {movie.score.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-onSurfaceVariant">{"\u2014"}</span>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                {movie.badge ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-variant px-2 py-1 text-xs font-medium text-onSurface">
                    {movie.badge}
                  </span>
                ) : (
                  <span className="text-onSurfaceVariant">{"\u2014"}</span>
                )}
              </td>
              <td className="px-4 py-3 align-top text-onSurface">
                {formatDate(movie.releaseDate)}
              </td>
              {hasActions && (
                <td className="px-4 py-3 align-top">
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
