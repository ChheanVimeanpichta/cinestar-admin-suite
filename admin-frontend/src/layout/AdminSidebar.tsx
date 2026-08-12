import { NavLink } from "react-router-dom";
import {
  PlusCircle,
  LayoutGrid,
  Clapperboard,
  Clock,
  ClipboardList,
  Users as UsersIcon,
  Building2,
  LogOut,
} from "lucide-react";

const links = [
  { label: "Overview", to: "/admin", icon: <LayoutGrid size={16} /> },
  { label: "Movie Management", to: "/admin/movies", icon: <Clapperboard size={16} /> },
  { label: "Showtime Manager", to: "/admin/showtimes", icon: <Clock size={16} /> },
  { label: "Booking Log", to: "/admin/bookings", icon: <ClipboardList size={16} /> },
  { label: "Users", to: "/admin/users", icon: <UsersIcon size={16} /> },
  { label: "Theaters", to: "/admin/theaters", icon: <Building2 size={16} /> },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-white/10 flex flex-col p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
          <Clapperboard size={16} className="text-onSurface" />
        </div>
        <div>
          <p className="font-heading font-bold text-onSurface text-sm leading-none">CineStar</p>
          <p className="font-mono text-[10px] text-onSurfaceVariant tracking-wide">TERMINAL ACCESS</p>
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 bg-accent text-onSurface rounded py-3 mb-6 font-body font-medium text-sm hover:brightness-110 transition">
        <PlusCircle size={16} />
        New Screening
      </button>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded font-body text-body-md transition-colors ${
                isActive
                  ? "bg-accent text-onSurface"
                  : "text-onSurfaceVariant hover:bg-white/5 hover:text-onSurface"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Admin profile footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <img
          src="/admin-avatar.png"
          alt="Admin"
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-onSurface text-sm font-body font-medium truncate">Admin Profile</p>
          <p className="text-onSurfaceVariant text-xs truncate">admin@cinestar.io</p>
        </div>
        <button className="text-onSurfaceVariant hover:text-accent transition">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
