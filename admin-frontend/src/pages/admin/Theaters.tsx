import { useEffect, useState } from "react";
import { Building2, LayoutGrid, Users2, ShieldCheck, Plus } from "lucide-react";
import { TheaterVenue, TheaterHall } from "../../types";
import { fetchTheaterVenues, fetchHallsForVenue, fetchVenueStats } from "../../services/theaterApi";
import ShowtimeStatCard from "../../components/admin/ShowtimeStatCard";
import VenueCard from "../../components/admin/VenueCard";
import HallRow from "../../components/admin/HallRow";

interface VenueStats {
  totalVenues: number;
  activeHalls: number;
  totalCapacity: number;
  systemHealth: string;
}

export default function Theaters() {
  const [stats, setStats] = useState<VenueStats | null>(null);
  const [venues, setVenues] = useState<TheaterVenue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [halls, setHalls] = useState<TheaterHall[]>([]);

  useEffect(() => {
    fetchVenueStats().then(setStats);
    fetchTheaterVenues().then((data) => {
      setVenues(data);
      if (data.length > 0) setSelectedVenueId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedVenueId) fetchHallsForVenue(selectedVenueId).then(setHalls);
  }, [selectedVenueId]);

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 font-heading font-black text-4xl uppercase text-onSurface">
            <Building2 size={30} className="text-accent" />
            Theater Venues
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-2 max-w-xl">
            Manage physical locations, hall layouts, and seating capacities.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded bg-accent text-onSurface text-sm font-body font-semibold hover:brightness-110 transition shrink-0">
          <Plus size={15} />
          Add Venue
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <ShowtimeStatCard label="Total Venues" value={stats ? String(stats.totalVenues) : "--"} icon={<Building2 size={18} />} />
        <ShowtimeStatCard label="Active Halls" value={stats ? String(stats.activeHalls) : "--"} icon={<LayoutGrid size={18} />} />
        <ShowtimeStatCard label="Total Capacity" value={stats ? stats.totalCapacity.toLocaleString() : "--"} icon={<Users2 size={18} />} />
        <ShowtimeStatCard label="System Health" value={stats?.systemHealth ?? "--"} icon={<ShieldCheck size={18} />} />
      </div>

      {/* Locations grid */}
      <h2 className="font-heading font-bold text-onSurface text-lg mb-4">Locations</h2>
      <div className="grid grid-cols-3 gap-5 mb-8">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            onManageHalls={() => setSelectedVenueId(venue.id)}
          />
        ))}
      </div>

      {/* Halls table for selected venue */}
      {selectedVenue && (
        <div className="bg-surface-variant rounded overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <p className="font-heading font-semibold text-onSurface">
              Halls: {selectedVenue.name}
            </p>
            <button className="flex items-center gap-1.5 text-accent text-sm font-body font-medium hover:underline">
              <Plus size={14} />
              Add Hall
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10">
                <th className="py-3 px-6 font-medium">Hall Name</th>
                <th className="py-3 pl-4 font-medium">Screen Type</th>
                <th className="py-3 pl-4 font-medium">Sound System</th>
                <th className="py-3 pl-4 font-medium">Capacity</th>
                <th className="py-3 pl-4 font-medium">Map</th>
                <th className="py-3 pl-4 pr-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="px-6">
              {halls.map((hall) => (
                <HallRow key={hall.id} hall={hall} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
