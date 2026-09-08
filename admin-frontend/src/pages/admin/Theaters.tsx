import { useEffect, useRef, useState } from "react";
import {
  Building2,
  LayoutGrid,
  Users2,
  ShieldCheck,
  Plus,
  Table as TableIcon,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
  Tv,
  ArrowLeft,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TheaterVenue, TheaterHall } from "../../types";
import {
  fetchTheaterVenues,
  fetchHallsForVenue,
  fetchVenueStats,
  createVenue,
  updateVenue,
  deleteVenue,
  createHall,
  updateHall,
  deleteHall,
} from "../../services/theaterApi";
import ShowtimeStatCard from "../../components/admin/ShowtimeStatCard";
import VenueCard from "../../components/admin/VenueCard";
import HallRow from "../../components/admin/HallRow";
import VenueFormModal from "../../components/theaters/VenueFormModal";
import HallFormModal from "../../components/theaters/HallFormModal";
import SeatMapModal from "../../components/theaters/SeatMapModal";
import VenueSwitcher from "../../components/theaters/VenueSwitcher";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface VenueStats {
  totalVenues: number;
  activeHalls: number;
  totalCapacity: number;
  systemHealth: string;
}

export default function Theaters() {
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role === "admin" || admin?.email?.toLowerCase() === "admin@gmail.com";

  const [stats, setStats] = useState<VenueStats | null>(null);
  const [venues, setVenues] = useState<TheaterVenue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [halls, setHalls] = useState<TheaterHall[]>([]);
  const [loadingHalls, setLoadingHalls] = useState(false);

  // Search & Filter & Pagination state
  const [searchVenueQuery, setSearchVenueQuery] = useState("");
  const [searchHallQuery, setSearchHallQuery] = useState("");
  const [selectedFormatFilter, setSelectedFormatFilter] = useState("ALL");
  const [venuePage, setVenuePage] = useState(1);
  const VENUES_PER_PAGE = 9;

  // View mode toggle: "cards" (poster/visual grid) vs "table" (data-dense table)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Venue modal state
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<TheaterVenue | null>(null);
  const [isSavingVenue, setIsSavingVenue] = useState(false);

  // Hall modal state
  const [showHallModal, setShowHallModal] = useState(false);
  const [editingHall, setEditingHall] = useState<TheaterHall | null>(null);
  const [isSavingHall, setIsSavingHall] = useState(false);

  // Seat map modal state
  const [viewingMapHall, setViewingMapHall] = useState<TheaterHall | null>(null);

  // Delete Venue state
  const [deletingVenue, setDeletingVenue] = useState<TheaterVenue | null>(null);
  const [isDeletingVenue, setIsDeletingVenue] = useState(false);

  // Delete Hall state
  const [deletingHall, setDeletingHall] = useState<TheaterHall | null>(null);
  const [isDeletingHall, setIsDeletingHall] = useState(false);

  // Feedback notification state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const hallsSectionRef = useRef<HTMLDivElement | null>(null);

  const loadVenuesAndStats = async () => {
    try {
      const [vData, sData] = await Promise.all([
        fetchTheaterVenues(),
        fetchVenueStats(),
      ]);
      setVenues(vData);
      setStats(sData);
    } catch (err: any) {
      console.warn("Failed to load venues or stats:", err);
    }
  };

  useEffect(() => {
    loadVenuesAndStats();
  }, []);

  const loadHalls = async (venueId: string) => {
    try {
      setLoadingHalls(true);
      const data = await fetchHallsForVenue(venueId);
      setHalls(data);
    } catch (err: any) {
      console.warn("Failed to load halls for venue:", err);
    } finally {
      setLoadingHalls(false);
    }
  };

  useEffect(() => {
    if (selectedVenueId) {
      loadHalls(selectedVenueId);
    } else {
      setHalls([]);
    }
  }, [selectedVenueId]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Handle "Manage Halls" action from a card or table row
  const handleManageHalls = (venueId: string) => {
    setSelectedVenueId(venueId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Venue CRUD Handlers
  const handleOpenAddVenue = () => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to add venues." });
      return;
    }
    setEditingVenue(null);
    setShowVenueModal(true);
  };

  const handleOpenEditVenue = (venue: TheaterVenue) => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to edit venues." });
      return;
    }
    setEditingVenue(venue);
    setShowVenueModal(true);
  };

  const handleSaveVenue = async (venueData: Partial<TheaterVenue>) => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to save venues." });
      return;
    }
    try {
      setIsSavingVenue(true);
      if (editingVenue) {
        const updated = await updateVenue(editingVenue.id, venueData);
        setVenues((prev) =>
          prev.map((v) => (v.id === editingVenue.id ? { ...v, ...updated } : v))
        );
        setFeedback({ type: "success", message: `Venue "${venueData.name}" updated successfully!` });
      } else {
        const created = await createVenue(venueData);
        setVenues((prev) => [...prev, created]);
        setSelectedVenueId(created.id);
        setFeedback({ type: "success", message: `Venue "${created.name}" created successfully!` });
      }
      setShowVenueModal(false);
      setEditingVenue(null);
      await loadVenuesAndStats();
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Failed to save venue" });
    } finally {
      setIsSavingVenue(false);
    }
  };

  const confirmDeleteVenue = async () => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to delete venues." });
      return;
    }
    if (!deletingVenue) return;
    try {
      setIsDeletingVenue(true);
      await deleteVenue(deletingVenue.id);
      setFeedback({ type: "success", message: `Venue "${deletingVenue.name}" removed.` });
      const deletedId = deletingVenue.id;
      setDeletingVenue(null);
      if (selectedVenueId === deletedId) {
        setSelectedVenueId(null);
      }
      await loadVenuesAndStats();
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Failed to delete venue" });
    } finally {
      setIsDeletingVenue(false);
    }
  };

  // Hall CRUD Handlers
  const handleOpenAddHall = () => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to add halls." });
      return;
    }
    setEditingHall(null);
    setShowHallModal(true);
  };

  const handleOpenEditHall = (hall: TheaterHall) => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to edit halls." });
      return;
    }
    setEditingHall(hall);
    setShowHallModal(true);
  };

  const handleSaveHall = async (hallData: Partial<TheaterHall>) => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to save halls." });
      return;
    }
    if (!selectedVenueId) return;
    try {
      setIsSavingHall(true);
      if (editingHall) {
        await updateHall(editingHall.id, hallData);
        setFeedback({ type: "success", message: `Hall "${hallData.name}" updated successfully!` });
      } else {
        await createHall(selectedVenueId, hallData);
        setFeedback({ type: "success", message: `Hall "${hallData.name}" added to venue!` });
      }
      setShowHallModal(false);
      setEditingHall(null);
      await loadHalls(selectedVenueId);
      await loadVenuesAndStats();
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Failed to save hall" });
    } finally {
      setIsSavingHall(false);
    }
  };

  const confirmDeleteHall = async () => {
    if (!isAdmin) {
      setFeedback({ type: "error", message: "Access denied: Only Administrators have permission to delete halls." });
      return;
    }
    if (!deletingHall || !selectedVenueId) return;
    try {
      setIsDeletingHall(true);
      await deleteHall(deletingHall.id);
      setFeedback({ type: "success", message: `Hall "${deletingHall.name}" removed.` });
      setDeletingHall(null);
      await loadHalls(selectedVenueId);
      await loadVenuesAndStats();
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Failed to delete hall" });
    } finally {
      setIsDeletingHall(false);
    }
  };

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  // Filtered venues for directory view
  const filteredVenues = venues.filter((v) => {
    const q = searchVenueQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      v.name.toLowerCase().includes(q) ||
      (v.address && v.address.toLowerCase().includes(q))
    );
  });

  const totalVenuePages = Math.ceil(filteredVenues.length / VENUES_PER_PAGE) || 1;
  const paginatedVenues = filteredVenues.slice(
    (venuePage - 1) * VENUES_PER_PAGE,
    venuePage * VENUES_PER_PAGE
  );

  useEffect(() => {
    setVenuePage(1);
  }, [searchVenueQuery]);

  // Filtered halls for single venue view
  const filteredHalls = halls.filter((h) => {
    const matchesFormat =
      selectedFormatFilter === "ALL" || h.screenType === selectedFormatFilter;
    const q = searchHallQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      h.name.toLowerCase().includes(q) ||
      h.screenType.toLowerCase().includes(q) ||
      h.soundSystem.toLowerCase().includes(q);
    return matchesFormat && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Toast feedback banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border text-sm animate-fadeIn ${
            feedback.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {selectedVenue ? (
        /* ======================================================== */
        /* VIEW 1: FOCUSED VENUE & HALL MANAGEMENT (ONLY THIS VENUE) */
        /* ======================================================== */
        <div className="space-y-6 animate-fadeIn">
          {/* Top Bar: Back to All Venues + Quick Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-surface-variant border border-white/10">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedVenueId(null)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-onSurface text-xs font-semibold border border-white/10 transition group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>All Venues</span>
              </button>
              <span className="text-white/20">/</span>
              <span className="font-heading font-bold text-sm text-onSurface">
                {selectedVenue.name}
              </span>
            </div>

            {/* Searchable Venue Switcher Combobox (Handles 100+ venues effortlessly) */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-onSurfaceVariant hidden sm:inline">
                Switch venue:
              </span>
              <VenueSwitcher
                venues={venues}
                selectedVenueId={selectedVenueId}
                onSelectVenue={(vId) => {
                  setSelectedVenueId(vId);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onAddNewVenue={handleOpenAddVenue}
              />
            </div>
          </div>

          {/* Selected Venue Hero Banner (Shows ONLY this venue) */}
          <div className="relative rounded-2xl bg-surface-variant border border-white/10 overflow-hidden p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left: Cover Image + Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <img
                  src={selectedVenue.imageUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop"}
                  alt={selectedVenue.name}
                  className="w-full sm:w-44 h-32 rounded-xl object-cover border border-white/10 bg-black/40 shadow-md shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop";
                  }}
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-heading font-black text-2xl text-onSurface">
                      {selectedVenue.name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] border ${
                        selectedVenue.status === "Active"
                          ? "bg-green-500/15 border-green-500/30 text-green-400"
                          : "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedVenue.status === "Active" ? "bg-green-400" : "bg-yellow-400"
                        }`}
                      />
                      {selectedVenue.status}
                    </span>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-onSurfaceVariant">
                    <MapPin size={14} className="text-red-400 shrink-0" />
                    <span>{selectedVenue.address || "No address specified"}</span>
                  </p>

                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-onSurfaceVariant">Auditoriums:</span>
                      <span className="font-heading font-bold text-onSurface text-sm">
                        {halls.length}
                      </span>
                    </div>
                    <span className="text-white/20">•</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-onSurfaceVariant">Total Seating Capacity:</span>
                      <span className="font-mono font-semibold text-onSurface text-sm">
                        {selectedVenue.capacity.toLocaleString()} seats
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-end">
                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEditVenue(selectedVenue)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-onSurface text-xs font-semibold border border-white/10 transition"
                    >
                      <Pencil size={14} />
                      Edit Venue
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingVenue(selectedVenue)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-onSurfaceVariant hover:text-red-400 text-xs font-semibold border border-white/10 hover:border-red-500/30 transition"
                    >
                      <Trash2 size={14} />
                      Delete Venue
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddHall}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition shadow-lg shadow-red-600/25"
                    >
                      <Plus size={15} />
                      Add Hall
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                    Staff (Read-Only)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Auditoriums & Halls Table for THIS Venue */}
          <div ref={hallsSectionRef} className="bg-surface-variant rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            {/* Section Header with Search & Format Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
                  <Tv size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-onSurface">
                    Auditoriums &amp; Halls
                  </h3>
                  <p className="text-xs text-onSurfaceVariant">
                    {halls.length} halls configured • {selectedVenue.capacity.toLocaleString()} total capacity
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Search Halls */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
                  <input
                    type="text"
                    value={searchHallQuery}
                    onChange={(e) => setSearchHallQuery(e.target.value)}
                    placeholder="Search halls..."
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-onSurface placeholder:text-onSurfaceVariant focus:outline-none focus:border-red-500/50 w-36 sm:w-44"
                  />
                </div>

                {/* Format Filter */}
                <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px]">
                  {["ALL", "STANDARD", "IMAX", "4DX"].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormatFilter(fmt)}
                      className={`px-2 py-1 rounded-md transition ${
                        selectedFormatFilter === fmt
                          ? "bg-red-600 text-white font-medium shadow-sm"
                          : "text-onSurfaceVariant hover:text-onSurface"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                {isAdmin && (
                  <button
                    onClick={handleOpenAddHall}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition shadow-md shadow-red-600/20 shrink-0"
                  >
                    <Plus size={14} />
                    Add Hall
                  </button>
                )}
              </div>
            </div>

            {/* Halls Table */}
            {loadingHalls ? (
              <div className="py-12 flex justify-center items-center text-onSurfaceVariant text-xs">
                <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
                Loading auditoriums...
              </div>
            ) : filteredHalls.length === 0 ? (
              <div className="py-12 text-center text-onSurfaceVariant text-xs space-y-3">
                <p>
                  {searchHallQuery || selectedFormatFilter !== "ALL"
                    ? "No auditoriums match your filter."
                    : "No halls registered for this venue yet. Click 'Add Hall' to create one."}
                </p>
                {!searchHallQuery && selectedFormatFilter === "ALL" && isAdmin && (
                  <button
                    type="button"
                    onClick={handleOpenAddHall}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition shadow-md shadow-red-600/20"
                  >
                    <Plus size={14} />
                    Add First Hall
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10 bg-white/[0.01]">
                    <th className="py-3 px-6 font-medium">Hall Name</th>
                    <th className="py-3 pl-4 font-medium">Screen Type</th>
                    <th className="py-3 pl-4 font-medium">Sound System</th>
                    <th className="py-3 pl-4 font-medium">Capacity</th>
                    <th className="py-3 pl-4 font-medium">Seating Map</th>
                    <th className="py-3 pl-4 pr-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHalls.map((hall) => (
                    <HallRow
                      key={hall.id}
                      hall={hall}
                      onOpenMap={() => setViewingMapHall(hall)}
                      onEdit={isAdmin ? () => handleOpenEditHall(hall) : undefined}
                      onDelete={isAdmin ? () => setDeletingHall(hall) : undefined}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW 2: ALL VENUES DIRECTORY OVERVIEW                    */
        /* ======================================================== */
        <div className="space-y-8 animate-fadeIn">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 font-heading font-black text-3xl sm:text-4xl uppercase text-onSurface">
                <Building2 size={30} className="text-red-500" />
                Theater Venues
              </h1>
              <p className="text-onSurfaceVariant text-body-md mt-1 max-w-xl">
                Select a cinema location to manage its auditoriums, formats, and seating layouts.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={handleOpenAddVenue}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-onSurface text-sm font-body font-semibold transition shadow-lg shadow-red-600/20 shrink-0 self-start sm:self-auto"
              >
                <Plus size={16} />
                Add Venue
              </button>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ShowtimeStatCard
              label="Total Venues"
              value={stats ? String(stats.totalVenues) : "--"}
              icon={<Building2 size={18} />}
            />
            <ShowtimeStatCard
              label="Active Halls"
              value={stats ? String(stats.activeHalls) : "--"}
              icon={<LayoutGrid size={18} />}
            />
            <ShowtimeStatCard
              label="Total Capacity"
              value={stats ? stats.totalCapacity.toLocaleString() : "--"}
              icon={<Users2 size={18} />}
            />
            <ShowtimeStatCard
              label="System Health"
              value={stats?.systemHealth ?? "--"}
              icon={<ShieldCheck size={18} />}
            />
          </div>

          {/* Locations Section Header + Search & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-onSurface text-xl">
                Locations &amp; Complexes ({venues.length})
              </h2>
              <p className="text-xs text-onSurfaceVariant mt-0.5">
                Click "Manage Halls" on any venue to configure its screens.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Venues */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
                <input
                  type="text"
                  value={searchVenueQuery}
                  onChange={(e) => setSearchVenueQuery(e.target.value)}
                  placeholder="Search venue name or address..."
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-surface-variant border border-white/10 text-xs text-onSurface placeholder:text-onSurfaceVariant focus:outline-none focus:border-red-500/50 w-56 sm:w-64"
                />
              </div>

              {/* View Mode Toggle: Cards vs Table */}
              <div className="flex items-center p-1 rounded-xl bg-surface-variant border border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  title="Poster Card View"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "cards"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-onSurfaceVariant hover:text-onSurface"
                  }`}
                >
                  <LayoutGrid size={14} />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  title="Data Table View"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "table"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-onSurfaceVariant hover:text-onSurface"
                  }`}
                >
                  <TableIcon size={14} />
                  <span>Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Locations List: Poster Cards View vs Table View */}
          {filteredVenues.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface-variant border border-white/10 text-onSurfaceVariant text-xs space-y-2">
              <p>No venues match your search query "{searchVenueQuery}".</p>
              <button
                type="button"
                onClick={() => setSearchVenueQuery("")}
                className="text-red-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isSelected={false}
                  onManageHalls={() => handleManageHalls(venue.id)}
                  onEdit={isAdmin ? () => handleOpenEditVenue(venue) : undefined}
                  onDelete={isAdmin ? () => setDeletingVenue(venue) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface-variant rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10 bg-white/[0.02]">
                    <th className="py-3 px-6 font-medium">Venue Location</th>
                    <th className="py-3 pl-4 font-medium">Address</th>
                    <th className="py-3 pl-4 font-medium">Status</th>
                    <th className="py-3 pl-4 font-medium">Halls</th>
                    <th className="py-3 pl-4 font-medium">Capacity</th>
                    <th className="py-3 pl-4 pr-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVenues.map((venue) => (
                    <tr
                      key={venue.id}
                      onClick={() => handleManageHalls(venue.id)}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={venue.imageUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop"}
                            alt={venue.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop";
                            }}
                            className="w-12 h-10 rounded-lg object-cover border border-white/10 shrink-0 bg-black/40"
                          />
                          <div>
                            <p className="font-heading font-bold text-sm text-onSurface">
                              {venue.name}
                            </p>
                            <span className="text-[10px] text-onSurfaceVariant font-mono">
                              Click to manage
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pl-4 pr-4 text-xs text-onSurfaceVariant max-w-xs truncate">
                        {venue.address}
                      </td>
                      <td className="py-4 pl-4 pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] border ${
                            venue.status === "Active"
                              ? "bg-green-500/15 border-green-500/30 text-green-400"
                              : "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              venue.status === "Active" ? "bg-green-400" : "bg-yellow-400"
                            }`}
                          />
                          {venue.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 pr-4 font-heading font-bold text-sm text-onSurface">
                        {venue.hallCount}
                      </td>
                      <td className="py-4 pl-4 pr-4 font-mono text-xs text-onSurface">
                        {venue.capacity.toLocaleString()}
                      </td>
                      <td className="py-4 pl-4 pr-6 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleManageHalls(venue.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all shadow-sm"
                          >
                            Manage Halls
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEditVenue(venue)}
                                title="Edit Venue"
                                className="p-1.5 rounded-lg text-onSurfaceVariant hover:text-onSurface hover:bg-white/10 transition-colors"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingVenue(venue)}
                                title="Delete Venue"
                                className="p-1.5 rounded-lg text-onSurfaceVariant hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls for Large Venue Counts (100+ Venues) */}
          {totalVenuePages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs text-onSurfaceVariant">
              <div>
                Showing{" "}
                <span className="font-semibold text-onSurface">
                  {(venuePage - 1) * VENUES_PER_PAGE + 1}–
                  {Math.min(venuePage * VENUES_PER_PAGE, filteredVenues.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-onSurface">
                  {filteredVenues.length}
                </span>{" "}
                locations
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={venuePage <= 1}
                  onClick={() => setVenuePage((p) => Math.max(p - 1, 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-variant border border-white/10 hover:border-white/20 disabled:opacity-40 disabled:pointer-events-none text-onSurface transition"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalVenuePages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalVenuePages || Math.abs(p - venuePage) <= 1)
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      return (
                        <div key={p} className="flex items-center">
                          {prev && p - prev > 1 && (
                            <span className="px-1 text-white/30">...</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setVenuePage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition ${
                              p === venuePage
                                ? "bg-red-600 text-white font-bold shadow-sm"
                                : "hover:bg-white/10 text-onSurfaceVariant hover:text-onSurface"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  type="button"
                  disabled={venuePage >= totalVenuePages}
                  onClick={() => setVenuePage((p) => Math.min(p + 1, totalVenuePages))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-variant border border-white/10 hover:border-white/20 disabled:opacity-40 disabled:pointer-events-none text-onSurface transition"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Venue Modal */}
      {isAdmin && (
        <VenueFormModal
          open={showVenueModal}
          onClose={() => {
            setShowVenueModal(false);
            setEditingVenue(null);
          }}
          onSave={handleSaveVenue}
          editVenue={editingVenue}
          isSaving={isSavingVenue}
        />
      )}

      {/* Add / Edit Hall Modal */}
      {isAdmin && (
        <HallFormModal
          open={showHallModal}
          onClose={() => {
            setShowHallModal(false);
            setEditingHall(null);
          }}
          onSave={handleSaveHall}
          venueName={selectedVenue?.name || ""}
          editHall={editingHall}
          isSaving={isSavingHall}
        />
      )}

      {/* Interactive Seating Layout Preview Modal */}
      <SeatMapModal
        open={!!viewingMapHall}
        onClose={() => setViewingMapHall(null)}
        hall={viewingMapHall}
        venueName={selectedVenue?.name}
      />

      {/* Delete Venue Confirmation Modal */}
      {deletingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-onSurface font-heading">
                  Delete Venue?
                </h3>
                <p className="text-xs text-onSurfaceVariant">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-onSurfaceVariant mb-6 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-onSurface font-semibold">
                "{deletingVenue.name}"
              </strong>
              ? All registered halls under this location will also be removed.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeletingVenue}
                onClick={() => setDeletingVenue(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingVenue}
                onClick={confirmDeleteVenue}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-red-600/30"
              >
                {isDeletingVenue && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Delete Venue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Hall Confirmation Modal */}
      {deletingHall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-onSurface font-heading">
                  Delete Hall?
                </h3>
                <p className="text-xs text-onSurfaceVariant">
                  Permanent action
                </p>
              </div>
            </div>

            <p className="text-xs text-onSurfaceVariant mb-6 leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-onSurface font-semibold">
                "{deletingHall.name}"
              </strong>{" "}
              ({deletingHall.screenType}, {deletingHall.capacity} seats) from{" "}
              <strong className="text-onSurface">{selectedVenue?.name}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeletingHall}
                onClick={() => setDeletingHall(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingHall}
                onClick={confirmDeleteHall}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-red-600/30"
              >
                {isDeletingHall && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Delete Hall
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
