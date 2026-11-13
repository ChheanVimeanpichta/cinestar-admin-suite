import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Settings, Menu, X, LogOut } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

interface AdminTopBarProps {
  onMenuClick?: () => void;
}

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setValue(q);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (v: string) => {
    setValue(v);
    if (v) {
      setSearchParams({ q: v });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-white/10">
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button
          onClick={() => onMenuClick?.()}
          className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="relative flex-1 max-w-xl">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
          />
          <input
            value={value}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search data..."
            className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-9 py-2 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors"
          />
          {value && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-onSurfaceVariant hover:text-onSurface"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          title={admin?.name ?? "Admin"}
          className="w-8 h-8 rounded bg-accent/20 text-accent flex items-center justify-center text-xs font-heading font-bold uppercase"
        >
          {admin?.name?.slice(0, 2) ?? "AD"}
        </span>

        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            title="Settings"
            className={`w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface transition-colors ${
              isSettingsOpen ? "bg-white/10 text-onSurface" : ""
            }`}
          >
            <Settings size={16} />
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded border border-white/10 bg-[#161619] shadow-2xl py-1 z-50 backdrop-blur-glass animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-2.5 border-b border-white/10">
                <p className="text-xs font-heading font-semibold text-onSurface truncate">
                  {admin?.name ?? "Administrator"}
                </p>
                <p className="text-[11px] font-mono text-onSurfaceVariant truncate mt-0.5">
                  {admin?.email ?? "admin@cinestar.com"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-heading text-onSurfaceVariant hover:text-accent hover:bg-white/5 transition-colors text-left"
              >
                <LogOut size={14} className="text-accent" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
