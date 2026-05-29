"use client";

import { setPronostico } from "@/actions/pronosticos";
import type { PartidoPronostico } from "@/types";
import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/flags";
import { Badge } from "@/components/ui/Badge";
import { CalendarClock, Timer } from "lucide-react";
import { useTransition, useEffect, useState } from "react";

const LOCK_OFFSET_MS = 15 * 60 * 1000;

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, targetMs - Date.now()));

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const diff = Math.max(0, targetMs - Date.now());
      setRemaining(diff);
      if (diff === 0) clearInterval(id);
    }, 60_000);
    return () => clearInterval(id);
  }, [targetMs]);

  return remaining;
}

function formatCountdown(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  return `${d}d:${h.toString().padStart(2, "0")}h:${m.toString().padStart(2, "0")}m`;
}

interface MatchCardProps {
  match: PartidoPronostico;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [pending, startTransition] = useTransition();
  const locked = match.status !== "PENDING";

  const lockAtMs = new Date(match.dia).getTime() - LOCK_OFFSET_MS;
  const remaining = useCountdown(locked ? 0 : lockAtMs);
  const showCountdown = !locked && remaining > 0;

  const vote = (prediction: "local" | "visitante" | "empate") => {
    if (locked) return;
    startTransition(() => {
      setPronostico(match.id, prediction);
    });
  };

  const btnBase =
    "flex-1 rounded-xl py-3 text-sm font-semibold transition-all border disabled:opacity-50 disabled:cursor-not-allowed";

  const btnVariant = (selected: boolean) =>
    selected
      ? "bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-200/50 scale-[1.02]"
      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900";

  const matchDate = new Date(match.dia).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-white shadow-sm overflow-hidden transition-opacity",
        locked ? "border-slate-200/50 opacity-80" : "border-slate-200",
        pending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarClock className="h-3.5 w-3.5" />
          <span>{matchDate}</span>
        </div>
        <div className="flex items-center gap-2">
          {match.grupo && match.grupo.codigo !== "NONE" && <Badge variant="muted">{match.grupo.nombre}</Badge>}
          {{
            PENDING: <Badge variant="success">Open</Badge>,
            BLOCKED: <Badge variant="warning">Locked</Badge>,
            FINISHED: <Badge variant="muted">Finished</Badge>,
          }[match.status]}
        </div>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        {/* Local */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {flagUrl(match.local.codigo) && (
            <img
              src={flagUrl(match.local.codigo, 80)}
              alt={match.local.codigo}
              width={56}
              height={40}
              className="rounded object-cover shadow-sm"
            />
          )}
          <span className="font-bold text-slate-900 text-center text-sm">{match.local.nombre}</span>
          <span className="text-xs text-slate-400 uppercase">{match.local.codigo}</span>
        </div>

        <div className="flex flex-col items-center gap-1 px-2">
          {match.status === "FINISHED" ? (
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {match.resultadoLocal} – {match.resultadoVisitante}
            </div>
          ) : (
            <div className="text-xl font-bold text-slate-300">VS</div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {flagUrl(match.visitante.codigo) && (
            <img
              src={flagUrl(match.visitante.codigo, 80)}
              alt={match.visitante.codigo}
              width={56}
              height={40}
              className="rounded object-cover shadow-sm"
            />
          )}
          <span className="font-bold text-slate-900 text-center text-sm">{match.visitante.nombre}</span>
          <span className="text-xs text-slate-400 uppercase">{match.visitante.codigo}</span>
        </div>
      </div>

      {/* Prediction buttons */}
      <div className="mt-auto px-5 pb-5 flex flex-col gap-2">
        {!locked && (
          <p className="text-xs text-slate-400 text-center">Your prediction</p>
        )}
        <div className="flex gap-2">
          <button
            className={cn(btnBase, btnVariant(!!match.pronostico?.local))}
            onClick={() => vote("local")}
            disabled={locked}
          >
            Home
          </button>
          {match.fase.codigo === "GRUPO" && (
            <button
              className={cn(btnBase, btnVariant(!!match.pronostico?.empate))}
              onClick={() => vote("empate")}
              disabled={locked}
            >
              Draw
            </button>
          )}
          <button
            className={cn(btnBase, btnVariant(!!match.pronostico?.visitante))}
            onClick={() => vote("visitante")}
            disabled={locked}
          >
            Away
          </button>
        </div>

        {match.status === "FINISHED" && match.puntos > 0 && (
          <div className="text-center text-xs font-semibold text-emerald-600 mt-1">
            +{match.puntos} pts earned ✓
          </div>
        )}
        {match.status === "FINISHED" && match.pronostico && match.puntos === 0 && (
          <div className="text-center text-xs font-semibold text-rose-600 mt-1">
            ✗ Better luck next time! — 0 pts
          </div>
        )}

        {showCountdown && (
          <div className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold tabular-nums mt-1",
            remaining < 5 * 60 * 1000
              ? "bg-rose-50 text-rose-600"
              : "bg-amber-50 text-amber-600"
          )}>
            <Timer className="h-3.5 w-3.5" />
            <span>Locks in {formatCountdown(remaining)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
