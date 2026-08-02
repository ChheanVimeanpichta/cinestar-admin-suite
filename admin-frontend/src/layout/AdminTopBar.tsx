import { Search, Bell, Settings } from "lucide-react";

export default function AdminTopBar() {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
      <div className="flex items-center gap-4">
        <h1 className="font-heading font-bold text-lg text-accent tracking-wide">DASHBOARD</h1>
        <span className="text-onSurfaceVariant text-body-md">|</span>
        <span className="font-mono text-label-mono text-onSurfaceVariant">
          SYSTEM_STATUS: <span className="text-green-400">OPERATIONAL</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant"
          />
          <input
            placeholder="Search data..."
            className="bg-white/5 border border-white/10 rounded pl-9 pr-4 py-2 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none w-64"
          />
        </div>

        <button className="relative w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        <button className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
