import { useEffect, useState } from "react";
import { X, Upload, Calendar } from "lucide-react";
import { Movie } from "../../types";

interface MovieFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (movie: Movie) => void;
  editMovie?: Movie | null;
}

const badgeOptions = ["IMAX", "4DX", "CineStar", "DOLBY", "2D"];

export default function MovieFormModal({ open, onClose, onSave, editMovie }: MovieFormModalProps) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [synopsis, setSynopsis] = useState("");
  const [poster, setPoster] = useState("");
  const [badge, setBadge] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [hasBookBtn, setHasBookBtn] = useState(false);

  const isEditing = !!editMovie;

  const resetForm = () => {
    setTitle("");
    setGenre("");
    setScore(null);
    setSynopsis("");
    setPoster("");
    setBadge("");
    setReleaseDate("");
    setHasBookBtn(false);
  };

  useEffect(() => {
    if (editMovie) {
      setTitle(editMovie.title);
      setGenre(editMovie.genre);
      setScore(editMovie.score);
      setSynopsis(editMovie.synopsis);
      setPoster(editMovie.poster);
      setBadge(editMovie.badge || "");
      setReleaseDate(editMovie.releaseDate || "");
      setHasBookBtn(editMovie.hasBookBtn || false);
    } else {
      resetForm();
    }
  }, [editMovie, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const movie: Movie = {
      id: editMovie?.id || `mv-${Date.now()}`,
      title,
      genre,
      score,
      synopsis,
      poster: poster || "https://picsum.photos/seed/new-movie/300/450",
      badge: badge || undefined,
      hasBookBtn,
      releaseDate: releaseDate || undefined,
    };
    onSave(movie);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-surface border border-white/10 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="font-heading font-bold text-xl text-onSurface uppercase tracking-wide">
              {isEditing ? "Edit Movie" : "New Movie Entry"}
            </h2>
            <p className="font-mono text-[10px] text-onSurfaceVariant mt-1 uppercase tracking-wide">
              {isEditing ? `Editing: ${editMovie?.title}` : "Upload assets &amp; metadata"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Poster preview + upload */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
              Poster Image
            </label>
            <div className="flex items-start gap-4">
              {poster ? (
                <img
                  src={poster}
                  alt="Preview"
                  className="w-24 h-36 object-cover rounded border border-white/10"
                />
              ) : (
                <div className="w-24 h-36 rounded border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center gap-1 shrink-0">
                  <Upload size={18} className="text-onSurfaceVariant" />
                  <span className="font-mono text-[8px] text-onSurfaceVariant uppercase">Preview</span>
                </div>
              )}
              <input
                type="text"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
                placeholder="Paste poster image URL..."
                className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Title + Genre row */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="sm:col-span-3">
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
                Movie Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Avengers: Endgame"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Action/Sci-Fi"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Score + Badge + Release Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
                Score (0-10)
              </label>
              <input
                type="number"
                value={score ?? ""}
                onChange={(e) => setScore(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                max="10"
                step="0.1"
                placeholder="8.5"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
                Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors cursor-pointer"
              >
                <option value="" className="bg-surface">None</option>
                {badgeOptions.map((b) => (
                  <option key={b} value={b} className="bg-surface">{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2 flex items-center gap-1.5">
                <Calendar size={12} />
                Release Date
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
              Synopsis
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={3}
              placeholder="Brief movie description..."
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* hasBookBtn toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHasBookBtn(!hasBookBtn)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                hasBookBtn ? "bg-accent" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                  hasBookBtn ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
            <span className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">
              Enable Book Now button
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded font-body text-sm text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-accent text-onSurface font-body font-semibold text-sm hover:brightness-110 transition"
            >
              {isEditing ? "Save Changes" : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
