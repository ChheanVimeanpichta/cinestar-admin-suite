import { useEffect, useState } from "react";
import { Screening } from "../../types";
import { fetchAllScreenings } from "../../services/showtimeApi";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import SectionHeader from "../../components/shared/SectionHeader";
import Button from "../../components/shared/Button";

export default function ShowtimeManager() {
  const [screenings, setScreenings] = useState<Screening[]>([]);

  useEffect(() => {
    fetchAllScreenings().then(setScreenings);
  }, []);

  return (
    <div>
      <SectionHeader
        title="Showtime Manager"
        subtitle="Manage theater schedules"
        action={<Button>+ New Screening</Button>}
      />
      <div className="grid gap-3">
        {screenings.map((s) => (
          <Card key={s.id} className="flex justify-between items-center">
            <div>
              <p className="text-onSurface font-heading">{s.hall}</p>
              <p className="text-onSurfaceVariant text-sm">
                {s.date} • {s.time}
              </p>
            </div>
            <Badge label={s.format} tone="accent" />
          </Card>
        ))}
      </div>
    </div>
  );
}