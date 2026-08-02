import { useEffect, useState } from "react";
import { Booking } from "../../types";
import { fetchMyBookings } from "../../services/bookingApi";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import SectionHeader from "../../components/shared/SectionHeader";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchMyBookings().then(setBookings);
  }, []);

  return (
    <div className="px-12 py-12">
      <SectionHeader title="Booking History" subtitle="Your past cinematic journeys" />
      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b.id} glass className="flex justify-between items-center">
            <div>
              <p className="font-heading text-onSurface">{b.movieTitle}</p>
              <p className="text-onSurfaceVariant text-sm mt-1">
                {b.screening.date} • {b.screening.time} • {b.screening.format}
              </p>
              <p className="text-onSurfaceVariant text-sm">
                Seats: {b.seats.map((s) => s.id).join(", ")}
              </p>
            </div>
            <Badge
              label={b.status}
              tone={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "neutral" : "accent"}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}