"use client";

import { updatePartido } from "@/actions/partidos";
import type { PartidoConRelaciones } from "@/types";
import { flagUrl } from "@/lib/flags";
import { Badge } from "@/components/ui/Badge";
import { CalendarClock, Check, Loader2, MapPin } from "lucide-react";
import { useTransition, useState } from "react";
import { cn } from "@/lib/utils";

interface MatchEditCardProps {
  match: PartidoConRelaciones;
  fases: { id: number; codigo: string; nombre: string; puntos: number }[];
  grupos: { id: number; codigo: string; nombre: string }[];
}

function toLocalDatetimeString(date: Date): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MatchEditCard({ match, fases, grupos }: MatchEditCardProps) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dia, setDia] = useState(toLocalDatetimeString(match.dia));
  const [lugar, setLugar] = useState(match.lugar ?? "");
  const [faseId, setFaseId] = useState(match.faseId);
  const [grupoId, setGrupoId] = useState<number | null>(match.grupoId);
  const [fecha, setFecha] = useState(match.fecha);

  const dirty =
    dia !== toLocalDatetimeString(match.dia) ||
    lugar !== (match.lugar ?? "") ||
    faseId !== match.faseId ||
    grupoId !== match.grupoId ||
    fecha !== match.fecha;

  const handleSubmit = () => {
    setError(null);
    setSaved(false);

    if (!dia) {
      setError("Date and time are required.");
      return;
    }

    startTransition(async () => {
      try {
        await updatePartido(match.id, {
          dia,
          lugar: lugar.trim() || null,
          faseId,
          grupoId,
          fecha,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        setError("Failed to save. Please try again.");
      }
    });
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-50";
  const selectClass =
    "w-full rounded-xl border border-border bg-card text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent cursor-pointer disabled:opacity-50";
  const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card shadow-sm overflow-hidden transition-all",
        "border-border",
        pending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Header: teams */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {flagUrl(match.local.codigo) && (
              <img
                src={flagUrl(match.local.codigo, 40)}
                alt={match.local.codigo}
                className="w-7 h-5 rounded-sm object-cover shadow-sm"
              />
            )}
            <span className="font-bold text-foreground text-sm">{match.local.nombre}</span>
          </div>
          <span className="text-muted-foreground text-xs font-medium">vs</span>
          <div className="flex items-center gap-2">
            {flagUrl(match.visitante.codigo) && (
              <img
                src={flagUrl(match.visitante.codigo, 40)}
                alt={match.visitante.codigo}
                className="w-7 h-5 rounded-sm object-cover shadow-sm"
              />
            )}
            <span className="font-bold text-foreground text-sm">{match.visitante.nombre}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {match.grupo && <Badge variant="muted">{match.grupo.nombre}</Badge>}
          <Badge variant="muted">{match.fase.nombre}</Badge>
          <Badge variant="muted">#{match.id}</Badge>
        </div>
      </div>

      {/* Editable fields */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            <CalendarClock className="inline h-3 w-3 mr-1 -mt-0.5" />
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            <MapPin className="inline h-3 w-3 mr-1 -mt-0.5" />
            Venue
          </label>
          <input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="e.g. MetLife Stadium, New York"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Phase</label>
          <select
            value={faseId}
            onChange={(e) => setFaseId(Number(e.target.value))}
            className={selectClass}
          >
            {fases.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre} ({f.puntos} pts)
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Group</label>
          <select
            value={grupoId ?? ""}
            onChange={(e) => setGrupoId(e.target.value ? Number(e.target.value) : null)}
            className={selectClass}
          >
            <option value="">None</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Matchday (fecha)</label>
          <input
            type="number"
            min={0}
            value={fecha}
            onChange={(e) => setFecha(parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between gap-3">
        <div className="min-h-[20px]">
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          {saved && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Saved
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={pending || !dirty}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-rh to-rose-700 text-white shadow-sm shadow-rh/20 text-sm font-semibold px-4 py-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </div>
  );
}
