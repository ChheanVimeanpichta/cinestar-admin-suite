export type FeedStatus = "success" | "updated" | "pending" | "failed";

export interface FeedEntry {
  id: string;
  timestamp: string; // e.g. "12:44:21"
  action: string;     // e.g. "BOOKING_CONFIRMED"
  targetEntity: string;
  userName: string;
  userInitials: string;
  status: FeedStatus;
}

interface SystemLiveFeedProps {
  entries: FeedEntry[];
  live?: boolean;
}

const statusStyles: Record<FeedStatus, string> = {
  success: "bg-green-500/10 text-green-400",
  updated: "bg-white/10 text-onSurfaceVariant",
  pending: "bg-yellow-500/10 text-yellow-400",
  failed: "bg-accent/10 text-accent",
};

// Deterministic-ish color per user so avatars stay consistent across renders
const avatarColors = ["bg-blue-500/30 text-blue-300", "bg-purple-500/30 text-purple-300", "bg-teal-500/30 text-teal-300"];

function avatarColor(seed: string) {
  const idx = seed.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

export default function SystemLiveFeed({ entries, live = true }: SystemLiveFeedProps) {
  return (
    <div className="bg-surface-variant rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading font-semibold text-onSurface">System Live Feed</p>
        {live && (
          <span className="flex items-center gap-2 text-green-400 text-xs font-mono uppercase">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live Streaming
          </span>
        )}
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10">
            <th className="py-3 font-medium">Timestamp</th>
            <th className="font-medium">Action</th>
            <th className="font-medium">Target Entity</th>
            <th className="font-medium">User</th>
            <th className="font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-white/5 last:border-0">
              <td className="py-4 font-mono text-accent text-sm">{e.timestamp}</td>
              <td className="text-onSurface text-sm font-mono">{e.action}</td>
              <td className="text-onSurfaceVariant text-sm">{e.targetEntity}</td>
              <td>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold ${avatarColor(
                      e.userInitials
                    )}`}
                  >
                    {e.userInitials}
                  </span>
                  <span className="text-onSurface text-sm">{e.userName}</span>
                </div>
              </td>
              <td>
                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase ${statusStyles[e.status]}`}
                >
                  {e.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
