import { useEffect, useState } from "react";
import { X, Upload, Calendar } from "lucide-react";
import { Movie } from "../../types";

interface MovieFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (movie: Movie) => void;
  editMovie?: Movie | null;
  isSaving?: boolean;
}

const badgeOptions = ["IMAX", "4DX", "CineStar", "DOLBY", "2D"];

const genreOptions = [
  "Action",
  "Action / Adventure",
  "Action / Crime",
  "Action / Sci-Fi",
  "Adventure",
  "Animation",
  "Animation / Family",
  "Animation / Sci-Fi",
  "Comedy",
  "Comedy / Romance",
  "Crime",
  "Crime / Thriller",
  "Documentary",
  "Drama",
  "Drama / Music",
  "Drama / Romance",
  "Family",
  "Fantasy",
  "Fantasy / Adventure",
  "Horror",
  "Horror / Thriller",
  "Music / Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sci-Fi / Action",
  "Sci-Fi / Thriller",
  "Thriller",
  "War",
  "War / Drama",
  "Western",
];

export default function MovieFormModal({ open, onClose, onSave, editMovie, isSaving = false }: MovieFormModalProps) {
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

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setPoster(event.target.result);
      }
    };
    reader.readAsDataURL(file);
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
              {isEditing ? `Editing: ${editMovie?.title}` : "Upload assets & metadata"}
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
              <label className="cursor-pointer group relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
                {poster ? (
                  <div className="relative">
                    <img
                      src={poster}
                      alt="Preview"
                      className="w-24 h-36 object-cover rounded border border-white/10 group-hover:opacity-80 transition"
                    />
                    <span className="absolute bottom-1 left-1 right-1 bg-black/75 text-[9px] text-center font-mono py-0.5 rounded text-white opacity-0 group-hover:opacity-100 transition">
                      Change
                    </span>
                  </div>
                ) : (
                  <div className="w-24 h-36 rounded border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center gap-1 shrink-0 group-hover:border-accent/50 group-hover:bg-accent/5 transition">
                    <Upload size={18} className="text-onSurfaceVariant group-hover:text-accent transition" />
                    <span className="font-mono text-[8px] text-onSurfaceVariant uppercase group-hover:text-accent">Upload</span>
                  </div>
                )}
              </label>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                  placeholder="Paste poster image URL or click preview to upload..."
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
                />
                <p className="text-[11px] text-onSurfaceVariant">
                  Click the box on the left to upload from your computer, or paste an external image URL.
                </p>
              </div>
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
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors cursor-pointer [color-scheme:dark]"
              >
                <option value="" className="bg-[#141414] text-onSurfaceVariant">Select genre...</option>
                {genre && !genreOptions.includes(genre) && (
                  <option value={genre} className="bg-[#141414] text-onSurface">{genre}</option>
                )}
                {genreOptions.map((g) => (
                  <option key={g} value={g} className="bg-[#141414] text-onSurface">
                    {g}
                  </option>
                ))}
              </select>
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
              disabled={isSaving}
              className="px-5 py-2.5 rounded font-body text-sm text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded bg-accent text-onSurface font-body font-semibold text-sm hover:brightness-110 transition disabled:opacity-60 flex items-center gap-2"
            >
              {isSaving && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isSaving
                ? isEditing
                  ? "Saving Changes..."
                  : "Adding Movie..."
                : isEditing
                ? "Save Changes"
                : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
