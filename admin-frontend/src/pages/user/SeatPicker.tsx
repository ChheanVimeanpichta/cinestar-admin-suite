import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Seat } from "../../types";
import { fetchSeatsForScreening } from "../../services/bookingApi";
import Button from "../../components/shared/Button";
import SectionHeader from "../../components/shared/SectionHeader";

export default function SeatPicker() {
  const { screeningId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (screeningId) fetchSeatsForScreening(screeningId).then(setSeats);
  }, [screeningId]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "occupied") return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(seat.id) ? next.delete(seat.id) : next.add(seat.id);
      return next;
    });
  };

  const rows = Array.from(new Set(seats.map((s) => s.row)));
  const total = seats
    .filter((s) => selected.has(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="px-12 py-12">
      <SectionHeader title="Select Your Seats" subtitle="Real-time interactive seat grid" />

      {/* Screen indicator */}
      <div className="w-full h-2 bg-onSurfaceVariant/30 rounded-full mb-10 mx-auto max-w-2xl" />

      <div className="flex flex-col items-center gap-2 mb-10">
        {rows.map((row) => (
          <div key={row} className="flex gap-2">
            {seats
              .filter((s) => s.row === row)
              .map((seat) => {
                const isSelected = selected.has(seat.id);
                const color =
                  seat.status === "occupied"
                    ? "bg-onSurfaceVariant/20 cursor-not-allowed"
                    : isSelected
                    ? "bg-accent text-onSurface"
                    : "bg-surface-variant hover:bg-accent/40";
                return (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat)}
                    className={`w-8 h-8 rounded text-xs font-mono transition-all ${color}`}
                  >
                    {seat.id}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between glass-surface p-6 max-w-md mx-auto">
        <div>
          <p className="text-onSurfaceVariant text-sm">Total</p>
          <p className="text-headline-md font-heading text-accent">${total.toFixed(2)}</p>
        </div>
        <Button
          disabled={selected.size === 0}
          onClick={() => navigate(`/booking/${screeningId}/payment`)}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}