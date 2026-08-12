import { Pencil, Trash2, Star } from "lucide-react";
import { Movie } from "../../types";

interface MoviePosterCardProps {
  movie: Movie;
  badge?: string;
  rating?: number | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MoviePosterCard({
  movie,
  badge,
  rating,
  onEdit,
  onDelete,
}: MoviePosterCardProps) {
  return (
    <div
      className="group relative rounded overflow-hidden aspect-[2/3] bg-surface-variant"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Badge */}
      {badge && (
        <span className="absolute top-4 left-4 font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded bg-accent text-onSurface">
          {badge}
        </span>
      )}

      {/* Edit / delete actions — visible on hover */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded bg-black/50 backdrop-blur flex items-center justify-center text-onSurface hover:bg-accent transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded bg-black/50 backdrop-blur flex items-center justify-center text-onSurface hover:bg-accent transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Title / metadata */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-onSurface uppercase leading-none">
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-wide text-onSurfaceVariant">
            {movie.genre}
          </span>
          {rating != null && (
            <span className="flex items-center gap-1 text-accent font-mono text-[11px] font-semibold">
              <Star size={11} fill="currentColor" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
