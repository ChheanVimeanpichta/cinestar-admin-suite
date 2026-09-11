import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Tag,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Upload,
  AlertTriangle,
  Eye,
  EyeOff,
  MoreVertical,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AdminOffer,
  AdminOfferBullet,
  fetchAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../../services/api";

const DEFAULT_EMOJIS = ["🎬", "🍿", "🥤", "🎓", "✨", "🎟️", "🍕", "🎉", "🔥", "⭐"];
const BADGE_SUGGESTIONS = [
  "STUDENT PERK",
  "CONCESSION",
  "SNACKS & DRINKS",
  "TICKET DEAL",
  "COMBO BUNDLE",
  "ADD-ON PERK",
  "VIP SPECIAL",
  "LIMITED OFFER",
];

const PAGE_SIZE = 8;

export function broadcastOffersUpdated() {
  try {
    localStorage.setItem("cinestar_offers_updated", Date.now().toString());
    window.dispatchEvent(new CustomEvent("cinestar:offers-updated"));
  } catch {}
}

interface ActionMenuProps {
  offer: AdminOffer;
  onEdit: (offer: AdminOffer) => void;
  onToggleStatus: (offer: AdminOffer) => void;
  onDelete: (offer: AdminOffer) => void;
}

function ActionMenu({ offer, onEdit, onToggleStatus, onDelete }: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md p-1.5 text-onSurfaceVariant hover:bg-surface-variant hover:text-onSurface transition"
        title="More actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-30 w-44 rounded-lg border border-white/10 bg-surface shadow-2xl py-1">
            <button
              type="button"
              onClick={() => {
                onEdit(offer);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-onSurface hover:bg-white/5 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5 text-onSurfaceVariant" />
              Edit Details
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleStatus(offer);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-onSurface hover:bg-white/5 transition-colors"
            >
              {offer.status === "Active" ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
                  Set to Inactive
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-emerald-400" />
                  Set to Active
                </>
              )}
            </button>
            <div className="my-1 border-t border-white/10" />
            <button
              type="button"
              onClick={() => {
                onDelete(offer);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Offer
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Offers() {
  const [offers, setOffers] = useState<AdminOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<AdminOffer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<AdminOffer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form fields
  const [formId, setFormId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCaption, setFormCaption] = useState("");
  const [formBadge, setFormBadge] = useState("TICKET DEAL");
  const [formTag, setFormTag] = useState("SPECIAL DEAL");
  const [formValidity, setFormValidity] = useState("Limited Time");
  const [formImage, setFormImage] = useState("");
  const [formIcon, setFormIcon] = useState("🎬");
  const [formDescription, setFormDescription] = useState("");
  const [formBullets, setFormBullets] = useState<AdminOfferBullet[]>([
    { icon: "✨", text: "" },
    { icon: "🍿", text: "" },
  ]);
  const [formPublishDate, setFormPublishDate] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadOffers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await fetchAllOffers(true);
      setOffers(data);
    } catch (err: any) {
      if (!silent) {
        console.error("Failed to load offers:", err);
        showFeedback("error", err?.message || "Failed to load offers from server.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await loadOffers();
      showFeedback("success", "Offers list refreshed.");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadOffers();

    // Real-time SSE stream
    let eventSource: EventSource | null = null;
    try {
      const streamUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/+$/, "") + "/offers/stream";
      eventSource = new EventSource(streamUrl);
      eventSource.onmessage = () => {
        loadOffers(true);
      };
    } catch {}

    // Auto-polling every 2.5s for real-time synchronization
    const interval = setInterval(() => {
      loadOffers(true);
    }, 2500);

    const onFocus = () => {
      loadOffers(true);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === "cinestar_offers_updated") {
        loadOffers(true);
      }
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    window.addEventListener("cinestar:offers-updated", () => loadOffers(true));

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cinestar:offers-updated", () => loadOffers(true));
    };
  }, []);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const openCreateModal = () => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    setEditingOffer(null);
    setFormId("");
    setFormTitle("");
    setFormCaption("");
    setFormBadge("TICKET DEAL");
    setFormTag("20% OFF");
    setFormValidity("Limited Time");
    setFormImage("");
    setFormIcon("🎬");
    setFormDescription("");
    setFormBullets([
      { icon: "✨", text: "Special discounted cinema pricing" },
      { icon: "🍿", text: "Available for select screenings" },
    ]);
    setFormPublishDate(today);
    setFormStatus("Active");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditModal = (offer: AdminOffer) => {
    setEditingOffer(offer);
    setFormId(offer.id);
    setFormTitle(offer.title);
    setFormCaption(offer.caption || "");
    setFormBadge(offer.badge || "TICKET DEAL");
    setFormTag(offer.tag || "SPECIAL DEAL");
    setFormValidity(offer.validity || "Limited Time");
    setFormImage(offer.image || "");
    setFormIcon(offer.icon || "🎬");
    setFormDescription(offer.description || "");
    setFormBullets(
      offer.bullets && offer.bullets.length > 0
        ? offer.bullets.map((b) => ({ icon: b.icon || "✨", text: b.text || "" }))
        : [
            { icon: "✨", text: "" },
            { icon: "🍿", text: "" },
          ]
    );
    setFormPublishDate(offer.publishDate || "");
    setFormStatus(offer.status === "Inactive" ? "Inactive" : "Active");
    setFormError("");
    setIsFormOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image file size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormImage(reader.result);
        setFormError("");
      }
    };
    reader.onerror = () => {
      setFormError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddBullet = () => {
    setFormBullets([...formBullets, { icon: "✨", text: "" }]);
  };

  const handleRemoveBullet = (index: number) => {
    setFormBullets(formBullets.filter((_, i) => i !== index));
  };

  const handleBulletChange = (index: number, field: "icon" | "text", value: string) => {
    const updated = [...formBullets];
    updated[index] = { ...updated[index], [field]: value };
    setFormBullets(updated);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle.trim()) {
      setFormError("Offer title is required.");
      return;
    }

    if (!formImage.trim()) {
      setFormError("Offer image URL or uploaded image is required.");
      return;
    }

    if (!formDescription.trim()) {
      setFormError("Offer description is required.");
      return;
    }

    const cleanBullets = formBullets
      .filter((b) => b.text.trim().length > 0)
      .map((b) => ({ icon: b.icon.trim() || "✨", text: b.text.trim() }));

    if (cleanBullets.length === 0) {
      setFormError("Please provide at least one perk or bullet point.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<AdminOffer> = {
        title: formTitle.trim(),
        caption: formCaption.trim() || undefined,
        badge: formBadge.trim() || undefined,
        tag: formTag.trim() || undefined,
        validity: formValidity.trim() || undefined,
        image: formImage.trim(),
        icon: formIcon.trim() || "🎬",
        description: formDescription.trim(),
        bullets: cleanBullets,
        publishDate: formPublishDate.trim() || undefined,
        status: formStatus,
      };

      if (editingOffer) {
        const updated = await updateOffer(editingOffer.id, payload);
        setOffers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        broadcastOffersUpdated();
        showFeedback("success", `Offer "${updated.title}" updated successfully.`);
      } else {
        const finalId = formId.trim() ? generateSlug(formId) : generateSlug(formTitle);
        const created = await createOffer({ ...payload, id: finalId });
        setOffers((prev) => [created, ...prev]);
        broadcastOffersUpdated();
        showFeedback("success", `Offer "${created.title}" created successfully.`);
      }

      setIsFormOpen(false);
    } catch (err: any) {
      console.error("Save offer error:", err);
      setFormError(err?.message || "Failed to save offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (offer: AdminOffer) => {
    const newStatus = offer.status === "Active" ? "Inactive" : "Active";
    // Optimistic UI update immediately
    setOffers((prev) =>
      prev.map((item) => (item.id === offer.id ? { ...item, status: newStatus } : item))
    );
    broadcastOffersUpdated();

    try {
      const updated = await updateOffer(offer.id, { status: newStatus });
      setOffers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      broadcastOffersUpdated();
      showFeedback("success", `Offer "${offer.title}" set to ${newStatus}.`);
    } catch (err: any) {
      // Revert if API call fails
      setOffers((prev) =>
        prev.map((item) => (item.id === offer.id ? { ...item, status: offer.status } : item))
      );
      broadcastOffersUpdated();
      showFeedback("error", `Failed to change status: ${err?.message || "Unknown error"}`);
    }
  };

  const handleDeleteOffer = async () => {
    if (!deletingOffer) return;
    setIsSubmitting(true);
    try {
      await deleteOffer(deletingOffer.id);
      setOffers((prev) => prev.filter((item) => item.id !== deletingOffer.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingOffer.id);
        return next;
      });
      broadcastOffersUpdated();
      showFeedback("success", `Offer "${deletingOffer.title}" deleted.`);
      setDeletingOffer(null);
    } catch (err: any) {
      console.error("Delete offer error:", err);
      showFeedback("error", `Failed to delete offer: ${err?.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchSearch =
        search === "" ||
        offer.title.toLowerCase().includes(search.toLowerCase()) ||
        (offer.badge && offer.badge.toLowerCase().includes(search.toLowerCase())) ||
        (offer.tag && offer.tag.toLowerCase().includes(search.toLowerCase())) ||
        (offer.caption && offer.caption.toLowerCase().includes(search.toLowerCase())) ||
        (offer.description && offer.description.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && offer.status !== "Inactive") ||
        (statusFilter === "Inactive" && offer.status === "Inactive");

      return matchSearch && matchStatus;
    });
  }, [offers, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / PAGE_SIZE));
  const paginatedOffers = filteredOffers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected =
    paginatedOffers.length > 0 && paginatedOffers.every((o) => selectedIds.has(o.id));

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedOffers.forEach((o) => next.delete(o.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedOffers.forEach((o) => next.add(o.id));
        return next;
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Feedback Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            feedback.type === "success"
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
              : "bg-red-950/90 text-red-200 border-red-500/40"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-white/60 hover:text-white transition ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-accent/15 text-accent border border-accent/25">
              <Tag size={20} />
            </span>
            <h1 className="text-2xl font-heading font-bold text-onSurface">Offers</h1>
          </div>
          <p className="text-sm text-onSurfaceVariant font-body">
            Manage cinema promotions and deals displayed on the booking platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            title="Refresh offers from database"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-surface text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw size={15} className={isRefreshing ? "animate-spin text-accent" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-onSurface hover:bg-accent/90 transition shadow-lg shadow-accent/20 text-sm font-medium font-heading"
          >
            <Plus size={16} />
            <span>Add Offer</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-surface border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals, tags, badges..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface placeholder:text-onSurfaceVariant/60 focus:outline-none focus:border-accent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant hover:text-onSurface"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1 text-xs">
            {(["All", "Active", "Inactive"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  statusFilter === status
                    ? "bg-accent text-onSurface shadow-sm"
                    : "text-onSurfaceVariant hover:text-onSurface"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== LIST TABLE (MATCHING SCREENSHOT) ===================== */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-variant/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-onSurfaceVariant bg-white/[0.02]">
                <th className="w-12 px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className={`flex h-4 w-4 items-center justify-center rounded-full border mx-auto transition ${
                      allSelected
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {allSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Badge</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Validity</th>
                <th className="px-4 py-3 font-medium">Perks</th>
                <th className="px-4 py-3 font-medium">Release</th>
                <th className="w-12 px-4 py-3 text-center" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-onSurfaceVariant">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <RefreshCw size={20} className="animate-spin text-accent" />
                      <span className="text-xs font-mono uppercase tracking-wider">
                        Loading offers from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginatedOffers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-onSurfaceVariant">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tag size={28} className="text-onSurfaceVariant/40" />
                      <p className="text-sm font-semibold text-onSurface">No promotions found</p>
                      <p className="text-xs text-onSurfaceVariant max-w-sm">
                        {search || statusFilter !== "All"
                          ? "No offers match your search or filter."
                          : "No promotions exist. Click '+ Add Offer' to create one."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOffers.map((offer) => {
                  const isSelected = selectedIds.has(offer.id);
                  const isActive = offer.status !== "Inactive";

                  return (
                    <tr
                      key={offer.id}
                      className="border-b border-white/10 last:border-b-0 hover:bg-surface-variant/30 transition-colors"
                    >
                      {/* Selection Checkbox */}
                      <td className="px-4 py-3 align-middle text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(offer.id)}
                          className={`flex h-4 w-4 items-center justify-center rounded-full border mx-auto transition ${
                            isSelected
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </button>
                      </td>

                      {/* Title with Image Preview */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-md bg-surface-variant border border-white/10">
                            <img
                              src={offer.image}
                              alt={offer.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-onSurface leading-snug truncate max-w-xs">
                              {offer.title}
                            </div>
                            {offer.caption && (
                              <div className="text-xs text-onSurfaceVariant/80 truncate max-w-xs mt-0.5">
                                {offer.caption}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Badge / Category */}
                      <td className="px-4 py-3 align-middle">
                        {offer.badge ? (
                          <span className="inline-flex rounded-md bg-surface-variant px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-onSurface border border-white/5">
                            {offer.badge}
                          </span>
                        ) : (
                          <span className="text-onSurfaceVariant">—</span>
                        )}
                      </td>

                      {/* Status Pill */}
                      <td className="px-4 py-3 align-middle">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold bg-zinc-500/10 text-zinc-400 ring-1 ring-zinc-500/20">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Discount / Tag */}
                      <td className="px-4 py-3 align-middle">
                        {offer.tag ? (
                          <span className="inline-flex items-center rounded-md bg-surface-variant px-2.5 py-1 text-xs font-semibold text-onSurface border border-white/5">
                            {offer.tag}
                          </span>
                        ) : (
                          <span className="text-onSurfaceVariant">—</span>
                        )}
                      </td>

                      {/* Validity */}
                      <td className="px-4 py-3 align-middle text-onSurfaceVariant text-xs whitespace-nowrap">
                        {offer.validity || "—"}
                      </td>

                      {/* Perks Count */}
                      <td className="px-4 py-3 align-middle text-onSurfaceVariant text-xs whitespace-nowrap">
                        {offer.bullets && offer.bullets.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-onSurface">
                            <span className="font-mono font-medium">{offer.bullets.length}</span> perk
                            {offer.bullets.length !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Release / Publish Date */}
                      <td className="px-4 py-3 align-middle text-onSurface text-xs whitespace-nowrap">
                        {offer.publishDate || "—"}
                      </td>

                      {/* Action Menu Column */}
                      <td className="px-4 py-3 align-middle text-center">
                        <ActionMenu
                          offer={offer}
                          onEdit={openEditModal}
                          onToggleStatus={handleToggleStatus}
                          onDelete={setDeletingOffer}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count Footer */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-onSurfaceVariant bg-white/[0.01]">
          <span>
            Showing {paginatedOffers.length} of {filteredOffers.length} offers
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-md border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-mono">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-md border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================== ADD / EDIT OFFER MODAL ===================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-accent/20 text-accent border border-accent/30">
                  <Tag size={18} />
                </span>
                <div>
                  <h2 className="font-heading font-bold text-lg text-onSurface">
                    {editingOffer ? "Edit Cinema Offer" : "Create New Promotion"}
                  </h2>
                  <p className="text-xs text-onSurfaceVariant">
                    Configure offer appearance, badges, perks, and validity period.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-onSurfaceVariant hover:text-onSurface p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveOffer} className="space-y-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">
                    Offer Title <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Student Cinema Special"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">
                    Offer ID / Slug {!editingOffer && <span className="text-onSurfaceVariant font-normal">(auto-generated if empty)</span>}
                  </label>
                  <input
                    type="text"
                    disabled={!!editingOffer}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder={formTitle ? generateSlug(formTitle) : "e.g. student-special"}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface font-mono disabled:opacity-50 focus:outline-none focus:border-accent transition"
                  />
                </div>
              </div>

              {/* Caption & Icon Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">
                    Catchy Caption / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formCaption}
                    onChange={(e) => setFormCaption(e.target.value)}
                    placeholder="e.g. Happy days for enjoying movies! 🎓"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">Icon / Emoji</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={formIcon}
                      onChange={(e) => setFormIcon(e.target.value)}
                      className="w-14 text-center px-2 py-2 bg-black/40 border border-white/10 rounded-lg text-lg text-onSurface focus:outline-none focus:border-accent transition"
                    />
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      {DEFAULT_EMOJIS.slice(0, 5).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormIcon(emoji)}
                          className="p-1 text-sm rounded hover:bg-white/10 transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge & Tag & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">Badge Pill</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. STUDENT PERK"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface uppercase font-mono text-xs focus:outline-none focus:border-accent transition"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {BADGE_SUGGESTIONS.slice(0, 3).map((badge) => (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => setFormBadge(badge)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-onSurfaceVariant transition"
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">Tag / Highlight</label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="e.g. 40% OFF or BOGO FREE"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface font-bold focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">Validity Schedule</label>
                  <input
                    type="text"
                    value={formValidity}
                    onChange={(e) => setFormValidity(e.target.value)}
                    placeholder="e.g. Valid Mon – Thu"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface focus:outline-none focus:border-accent transition"
                  />
                </div>
              </div>

              {/* Image Input (URL + Local File Upload) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-onSurface">
                    Cover Banner Image <span className="text-accent">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                  >
                    <Upload size={12} />
                    <span>Upload Image File</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                </div>

                <input
                  type="text"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or upload local image"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-onSurface font-mono focus:outline-none focus:border-accent transition"
                />

                {formImage && (
                  <div className="relative aspect-[16/7] w-full rounded-xl overflow-hidden border border-white/10 bg-black mt-2">
                    <img src={formImage} alt="Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                      Image Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-onSurface">
                  About Promotion (Description) <span className="text-accent">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain the offer details, redemption conditions, or discounts..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface leading-relaxed focus:outline-none focus:border-accent transition resize-none"
                />
              </div>

              {/* Perks / Bullets Builder */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-onSurface">
                      Perks & Inclusions <span className="text-accent">*</span>
                    </label>
                    <p className="text-[11px] text-onSurfaceVariant">
                      Bullet points displayed on both Offer list and Customer Offer page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBullet}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-onSurface hover:bg-white/10 transition"
                  >
                    <Plus size={12} />
                    <span>Add Perk</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={bullet.icon}
                        onChange={(e) => handleBulletChange(idx, "icon", e.target.value)}
                        className="w-12 text-center px-2 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface focus:outline-none focus:border-accent"
                        placeholder="✨"
                      />
                      <input
                        type="text"
                        value={bullet.text}
                        onChange={(e) => handleBulletChange(idx, "text", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs sm:text-sm text-onSurface focus:outline-none focus:border-accent"
                        placeholder={`Perk #${idx + 1}, e.g. Free small butter popcorn included`}
                      />
                      {formBullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(idx)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">Publish Date</label>
                  <input
                    type="text"
                    value={formPublishDate}
                    onChange={(e) => setFormPublishDate(e.target.value)}
                    placeholder="e.g. Sep 11, 2026"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-onSurface">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-onSurface focus:outline-none focus:border-accent transition"
                  >
                    <option value="Active" className="bg-[#141414] text-white">
                      Active (Visible to customers)
                    </option>
                    <option value="Inactive" className="bg-[#141414] text-white">
                      Inactive (Draft / Hidden)
                    </option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-onSurface hover:bg-accent/90 transition shadow-lg shadow-accent/20 text-sm font-heading font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingOffer ? "Update Offer" : "Publish Offer"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {deletingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                <AlertTriangle size={22} />
              </span>
              <div>
                <h3 className="font-heading font-bold text-base text-onSurface">Delete Promotion</h3>
                <p className="text-xs text-onSurfaceVariant">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-onSurfaceVariant leading-relaxed mb-6 font-body">
              Are you sure you want to permanently delete{" "}
              <span className="text-onSurface font-semibold">"{deletingOffer.title}"</span>? It will
              be removed immediately from the database and the customer booking platform.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingOffer(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-white/10 text-onSurfaceVariant hover:text-onSurface hover:bg-white/5 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOffer}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-sm font-semibold shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    <span>Delete Offer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
