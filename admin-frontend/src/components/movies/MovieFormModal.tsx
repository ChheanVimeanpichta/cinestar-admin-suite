import { useEffect, useState, useMemo, useRef } from "react";
import { X, Upload, Calendar, ChevronDown, Check, Plus, Tag } from "lucide-react";
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
  const [genreSearch, setGenreSearch] = useState("");
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [customGenres, setCustomGenres] = useState<string[]>([]);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState<number | null>(null);
  const [synopsis, setSynopsis] = useState("");
  const [poster, setPoster] = useState("");
  const [badge, setBadge] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [hasBookBtn, setHasBookBtn] = useState(true);

  const isEditing = !!editMovie;

  const resetForm = () => {
    setTitle("");
    setGenre("");
    setGenreSearch("");
    setIsGenreOpen(false);
    setScore(null);
    setSynopsis("");
    setPoster("");
    setBadge("");
    setReleaseDate("");
    setHasBookBtn(true);
  };

  useEffect(() => {
    if (editMovie) {
      setTitle(editMovie.title);
      setGenre(editMovie.genre);
      setGenreSearch(editMovie.genre);
      setIsGenreOpen(false);
      setScore(editMovie.score);
      setSynopsis(editMovie.synopsis);
      setPoster(editMovie.poster);
      setBadge(editMovie.badge || "");
      setReleaseDate(editMovie.releaseDate || "");
      setHasBookBtn(editMovie.hasBookBtn || false);
      if (editMovie.genre && !genreOptions.includes(editMovie.genre)) {
        setCustomGenres((prev) => Array.from(new Set([...prev, editMovie.genre])));
      }
    } else {
      resetForm();
    }
  }, [editMovie, open]);

  // Click outside listener for the genre dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allGenreOptions = useMemo(() => {
    const combined = [...customGenres, ...genreOptions];
    return Array.from(new Set(combined));
  }, [customGenres]);

  const filteredGenres = useMemo(() => {
    const q = genreSearch.trim().toLowerCase();
    if (!q) return allGenreOptions;
    return allGenreOptions.filter((g) => g.toLowerCase().includes(q));
  }, [allGenreOptions, genreSearch]);

  const hasExactMatch = allGenreOptions.some(
    (g) => g.toLowerCase() === genreSearch.trim().toLowerCase()
  );

  const isUpcoming = useMemo(() => {
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
  }, [releaseDate]);

  const handleSelectGenre = (selected: string) => {
    setGenre(selected);
    setGenreSearch(selected);
    setIsGenreOpen(false);
    if (!allGenreOptions.includes(selected)) {
      setCustomGenres((prev) => [selected, ...prev]);
    }
  };

  const handleAddCustomGenre = () => {
    const trimmed = genreSearch.trim();
    if (!trimmed) return;
    handleSelectGenre(trimmed);
  };

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
            <div className="sm:col-span-2 relative" ref={genreDropdownRef}>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">
                  Genre
                </label>
                {genre && (
                  <span className="text-[10px] font-mono text-accent truncate max-w-[120px]" title={genre}>
                    {genre}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={genreSearch}
                  onChange={(e) => {
                    setGenreSearch(e.target.value);
                    setGenre(e.target.value);
                    if (!isGenreOpen) setIsGenreOpen(true);
                  }}
                  onFocus={() => setIsGenreOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (filteredGenres.length > 0 && !hasExactMatch && genreSearch.trim()) {
                        handleAddCustomGenre();
                      } else if (filteredGenres.length > 0) {
                        handleSelectGenre(filteredGenres[0]);
                      } else if (genreSearch.trim()) {
                        handleAddCustomGenre();
                      }
                    } else if (e.key === "Escape") {
                      setIsGenreOpen(false);
                    }
                  }}
                  required={!genre}
                  placeholder="Search or type custom genre..."
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 pr-16 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {genreSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setGenreSearch("");
                        setGenre("");
                      }}
                      className="p-1 rounded text-onSurfaceVariant hover:text-onSurface transition-colors"
                      title="Clear genre"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsGenreOpen(!isGenreOpen)}
                    className="p-1 rounded text-onSurfaceVariant hover:text-onSurface transition-colors"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isGenreOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isGenreOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-lg border border-white/15 bg-[#18181b] shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-md overflow-hidden">
                  {/* Custom option prompt if query doesn't match an existing preset */}
                  {genreSearch.trim() && !hasExactMatch && (
                    <div className="border-b border-white/10 p-2 bg-accent/5">
                      <button
                        type="button"
                        onClick={handleAddCustomGenre}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded text-xs font-medium text-accent hover:bg-accent/15 transition-colors text-left"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Plus size={14} className="shrink-0" />
                          <span>Use custom: <span className="font-bold underline">"{genreSearch.trim()}"</span></span>
                        </span>
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-accent/20 text-accent shrink-0">
                          Custom
                        </span>
                      </button>
                    </div>
                  )}

                  {/* List of matching genres */}
                  <div className="max-h-56 overflow-y-auto divide-y divide-white/5 py-1">
                    {filteredGenres.length > 0 ? (
                      filteredGenres.map((g) => {
                        const isSelected = genre.toLowerCase() === g.toLowerCase();
                        const isCustom = !genreOptions.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleSelectGenre(g)}
                            className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                              isSelected
                                ? "bg-accent/20 text-accent font-bold"
                                : "text-onSurface hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Tag size={12} className={isSelected ? "text-accent" : "text-onSurfaceVariant"} />
                              <span className="truncate">{g}</span>
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isCustom && (
                                <span className="text-[9px] font-mono px-1 rounded bg-white/10 text-onSurfaceVariant">
                                  custom
                                </span>
                              )}
                              {isSelected && <Check size={14} className="text-accent" />}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-center text-xs text-onSurfaceVariant">
                        <p>No preset found for "{genreSearch}"</p>
                        <button
                          type="button"
                          onClick={handleAddCustomGenre}
                          className="mt-1.5 inline-flex items-center gap-1 text-accent font-semibold hover:underline"
                        >
                          <Plus size={13} />
                          Add as custom genre
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  Release Date
                </span>
                {releaseDate && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isUpcoming
                        ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30"
                        : "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                    }`}
                  >
                    {isUpcoming ? "Coming Soon" : "Now Showing"}
                  </span>
                )}
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
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-wide text-onSurface">
                Enable Book Now button
              </span>
              <span className="text-[11px] text-onSurfaceVariant">
                {isUpcoming
                  ? "Movie is Coming Soon (releases in the future). Once release date arrives, online booking activates."
                  : hasBookBtn
                    ? "Active for booking — displays under Now Showing in customer UI"
                    : "Booking disabled"}
              </span>
            </div>
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
