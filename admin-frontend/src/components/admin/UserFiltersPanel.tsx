import { SlidersHorizontal } from "lucide-react";
import { UserRole, UserAccountStatus } from "../../types";

interface UserFiltersPanelProps {
  roleFilter: UserRole | "All";
  statusFilter: UserAccountStatus | "All";
  onRoleChange: (role: UserRole | "All") => void;
  onStatusChange: (status: UserAccountStatus | "All") => void;
}

const roleOptions: (UserRole | "All")[] = ["All", "Admin", "Staff", "Customer"];
const statusOptions: (UserAccountStatus | "All")[] = ["All", "Active", "Suspended"];

function FilterPill({
  label,
  active,
  onClick,
  dotColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dotColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-body font-medium transition-colors ${
        active
          ? "bg-accent/80 text-onSurface"
          : "bg-white/5 text-onSurfaceVariant hover:bg-white/10"
      }`}
    >
      {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {label}
    </button>
  );
}

export default function UserFiltersPanel({
  roleFilter,
  statusFilter,
  onRoleChange,
  onStatusChange,
}: UserFiltersPanelProps) {
  return (
    <div className="bg-surface-variant rounded p-5">
      <p className="flex items-center gap-2 font-heading font-semibold text-onSurface mb-5">
        <SlidersHorizontal size={15} />
        Filters
      </p>

      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2.5">
          Role
        </p>
        <div className="flex flex-wrap gap-2">
          {roleOptions.map((role) => (
            <FilterPill
              key={role}
              label={role}
              active={roleFilter === role}
              onClick={() => onRoleChange(role)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant mb-2.5">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <FilterPill
              key={status}
              label={status}
              active={statusFilter === status}
              onClick={() => onStatusChange(status)}
              dotColor={
                status === "Active" ? "bg-green-400" : status === "Suspended" ? "bg-onSurfaceVariant" : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
