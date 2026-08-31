import { useEffect, useState, useRef } from "react";
import { Search, Download, RefreshCw, UserPlus, X, AlertTriangle, Upload, Camera, Trash2 } from "lucide-react";
import { AdminUserRecord, GrowthMetricPoint, UserRole, UserAccountStatus } from "../../types";
import {
  fetchUserManagementStats,
  fetchUsers,
  fetchUserGrowthMetrics,
  updateAdminUser,
  deleteAdminUser,
  apiPost,
} from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import UserFiltersPanel from "../../components/admin/UserFiltersPanel";
import GrowthMetricsCard from "../../components/admin/GrowthMetricsCard";
import UserTableRow from "../../components/admin/UserTableRow";

export default function Users() {
  const { admin: currentAdmin } = useAdminAuth();
  const isAdmin = currentAdmin?.email?.toLowerCase() === "admin@gmail.com";

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [growth, setGrowth] = useState<GrowthMetricPoint[]>([]);
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Edit User State
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editError, setEditError] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete User State
  const [deletingUser, setDeletingUser] = useState<AdminUserRecord | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Create User State
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [createError, setCreateError] = useState("");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const createFileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    fetchUserManagementStats().then((s) => setTotalUsers(s.totalUsers));
    fetchUserGrowthMetrics().then(setGrowth);
    fetchUsers({ role: roleFilter, status: statusFilter, search, page }).then((res) => {
      setUsers(res.records);
      setFilteredTotal(res.total);
    });
  };

  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter, search]);

  useEffect(() => {
    loadData();

    // Real-time polling every 3 seconds to fetch new customer registrations
    const interval = setInterval(() => {
      loadData();
    }, 3000);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cinestar_users" || e.key === "cinestar_current_user") {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [roleFilter, statusFilter, search, page]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setter(compressedDataUrl);
        } else if (typeof event.target?.result === "string") {
          setter(event.target.result);
        }
      };
      img.onerror = () => {
        if (typeof event.target?.result === "string") {
          setter(event.target.result);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleOpenEdit = (user: AdminUserRecord) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditAvatarUrl(user.avatarUrl || "");
    setEditError("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmittingEdit(true);
    setEditError("");
    try {
      await updateAdminUser(editingUser.id, {
        name: editName,
        email: editEmail,
        avatarUrl: editAvatarUrl,
      });
      // Optimistically update local users list for immediate feedback
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: editName,
                email: editEmail,
                avatarUrl: editAvatarUrl,
              }
            : u
        )
      );
      setEditingUser(null);
      loadData();
    } catch (err: any) {
      setEditError(err?.message || "Failed to update user");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleOpenDelete = (user: AdminUserRecord) => {
    setDeletingUser(user);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setIsSubmittingDelete(true);
    setDeleteError("");
    try {
      await deleteAdminUser(deletingUser.id);
      setDeletingUser(null);
      loadData();
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete user");
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    setCreateError("");
    try {
      await apiPost("/auth/register", {
        name: newName,
        email: newEmail,
        password: newPassword,
        avatarUrl: newAvatarUrl || undefined,
      });
      setIsCreatingUser(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewAvatarUrl("");
      loadData();
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create user");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="flex items-stretch gap-6 mb-6">
        <div className="flex-1 bg-surface-variant rounded p-8">
          <h1 className="font-heading font-black text-4xl uppercase text-onSurface leading-none">
            User<br />Management
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-4 max-w-md">
            Oversee administrative accounts, assign privileges, and manage real-time platform users.
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0 w-48">
          <div className="bg-surface-variant rounded p-5 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">
              Total Users
            </p>
            <p className="text-accent font-heading font-black text-3xl mt-2">
              {totalUsers ?? users.length}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setIsCreatingUser(true);
                setCreateError("");
                setNewAvatarUrl("");
              }}
              className="flex items-center justify-center gap-2 py-3 rounded bg-accent/80 text-onSurface text-sm font-body font-semibold hover:brightness-110 transition"
            >
              <UserPlus size={15} />
              New Staff
            </button>
          )}
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
            <button
              onClick={loadData}
              title="Refresh user list"
              className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant hover:text-onSurface hover:bg-white/10 transition"
            >
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
                <th className="font-medium pr-4">Bookings</th>
                <th className="font-medium pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    currentUserIsAdmin={isAdmin}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-onSurfaceVariant text-sm">
                    {roleFilter !== "All"
                      ? `No ${roleFilter.toLowerCase()} accounts found.`
                      : "No user records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination footer */}
          {(() => {
            const PAGE_SIZE = 5;
            const effectiveTotal = filteredTotal;
            const computedTotalPages = Math.max(1, Math.ceil(effectiveTotal / PAGE_SIZE));
            const pageNumbers = Array.from({ length: computedTotalPages }, (_, i) => i + 1);
            const startItem = effectiveTotal === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
            const endItem = Math.min(page * PAGE_SIZE, effectiveTotal);

            return (
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
                <p className="text-onSurfaceVariant text-xs font-mono">
                  Showing {startItem}-{endItem} of {effectiveTotal.toLocaleString()} users
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    ‹
                  </button>
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono transition-colors ${
                        page === p
                          ? "bg-accent/80 text-onSurface font-semibold"
                          : "text-onSurfaceVariant hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page >= computedTotalPages}
                    onClick={() => setPage((p) => Math.min(computedTotalPages, p + 1))}
                    className="w-7 h-7 rounded flex items-center justify-center text-onSurfaceVariant hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    ›
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-variant border border-white/10 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-heading font-bold text-lg text-onSurface">Edit User Account</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  {editAvatarUrl ? (
                    <img src={editAvatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={22} className="text-onSurfaceVariant" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-onSurface">Profile Photo</p>
                  <p className="text-[11px] text-onSurfaceVariant mb-2">Upload from PC (JPG, PNG)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setEditAvatarUrl)}
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded bg-white/10 text-onSurface text-xs font-medium hover:bg-white/20 flex items-center gap-1.5 transition"
                    >
                      <Upload size={12} />
                      {editAvatarUrl ? "Change Photo" : "Upload Photo"}
                    </button>
                    {editAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl("")}
                        className="p-1 rounded text-red-400 hover:bg-red-500/10 transition"
                        title="Remove photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-onSurfaceVariant mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-onSurface focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-onSurfaceVariant mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-onSurface focus:border-accent outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded bg-white/5 text-onSurface text-sm font-medium hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 rounded bg-accent text-onSurface text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition"
                >
                  {isSubmittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-variant border border-white/10 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle size={24} />
              <h3 className="font-heading font-bold text-lg text-onSurface">Delete User Account</h3>
            </div>

            <p className="text-onSurfaceVariant text-sm mb-4">
              Are you sure you want to delete user{" "}
              <strong className="text-onSurface">{deletingUser.name}</strong> (
              <span className="font-mono text-xs">{deletingUser.email}</span>)? This action is permanent and cannot be undone.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded bg-white/5 text-onSurface text-sm font-medium hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmittingDelete}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition"
              >
                {isSubmittingDelete ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Staff Modal */}
      {isCreatingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-variant border border-white/10 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-onSurface">Create Staff Account</h3>
                <p className="text-onSurfaceVariant text-xs mt-0.5">New user will be registered with the Staff role.</p>
              </div>
              <button
                onClick={() => setIsCreatingUser(false)}
                className="p-1 rounded text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleSaveCreate} className="space-y-4">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  {newAvatarUrl ? (
                    <img src={newAvatarUrl} alt="Staff Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={22} className="text-onSurfaceVariant" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-onSurface">Staff Photo (Optional)</p>
                  <p className="text-[11px] text-onSurfaceVariant mb-2">Upload from PC (JPG, PNG, WebP)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={createFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setNewAvatarUrl)}
                    />
                    <button
                      type="button"
                      onClick={() => createFileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded bg-white/10 text-onSurface text-xs font-medium hover:bg-white/20 flex items-center gap-1.5 transition"
                    >
                      <Upload size={12} />
                      {newAvatarUrl ? "Change Photo" : "Upload from PC"}
                    </button>
                    {newAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setNewAvatarUrl("")}
                        className="p-1 rounded text-red-400 hover:bg-red-500/10 transition"
                        title="Remove photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-onSurfaceVariant mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-onSurface focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-onSurfaceVariant mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@cinestar.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-onSurface focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-onSurfaceVariant mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-onSurface focus:border-accent outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreatingUser(false)}
                  className="px-4 py-2 rounded bg-white/5 text-onSurface text-sm font-medium hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-4 py-2 rounded bg-accent text-onSurface text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition"
                >
                  {isSubmittingCreate ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
