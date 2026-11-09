// admin-frontend/src/pages/admin/Slides.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Film,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Image,
  ExternalLink,
  Upload,
} from "lucide-react";
import {
  AdminSlide,
  fetchAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} from "../../services/api";

const PRESET_BADGES = ["NOW SHOWING", "COMING SOON", "IMAX 2D", "IMAX 3D", "3D", "PREMIERE", "EXCLUSIVE"];

export default function Slides() {
  const [slides, setSlides] = useState<AdminSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<AdminSlide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<AdminSlide | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [badges, setBadges] = useState<string[]>(["NOW SHOWING", "IMAX 2D"]);
  const [badgeInput, setBadgeInput] = useState("");
  const [linkUrl, setLinkUrl] = useState("/movies");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [order, setOrder] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllSlides(true);
      setSlides(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load slideshow slides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const openCreateModal = () => {
    setEditingSlide(null);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setImage("");
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setBadges(["NOW SHOWING", "IMAX 2D"]);
    setBadgeInput("");
    setLinkUrl("/movies");
    setStatus("Active");
    setOrder(slides.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: AdminSlide) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle || "");
    setDescription(slide.description);
    setImage(slide.image);
    setUploadedFileName(slide.image.startsWith("data:") ? "Uploaded Local Image" : null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setBadges(slide.badges || []);
    setBadgeInput("");
    setLinkUrl(slide.linkUrl || "/movies");
    setStatus(slide.status || "Active");
    setOrder(slide.order || 1);
    setIsModalOpen(true);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file size must be less than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setUploadedFileName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file from your PC.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleToggleStatus = async (slide: AdminSlide) => {
    try {
      const nextStatus = slide.status === "Active" ? "Inactive" : "Active";
      await updateSlide(slide.id, { status: nextStatus });
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, status: nextStatus } : s))
      );
      showSuccess(`Slide status changed to ${nextStatus}`);
    } catch (err: any) {
      setError(err?.message || "Failed to update slide status");
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      setError("Please fill in the title and image URL");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        image: image.trim(),
        badges,
        linkUrl: linkUrl.trim() || "/movies",
        status,
        order: Number(order) || 1,
      };

      if (editingSlide) {
        const updated = await updateSlide(editingSlide.id, payload);
        setSlides((prev) =>
          prev.map((s) => (s.id === editingSlide.id ? updated : s))
        );
        showSuccess("Slide updated successfully!");
      } else {
        const created = await createSlide(payload);
        setSlides((prev) => [...prev, created]);
        showSuccess("New slide added to homepage slideshow!");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to save slide.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlide = async () => {
    if (!deletingSlide) return;
    try {
      setSubmitting(true);
      await deleteSlide(deletingSlide.id);
      setSlides((prev) => prev.filter((s) => s.id !== deletingSlide.id));
      setDeletingSlide(null);
      showSuccess("Slide removed from slideshow.");
    } catch (err: any) {
      setError(err?.message || "Failed to delete slide.");
    } finally {
      setSubmitting(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const addBadge = (b: string) => {
    const trimmed = b.trim().toUpperCase();
    if (trimmed && !badges.includes(trimmed)) {
      setBadges([...badges, trimmed]);
    }
    setBadgeInput("");
  };

  const removeBadge = (b: string) => {
    setBadges(badges.filter((item) => item !== b));
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-onSurface">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-accent/15 text-accent">
              <Film size={22} />
            </div>
            <h1 className="text-2xl font-heading font-black tracking-tight text-white">
              Hero Slideshow Manager
            </h1>
          </div>
          <p className="mt-1 text-sm text-onSurfaceVariant">
            Customize and reorder the hero banner carousel displayed live on the movie ticket booking website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSlides}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-accent text-onSurface hover:brightness-110 text-sm font-heading font-bold shadow-lg transition"
          >
            <Plus size={16} />
            Add Slide
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Slide Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-onSurfaceVariant">
          <RefreshCw size={28} className="animate-spin mb-3 text-accent" />
          <p className="text-sm">Loading hero slideshow slides...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-surface/50 p-8">
          <Image size={40} className="mx-auto text-onSurfaceVariant mb-3 opacity-50" />
          <p className="text-base font-bold text-white">No Slides Found</p>
          <p className="text-sm text-onSurfaceVariant mt-1 max-w-md mx-auto">
            Get started by creating your first hero slideshow banner for the movie-ticket-booking homepage.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded bg-accent text-onSurface text-sm font-bold"
          >
            <Plus size={16} /> Add First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-surface flex flex-col ${
                slide.status === "Active"
                  ? "border-white/10 hover:border-accent/40 shadow-lg"
                  : "border-white/5 opacity-60 bg-surface/40"
              }`}
            >
              {/* Image Preview with Badges */}
              <div className="relative aspect-[16/9] w-full bg-black overflow-hidden group">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://picsum.photos/seed/fallback/1600/900";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Status indicator & Order */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/20">
                    #{slide.order ?? idx + 1}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      slide.status === "Active"
                        ? "bg-emerald-500/80 text-white"
                        : "bg-zinc-600/80 text-zinc-300"
                    }`}
                  >
                    {slide.status}
                  </span>
                </div>

                {/* Badges Preview */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {slide.badges?.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-accent text-white shadow"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-heading font-black italic tracking-tight text-white uppercase">
                    {slide.title}{" "}
                    {slide.subtitle && (
                      <span className="text-accent">{slide.subtitle}</span>
                    )}
                  </h3>
                  <p className="mt-2 text-xs text-onSurfaceVariant line-clamp-3 leading-relaxed">
                    {slide.description || "No description provided."}
                  </p>
                  {slide.linkUrl && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-white/50">
                      <ExternalLink size={12} />
                      <span className="font-mono truncate">{slide.linkUrl}</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(slide)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-onSurfaceVariant hover:text-white transition"
                  >
                    {slide.status === "Active" ? (
                      <>
                        <EyeOff size={14} className="text-amber-400" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} className="text-emerald-400" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(slide)}
                      className="p-2 rounded bg-white/5 hover:bg-white/10 text-onSurfaceVariant hover:text-white transition"
                      title="Edit Slide"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingSlide(slide)}
                      className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      title="Delete Slide"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create / Edit Slide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <Film size={20} className="text-accent" />
                {editingSlide ? "Edit Slideshow Slide" : "Add New Hero Slide"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-onSurfaceVariant hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant mb-1.5">
                    Main Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IRON"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant mb-1.5">
                    Highlighted Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VERDICT"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* Banner Image URL + Upload Image File */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant">
                    Banner Image URL <span className="text-accent">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
                  >
                    <Upload size={12} />
                    <span>Upload Image File</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />
                </div>

                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or click 'Upload Image File'"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setUploadedFileName(null);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:border-accent outline-none font-mono"
                />

                {/* Banner Image Preview */}
                {image && (
                  <div className="mt-3 relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-white/10 bg-black group shadow-lg">
                    <img
                      src={image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://picsum.photos/seed/hero-preview/1600/900";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <span className="text-[10px] bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-white/90 font-mono border border-white/20">
                        {image.startsWith("data:") ? "PC Upload (Base64)" : "Web URL"}
                      </span>
                      {uploadedFileName && (
                        <span className="text-[10px] bg-emerald-500/80 backdrop-blur-md px-2.5 py-1 rounded text-white font-medium">
                          {uploadedFileName}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1 rounded bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition"
                    >
                      <Upload size={12} />
                      <span>Change</span>
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
                      <p className="font-heading font-black italic text-lg uppercase truncate drop-shadow">
                        {title || "TITLE PREVIEW"}{" "}
                        {subtitle && <span className="text-accent">{subtitle}</span>}
                      </p>
                      <span className="text-[10px] text-white/60 font-mono">16:9 Widescreen</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant mb-1.5">
                  Synopsis / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief movie or promotion storyline displayed on the banner..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              {/* Badges / Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant mb-1.5">
                  Badges (Pills)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-accent/20 border border-accent/40 text-accent text-xs font-bold"
                    >
                      {b}
                      <button
                        type="button"
                        onClick={() => removeBadge(b)}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add custom badge (e.g. 4DX, PREMIERE)"
                    value={badgeInput}
                    onChange={(e) => setBadgeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBadge(badgeInput);
                      }
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => addBadge(badgeInput)}
                    className="px-3 py-2 rounded bg-white/10 text-xs font-bold hover:bg-white/20 transition"
                  >
                    Add
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-onSurfaceVariant mr-1 self-center">
                    Presets:
                  </span>
                  {PRESET_BADGES.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addBadge(preset)}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-onSurfaceVariant hover:text-white border border-white/5"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant mb-1.5">
                    Button Link
                  </label>
                  <input
                    type="text"
                    placeholder="/movies"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-accent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-onSurfaceVariant mb-1.5">
                    Live Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded text-sm text-onSurfaceVariant hover:text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded bg-accent text-onSurface font-heading font-bold text-sm shadow hover:brightness-110 transition disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editingSlide ? "Update Slide" : "Publish Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deletingSlide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Trash2 size={18} className="text-red-400" />
              Delete Hero Slide
            </h3>
            <p className="mt-2 text-sm text-onSurfaceVariant leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-white">"{deletingSlide.title}"</strong> from the homepage slideshow? This change takes effect immediately on the customer portal.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingSlide(null)}
                className="px-4 py-2 rounded text-sm text-onSurfaceVariant hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSlide}
                disabled={submitting}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow transition disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
