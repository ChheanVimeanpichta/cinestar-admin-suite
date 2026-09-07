import { useState } from "react";
import {
  Radio,
  Ticket,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Activity,
  Server,
} from "lucide-react";
import { SecurityStreamEvent } from "../../types";

interface SecurityStreamPanelProps {
  events: SecurityStreamEvent[];
}

export default function SecurityStreamPanel({ events }: SecurityStreamPanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "bookings" | "logins" | "alerts">("all");

  const filteredEvents = events.filter((e) => {
    if (activeTab === "all") return true;
    if (activeTab === "bookings") {
      return e.category === "booking" || e.message.toLowerCase().includes("booking");
    }
    if (activeTab === "logins") {
      return (
        e.category === "auth" ||
        e.message.toLowerCase().includes("login") ||
        e.message.toLowerCase().includes("authenticated") ||
        e.message.toLowerCase().includes("registered") ||
        e.message.toLowerCase().includes("session")
      );
    }
    if (activeTab === "alerts") {
      return (
        e.tone === "alert" ||
        e.tone === "warning" ||
        e.category === "security" ||
        e.message.toLowerCase().includes("blocked") ||
        e.message.toLowerCase().includes("failed") ||
        e.message.toLowerCase().includes("limit") ||
        e.message.toLowerCase().includes("suspended")
      );
    }
    return true;
  });

  const getEventIcon = (event: SecurityStreamEvent) => {
    if (event.tone === "alert") {
      return <ShieldAlert size={14} className="text-red-400" />;
    }
    if (event.tone === "warning") {
      return <AlertTriangle size={14} className="text-amber-400" />;
    }
    if (event.category === "booking" || event.message.toLowerCase().includes("booking")) {
      return <Ticket size={14} className="text-emerald-400" />;
    }
    if (
      event.category === "auth" ||
      event.message.toLowerCase().includes("login") ||
      event.message.toLowerCase().includes("registered")
    ) {
      return <UserCheck size={14} className="text-blue-400" />;
    }
    return <Activity size={14} className="text-purple-400" />;
  };

  const getToneBorder = (event: SecurityStreamEvent) => {
    if (event.tone === "alert") return "border-l-red-500 bg-red-950/15";
    if (event.tone === "warning") return "border-l-amber-500 bg-amber-950/15";
    if (event.category === "booking" || event.message.toLowerCase().includes("booking")) {
      return "border-l-emerald-500 bg-emerald-950/15";
    }
    if (event.category === "auth" || event.message.toLowerCase().includes("login")) {
      return "border-l-blue-500 bg-blue-950/15";
    }
    return "border-l-white/20 bg-white/[0.02]";
  };

  const renderMessage = (event: SecurityStreamEvent) => {
    if (!event.highlight) {
      return <span className="text-onSurfaceVariant text-xs leading-relaxed">{event.message}</span>;
    }
    const parts = event.message.split(event.highlight);
    if (parts.length <= 1) {
      return <span className="text-onSurfaceVariant text-xs leading-relaxed">{event.message}</span>;
    }
    return (
      <span className="text-onSurfaceVariant text-xs leading-relaxed">
        {parts[0]}
        <span className="text-white font-medium bg-white/10 px-1 py-0.5 rounded text-[11px] inline-block mx-0.5 border border-white/10">
          {event.highlight}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with live ping */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-onSurface font-bold flex items-center gap-1.5">
              <Radio size={13} className="text-red-500" />
              Live Security Stream
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-semibold">
          {events.length} Events
        </span>
      </div>

      {/* Sub-header description */}
      <p className="text-xs text-onSurfaceVariant mb-4 leading-normal">
        Real-time audit records of customer purchases, authentications, and system actions.
      </p>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 mb-4 rounded-xl bg-black/40 border border-white/10 text-[11px]">
        {(
          [
            { id: "all", label: "All" },
            { id: "bookings", label: "Bookings" },
            { id: "logins", label: "Logins" },
            { id: "alerts", label: "Alerts" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1 px-2 rounded-lg font-medium transition text-center ${
              activeTab === tab.id
                ? "bg-red-600 text-white shadow-sm font-semibold"
                : "text-onSurfaceVariant hover:text-onSurface hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Event Stream list */}
      <div className="flex flex-col gap-2.5 flex-1 max-h-[520px] overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-onSurfaceVariant text-xs space-y-1">
            <p>No activity logged in this category.</p>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="text-red-400 hover:underline text-[11px]"
            >
              Show all activities
            </button>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`border-l-[3px] p-2.5 rounded-r-lg border border-white/5 transition-colors hover:border-white/20 ${getToneBorder(
                event
              )}`}
            >
              {/* Event meta: Icon + Time + Tone Pill */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-black/40 border border-white/10">
                    {getEventIcon(event)}
                  </div>
                  {event.user && (
                    <span className="font-mono text-[10px] text-white/90 font-medium px-1.5 py-0.2 rounded bg-white/10 truncate max-w-[120px]">
                      {event.user}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-onSurfaceVariant">
                  <Clock size={10} />
                  <span>{event.timeAgo}</span>
                </div>
              </div>

              {/* Message text */}
              <div>{renderMessage(event)}</div>
            </div>
          ))
        )}
      </div>

      {/* System Status footer */}
      <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-onSurfaceVariant flex items-center gap-1.5">
            <Server size={12} className="text-onSurfaceVariant" />
            MySQL RDS Sync
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-onSurfaceVariant">Stream Auto-Poll</span>
          <span className="text-white/70">Every 6s</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">
              System Load
            </p>
            <span className="font-mono text-[10px] uppercase text-emerald-400">Optimal (18%)</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "18%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
