import { useEffect, useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { Movie } from "../../types";
import { ShowtimeRowData } from "../admin/ShowtimeRow";

interface ShowtimeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ShowtimeRowData) => void;
  editData?: ShowtimeRowData | null;
  movies: Movie[];
}

const hallOptions = ["Hall 1", "Hall 2", "Hall 3", "Hall 4"];
const formatOptions = ["IMAX", "4DX", "DOLBY", "2D", "STANDARD"];

export default function ShowtimeFormModal({
  open,
  onClose,
  onSave,
  editData,
  movies,
}: ShowtimeFormModalProps) {
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [hall, setHall] = useState("Hall 1");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [format, setFormat] = useState("2D");
  const [price, setPrice] = useState<number>(12);

  const isEditing = !!editData;

  const resetForm = () => {
    setSelectedMovieId("");
    setHall("Hall 1");
    setDate("");
    setTime("");
    setFormat("2D");
    setPrice(12);
  };

  useEffect(() => {
    if (editData) {
      setHall(editData.hall);
      setTime(editData.time);
      setFormat(editData.format);
      setPrice(12);
      const movie = movies.find((m) => m.title === editData.title);
      if (movie) setSelectedMovieId(movie.id);
    } else {
      resetForm();
    }
  }, [editData, open, movies]);

  if (!open) return null;

  const selectedMovie = movies.find((m) => m.id === selectedMovieId);

  function computeTimeLabel(dateStr: string): string {
    if (!dateStr) return "";
    const today = new Date().toISOString().slice(0, 10);
    if (dateStr === today) return "Today";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie || !date || !time) return;

    const showtime: ShowtimeRowData = {
      id: editData?.id || `sc-${Date.now()}`,
      posterUrl: selectedMovie.poster || "",
      title: selectedMovie.title,
      durationMins: selectedMovie.durationMins || 120,
      genre: selectedMovie.genre || "",
      theaterName: hall,
      hall,
      time,
      timeLabel: computeTimeLabel(date),
      format,
      seatsFilled: editData?.seatsFilled || 0,
      seatsTotal: 64,
      status: "ON SALE",
    };
    onSave(showtime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-surface border border-white/10 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="font-heading font-bold text-xl text-onSurface uppercase tracking-wide">
              {isEditing ? "Edit Showtime" : "New Showtime"}
            </h2>
            <p className="font-mono text-[10px] text-onSurfaceVariant mt-1 uppercase tracking-wide">
              {isEditing
                ? `Editing: ${editData?.title}`
                : "Schedule a screening in a theater hall"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Movie selection */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
              Movie
            </label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors cursor-pointer"
            >
              <option value="" className="bg-surface">
                Select a movie...
              </option>
              {movies.map((m) => (
                <option key={m.id} value={m.id} className="bg-surface">
                  {m.title}
                </option>
              ))}
            </select>
            {selectedMovie && (
              <p className="font-mono text-[10px] text-onSurfaceVariant mt-1 uppercase">
                {selectedMovie.genre} &bull; {selectedMovie.durationMins || "?"}
                MIN
              </p>
            )}
          </div>

          {/* Hall + Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
                Theater Hall
              </label>
              <select
                value={hall}
                onChange={(e) => setHall(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors cursor-pointer"
              >
                {hallOptions.map((h) => (
                  <option key={h} value={h} className="bg-surface">
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors cursor-pointer"
              >
                {formatOptions.map((f) => (
                  <option key={f} value={f} className="bg-surface">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2 flex items-center gap-1.5">
                <Calendar size={12} />
                Screening Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2 flex items-center gap-1.5">
                <Clock size={12} />
                Start Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface outline-none focus:border-accent transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2">
              Ticket Price ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value ? parseFloat(e.target.value) : 0)
              }
              min="0"
              step="0.5"
              required
              placeholder="12"
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded font-body text-sm text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-accent text-onSurface font-body font-semibold text-sm hover:brightness-110 transition"
            >
              {isEditing ? "Save Changes" : "Add Showtime"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
