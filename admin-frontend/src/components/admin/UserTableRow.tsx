import { Pencil, Trash2 } from "lucide-react";
import { AdminUserRecord } from "../../types";

const roleStyles: Record<string, string> = {
  Admin: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  Staff: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  Customer: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
};

const avatarFallbackColors = [
  "bg-blue-500/30 text-blue-300",
  "bg-emerald-500/30 text-emerald-300",
  "bg-purple-500/30 text-purple-300",
  "bg-teal-500/30 text-teal-300",
  "bg-accent/30 text-accent",
];

function fallbackColor(seed: string) {
  const idx = seed.charCodeAt(0) % avatarFallbackColors.length;
  return avatarFallbackColors[idx];
}

interface UserTableRowProps {
  user: AdminUserRecord;
  currentUserIsAdmin?: boolean;
  onEdit?: (user: AdminUserRecord) => void;
  onDelete?: (user: AdminUserRecord) => void;
}

export default function UserTableRow({
  user,
  currentUserIsAdmin = true,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const isSuspended = user.status === "Suspended";
  const isPrimaryAdmin = user.email.toLowerCase() === "admin@gmail.com";

  return (
    <tr
      className={`border-b border-white/5 last:border-0 transition-colors ${
        isSuspended ? "bg-accent/5" : "hover:bg-white/[0.02]"
      }`}
    >
      <td className="py-3.5 pr-4 pl-6">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${fallbackColor(
                user.initials
              )}`}
            >
              {user.initials}
            </span>
          )}
          <div>
            <p className="text-onSurface text-sm font-body font-medium">{user.name}</p>
            <p className="text-onSurfaceVariant text-xs">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="pr-4">
        <span className={`px-2 py-1 rounded text-[11px] font-body font-medium ${roleStyles[user.role] || roleStyles.Staff}`}>
          {user.role}
        </span>
      </td>
      <td className="pr-4">
        <span className="flex items-center gap-1.5 text-sm">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSuspended ? "bg-onSurfaceVariant" : "bg-green-400"
            }`}
          />
          <span className={isSuspended ? "text-onSurfaceVariant" : "text-onSurface"}>{user.status}</span>
        </span>
      </td>
      <td className="pr-4 text-onSurfaceVariant text-sm">{user.joinDate}</td>
      <td className="pr-4 text-onSurface text-sm font-mono">{user.bookingCount}</td>
      <td className="pr-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {currentUserIsAdmin && (
            <button
              onClick={() => onEdit?.(user)}
              title="Edit User"
              className="p-1.5 rounded bg-white/5 text-onSurfaceVariant hover:text-accent hover:bg-white/10 transition-colors"
            >
              <Pencil size={14} />
            </button>
          )}
          {currentUserIsAdmin && !isPrimaryAdmin && (
            <button
              onClick={() => onDelete?.(user)}
              title="Delete User"
              className="p-1.5 rounded bg-white/5 text-onSurfaceVariant hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
