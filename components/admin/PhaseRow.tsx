"use client";

import { updateFasePuntos } from "@/actions/fases";
import type { FaseDTO } from "@/actions/fases";
import { Badge } from "@/components/ui/Badge";
import { Check, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface PhaseRowProps {
  fase: FaseDTO;
}

export default function PhaseRow({ fase }: PhaseRowProps) {
  const [pending, startTransition] = useTransition();
  const [puntos, setPuntos] = useState(String(fase.puntos));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = puntos !== String(fase.puntos);

  const handleSave = () => {
    const value = parseInt(puntos);
    if (isNaN(value) || value < 0 || value > 100) {
      setError("Enter a valid number (0–100).");
      return;
    }

    setError(null);
    setSaved(false);

    startTransition(async () => {
      try {
        const updated = await updateFasePuntos(fase.id, value);
        fase.puntos = updated.puntos;
        setPuntos(String(updated.puntos));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        setError("Failed to save. Please try again.");
      }
    });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl border bg-card px-5 py-4 shadow-sm transition-all",
        saved ? "border-emerald-200" : "border-border",
        pending && "opacity-60 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3">
        <Badge variant={fase.puntos >= 4 ? "warning" : "default"}>
          {fase.codigo}
        </Badge>
        <span className="font-medium text-foreground">{fase.nombre}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Points</label>
          <input
            type="number"
            min={0}
            max={100}
            value={puntos}
            onChange={(e) => {
              setPuntos(e.target.value);
              setSaved(false);
              setError(null);
            }}
            className="w-16 h-9 text-center text-lg font-bold rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        {isDirty && (
          <button
            onClick={handleSave}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-rh to-rose-700 text-white shadow-sm shadow-rh/20 text-sm font-semibold px-3 py-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Save
          </button>
        )}

        {saved && (
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}

        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    </div>
  );
}
