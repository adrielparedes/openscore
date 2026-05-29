"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { deletePaniniCard } from "@/actions/usuarios";
import { useRouter } from "next/navigation";

interface Props {
  currentCard: string | null;
}

export default function PaniniCardUpload({ currentCard }: Props) {
  const [preview, setPreview] = useState<string | null>(currentCard);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setPreview(data.url);
      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    uploadFile(file);
  }, [uploadFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    const result = await deletePaniniCard();
    if (result?.error) {
      setError(result.error);
    } else {
      setPreview(null);
      router.refresh();
    }
    setDeleting(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {preview ? (
        <div className="relative group">
          <div className="relative w-full max-w-xs mx-auto aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
            <Image
              src={preview}
              alt="Panini card"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading || deleting}
                className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white transition-colors shadow"
              >
                <Upload className="h-3.5 w-3.5" />
                Replace
              </button>
              <button
                onClick={handleDelete}
                disabled={uploading || deleting}
                className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-white transition-colors shadow"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
                Remove
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Hover to replace or remove</p>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors
            ${dragOver
              ? "border-rose-400 bg-rose-50"
              : "border-slate-200 bg-slate-50 hover:border-rose-300 hover:bg-rose-50/50"
            }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-rose-400 animate-spin" />
              <p className="text-sm text-slate-500">Uploading…</p>
            </>
          ) : (
            <>
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <ImageIcon className="h-7 w-7 text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  Drop your Panini card here
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  or click to browse — JPEG, PNG, WebP up to 5 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
        disabled={uploading || deleting}
      />

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
