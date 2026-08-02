import { useEffect, useState } from "react";
import { Booking } from "../../types";
import { fetchAllBookings } from "../../services/bookingApi";
import Badge from "../../components/shared/Badge";
import SectionHeader from "../../components/shared/SectionHeader";

export default function BookingLog() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchAllBookings().then(setBookings);
  }, []);

  return (
    <div>
      <SectionHeader title="Booking Log" subtitle="All customer bookings" />
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