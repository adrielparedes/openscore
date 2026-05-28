"use client";

import { setPronostico } from "@/actions/pronosticos";
import type { PartidoPronostico } from "@/types";
import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/flags";
import { Badge } from "@/components/ui/Badge";
import { useTransition } from "react";

interface MatchCardProps {
  match: PartidoPronostico;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [pending, startTransition] = useTransition();
  const locked = match.status !== "PENDING";

  const vote = (prediction: "local" | "visitante" | "empate") => {
    if (locked) return;
    startTransition(() => {
      setPronostico(match.id, prediction);
    });
  };

  const btnBase =
    "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all border disabled:opacity-60";

  const btnVariant = (selected: boolean) =>
    selected
      ? "bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-200/50"
      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const statusBadge = {
    PENDING: <Badge variant="success">Open</Badge>,
    BLOCKED: <Badge variant="warning">Locked</Badge>,
    FINISHED: <Badge variant="muted">Finished</Badge>,
  }[match.status];

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
        "rounded-xl border bg-white p-5 transition-opacity shadow-sm",
        locked ? "border-slate-200/50 opacity-80" : "border-slate-200",
        pending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
        <span>{matchDate}</span>
        <div className="flex items-center gap-2">
          {match.grupo && (
            <span className="text-slate-400">{match.grupo.nombre}</span>
          )}
          <span className="text-slate-400">{match.fase.nombre}</span>
          {statusBadge}
        </div>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex-1 flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{match.local.nombre}</span>
            {flagUrl(match.local.codigo) && (
              <img
                src={flagUrl(match.local.codigo)}
                alt={match.local.codigo}
                width={28}
                height={20}
                className="rounded-sm object-cover shadow-sm"
              />
            )}
          </div>
          <div className="text-xs text-slate-400 uppercase">{match.local.codigo}</div>
        </div>

        <div className="flex items-center gap-3 px-4">
          {match.status === "FINISHED" ? (
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {match.resultadoLocal} – {match.resultadoVisitante}
            </div>
          ) : (
            <div className="text-xl font-bold text-slate-300">VS</div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            {flagUrl(match.visitante.codigo) && (
              <img
                src={flagUrl(match.visitante.codigo)}
                alt={match.visitante.codigo}
                width={28}
                height={20}
                className="rounded-sm object-cover shadow-sm"
              />
            )}
            <span className="font-semibold text-slate-900">{match.visitante.nombre}</span>
          </div>
          <div className="text-xs text-slate-400 uppercase">{match.visitante.codigo}</div>
        </div>
      </div>

      {/* Prediction buttons */}
      <div className="flex gap-2">
        <button
          className={cn(btnBase, btnVariant(!!match.pronostico?.local))}
          onClick={() => vote("local")}
          disabled={locked}
        >
          Home
        </button>
        <button
          className={cn(btnBase, btnVariant(!!match.pronostico?.empate))}
          onClick={() => vote("empate")}
          disabled={locked}
        >
          Draw
        </button>
        <button
          className={cn(btnBase, btnVariant(!!match.pronostico?.visitante))}
          onClick={() => vote("visitante")}
          disabled={locked}
        >
          Away
        </button>
      </div>

      {/* Points earned */}
      {match.status === "FINISHED" && match.puntos > 0 && (
        <div className="mt-3 text-center text-xs font-semibold text-emerald-600">
          +{match.puntos} pts earned ✓
        </div>
      )}
    </div>
  );
}
