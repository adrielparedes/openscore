"use client";

import { useState, useRef, useTransition } from "react";
import { createBanner, updateBanner, deleteBanner, reorderBanners } from "@/actions/banners";
import { Trash2, GripVertical, Plus, Eye, EyeOff, ExternalLink } from "lucide-react";
import Image from "next/image";

type Banner = {
  id: number;
  titulo: string | null;
  imagen: string;
  orden: number;
  activo: boolean;
  linkUrl: string | null;
};

export default function BannerManager({ banners: initial }: { banners: Banner[] }) {
  const [banners, setBanners] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    if (!form.get("file") || !(form.get("file") as File).size) {
      setError("Please select an image file.");
      return;
    }

    setUploading(true);
    const result = await createBanner(form);
    setUploading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setNewTitle("");
      setNewLink("");
      if (fileRef.current) fileRef.current.value = "";
      window.location.reload();
    }
  }

  function handleToggle(banner: Banner) {
    startTransition(async () => {
      await updateBanner(banner.id, { activo: !banner.activo });
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, activo: !b.activo } : b))
      );
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this banner?")) return;
    startTransition(async () => {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    });
  }

  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...banners];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    setBanners(updated);
    setDragIdx(idx);
  }

  function handleDragEnd() {
    if (dragIdx === null) return;
    setDragIdx(null);
    startTransition(async () => {
      await reorderBanners(banners.map((b) => b.id));
    });
  }

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <form onSubmit={handleUpload} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add new banner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Image *</label>
            <input
              ref={fileRef}
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Title (optional)</label>
            <input
              type="text"
              name="titulo"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Banner title"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Link URL (optional)</label>
            <input
              type="url"
              name="linkUrl"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          {uploading ? "Uploading..." : "Upload banner"}
        </button>
      </form>

      {/* Banner list */}
      <div className="space-y-2">
        {banners.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No banners yet. Upload one above.</p>
        )}
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 rounded-xl border bg-white p-3 shadow-sm transition-all ${
              dragIdx === idx ? "border-rose-300 shadow-md scale-[1.01]" : "border-slate-200"
            } ${!banner.activo ? "opacity-60" : ""}`}
          >
            <GripVertical className="h-4 w-4 text-slate-300 cursor-grab shrink-0" />
            <div className="h-16 w-28 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative">
              <Image
                src={banner.imagen}
                alt={banner.titulo || "Banner"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {banner.titulo || <span className="text-slate-400 italic">Untitled</span>}
              </p>
              {banner.linkUrl && (
                <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {banner.linkUrl}
                </p>
              )}
            </div>
            <button
              onClick={() => handleToggle(banner)}
              disabled={isPending}
              title={banner.activo ? "Hide" : "Show"}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {banner.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleDelete(banner.id)}
              disabled={isPending}
              title="Delete"
              className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {isPending && (
        <p className="text-xs text-slate-400 text-center">Saving...</p>
      )}
    </div>
  );
}
