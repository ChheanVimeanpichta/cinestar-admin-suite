import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Screening, Theater, ScreeningFormat } from "../../types";
import { fetchScreeningsForMovie, fetchTheaters } from "../../services/showtimeApi";
import Card from "../../components/shared/Card";
import SectionHeader from "../../components/shared/SectionHeader";
import Button from "../../components/shared/Button";

const formats: ScreeningFormat[] = ["STANDARD", "IMAX", "4DX", "DOLBY"];

export default function SelectScreening() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ScreeningFormat>("STANDARD");
  const [selectedTheater, setSelectedTheater] = useState<string>("");

  useEffect(() => {
    if (movieId) fetchScreeningsForMovie(movieId).then(setScreenings);
    fetchTheaters().then(setTheaters);
  }, [movieId]);

  const filtered = screenings.filter(
    (s) =>
      s.format === selectedFormat &&
      (!selectedTheater || s.theaterId === selectedTheater)
  );

  return (
    <div className="px-12 py-12">
      <SectionHeader title="Select Screening" subtitle="Choose date, theater, and format" />

      {/* Format selector */}
      <div className="flex gap-3 mb-6">
        {formats.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFormat(f)}
            className={`px-4 py-2 rounded font-mono text-label-mono transition-all ${
              selectedFormat === f
                ? "bg-accent text-onSurface"
                : "bg-surface-variant text-onSurfaceVariant hover:text-onSurface"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Theater selector */}
      <select
        value={selectedTheater}
        onChange={(e) => setSelectedTheater(e.target.value)}
        className="glass-surface px-4 py-3 mb-6 text-onSurface w-full max-w-sm outline-none"
      >
        <option value="">All Theaters</option>
        {theaters.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} — {t.location}
          </option>
        ))}
      </select>

      {/* Time slots */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((s) => (
          <Card key={s.id} glass className="text-center hover:scale-[1.03] transition-transform cursor-pointer">
            <p className="font-heading text-onSurface text-lg">{s.time}</p>
            <p className="text-onSurfaceVariant text-sm mt-1">{s.hall}</p>
            <p className="text-accent font-mono text-label-mono mt-2">${s.price.toFixed(2)}</p>
            <Button className="mt-4 w-full" onClick={() => navigate(`/booking/${s.id}/seats`)}>
              Select
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}