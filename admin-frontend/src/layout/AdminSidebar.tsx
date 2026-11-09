import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Clapperboard,
  Clock,
  ClipboardList,
  Users as UsersIcon,
  Building2,
  Tag,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchSidebarStats, SidebarStats } from "../services/dashboardApi";

interface SidebarLink {
  label: string;
  to: string;
  icon: JSX.Element;
  badgeKey?: keyof SidebarStats;
  badgeHighlight?: boolean;
}

const links: SidebarLink[] = [
  { label: "Overview", to: "/admin", icon: <LayoutGrid size={16} /> },
  { label: "Movie Management", to: "/admin/movies", icon: <Clapperboard size={16} />, badgeKey: "movies" },
  { label: "Showtime Manager", to: "/admin/showtimes", icon: <Clock size={16} />, badgeKey: "showtimes" },
  { label: "Booking Log", to: "/admin/bookings", icon: <ClipboardList size={16} />, badgeKey: "bookings", badgeHighlight: true },
  { label: "Users", to: "/admin/users", icon: <UsersIcon size={16} />, badgeKey: "users" },
  { label: "Theaters", to: "/admin/theaters", icon: <Building2 size={16} />, badgeKey: "theaters" },
  { label: "Offers", to: "/admin/offers", icon: <Tag size={16} />, badgeKey: "offers" },
];

export default function AdminSidebar() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const isAdmin = admin?.role === "admin" || admin?.email?.toLowerCase() === "admin@gmail.com";
  const [stats, setStats] = useState<SidebarStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadStats = () => {
      fetchSidebarStats()
        .then((data) => {
          if (isMounted) setStats(data);
        })
        .catch(() => {});
    };

    loadStats();
    // Poll every 6s so sidebar badges update dynamically in real time
    const interval = setInterval(loadStats, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <aside className="w-64 bg-surface border-r border-white/10 flex flex-col p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center shadow-sm">
          <Clapperboard size={16} className="text-onSurface" />
        </div>
        <div>
          <p className="font-heading font-bold text-onSurface text-sm leading-none">CineStar</p>
          <p className="font-mono text-[10px] text-onSurfaceVariant tracking-wide">
            {isAdmin ? "TERMINAL ACCESS" : "STAFF ACCESS"}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const count = link.badgeKey && stats ? stats[link.badgeKey] : undefined;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded font-body text-body-md transition-all ${
                  isActive
                    ? "bg-accent text-onSurface font-semibold shadow-sm"
                    : "text-onSurfaceVariant hover:bg-white/5 hover:text-onSurface"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    {link.icon}
                    <span className="truncate">{link.label}</span>
                  </div>

                  {count !== undefined && (
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2 shrink-0 transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : link.badgeHighlight && count > 0
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-white/5 text-onSurfaceVariant/80 border border-white/10"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin profile footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-heading font-bold uppercase shrink-0">
          {admin?.name?.slice(0, 2) ?? "AD"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-onSurface text-sm font-body font-medium truncate">{admin?.name ?? "Admin"}</p>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                isAdmin
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {isAdmin ? "admin" : "staff"}
            </span>
          </div>
          <p className="text-onSurfaceVariant text-xs truncate">{admin?.email ?? "admin@gmail.com"}</p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          title="Sign out"
          className="text-onSurfaceVariant hover:text-accent transition"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
