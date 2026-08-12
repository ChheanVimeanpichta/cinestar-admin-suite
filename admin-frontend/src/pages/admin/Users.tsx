import { useEffect, useState } from "react";
import { Search, Download, RefreshCw, UserPlus } from "lucide-react";
import { AdminUserRecord, GrowthMetricPoint, UserRole, UserAccountStatus } from "../../types";
import { fetchUserManagementStats, fetchUsers, fetchUserGrowthMetrics } from "../../services/api";
import UserFiltersPanel from "../../components/admin/UserFiltersPanel";
import GrowthMetricsCard from "../../components/admin/GrowthMetricsCard";
import UserTableRow from "../../components/admin/UserTableRow";

export default function Users() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [growth, setGrowth] = useState<GrowthMetricPoint[]>([]);
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUserManagementStats().then((s) => setTotalUsers(s.totalUsers));
    fetchUserGrowthMetrics().then(setGrowth);
  }, []);

  useEffect(() => {
    fetchUsers({ role: roleFilter, status: statusFilter, search, page }).then(setUsers);
  }, [roleFilter, statusFilter, search, page]);

  return (
    <div>
      {/* Hero */}
      <div className="flex items-stretch gap-6 mb-6">
        <div className="flex-1 bg-surface-variant rounded p-8">
          <h1 className="font-heading font-black text-4xl uppercase text-onSurface leading-none">
            User<br />Management
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-4 max-w-md">
            Oversee customer accounts, assign administrative privileges, and monitor platform
            engagement metrics.
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0 w-48">
          <div className="bg-surface-variant rounded p-5 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">
              Total Users
            </p>
            <p className="text-accent font-heading font-black text-3xl mt-2">
              {totalUsers?.toLocaleString() ?? "--"}
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 py-3 rounded bg-accent/80 text-onSurface text-sm font-body font-semibold hover:brightness-110 transition">
            <UserPlus size={15} />
            New User
          </button>
        </div>
      </div>

      {/* Body: filters + growth (left) / table (right) */}
      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col gap-4">
          <UserFiltersPanel
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onRoleChange={setRoleFilter}
            onStatusChange={setStatusFilter}
          />
          <GrowthMetricsCard data={growth} />
        </div>

        <div className="col-span-3 bg-surface-variant rounded overflow-hidden">
          {/* Table toolbar */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-4 py-2.5 text-sm text-onSurface placeholder:text-onSurfaceVariant outline-none"
              />
            </div>
            <button className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface">
              <Download size={15} />
            </button>
            <button className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface">
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-onSurfaceVariant font-mono text-[11px] uppercase border-b border-white/10">
                <th className="py-3 pl-6 font-medium">User</th>
                <th className="font-medium">Role</th>
                <th className="font-medium">Status</th>
                <th className="font-medium">Join Date</th>
                <th className="font-medium pr-6">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
            <p className="text-onSurfaceVariant text-xs font-mono">
              Showing {(page - 1) * 5 + 1}-{page * 5} of {totalUsers?.toLocaleString() ?? "--"} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5"
              >
                ‹
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono ${
                    page === p ? "bg-accent/80 text-onSurface" : "text-onSurfaceVariant hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
