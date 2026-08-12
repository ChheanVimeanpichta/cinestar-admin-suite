import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Booking } from "../../types";
import { fetchAllBookings } from "../../services/bookingApi";
import Badge from "../../components/shared/Badge";

export default function BookingLog() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchAllBookings().then(setBookings);
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
            <ClipboardList size={30} className="text-accent" />
            Booking Log
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
            All customer bookings
          </p>
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-onSurfaceVariant font-mono text-label-mono border-b border-white/10">
            <th className="py-3">Movie</th>
            <th>Customer</th>
            <th>Seats</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-white/5 text-onSurface">
              <td className="py-3">{b.movieTitle}</td>
              <td>{b.userId}</td>
              <td>{b.seats.map((s) => s.id).join(", ")}</td>
              <td>${b.totalPrice.toFixed(2)}</td>
              <td>
                <Badge label={b.status} tone={b.status === "confirmed" ? "success" : "neutral"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}