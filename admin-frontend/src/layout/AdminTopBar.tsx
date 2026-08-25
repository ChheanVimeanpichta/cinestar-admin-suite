import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Bell, Settings, Menu, X, LogOut } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

interface AdminTopBarProps {
  onMenuClick?: () => void;
}

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setValue(q);
  }, [searchParams]);

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

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        <button className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface">
          <Settings size={16} />
        </button>

        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
          <span
            title={admin?.name ?? "Admin"}
            className="w-8 h-8 rounded bg-accent/20 text-accent flex items-center justify-center text-xs font-heading font-bold uppercase"
          >
            {admin?.name?.slice(0, 2) ?? "AD"}
          </span>
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            title="Sign out"
            className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-accent hover:bg-accent/10 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
