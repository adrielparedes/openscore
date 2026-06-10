"use client";

import { setPronostico } from "@/actions/pronosticos";
import type { PartidoPronostico } from "@/types";
import type { PronosticoGanador } from "@prisma/client";
import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/flags";
import { Badge } from "@/components/ui/Badge";
import { CalendarClock, Timer } from "lucide-react";
import { useTransition } from "react";
import { useNow } from "@/components/providers/CountdownProvider";
import OddsBar from "@/components/forecast/OddsBar";

const LOCK_OFFSET_MS = 15 * 60 * 1000;

function TeamName({ nombre, codigo }: { nombre: string; codigo: string }) {
  const hasFlag = !!flagUrl(codigo);
  if (hasFlag) {
    return (
      <>
        <span className="font-bold text-foreground text-center text-sm">{nombre}</span>
        <span className="text-xs text-muted-foreground uppercase">{codigo}</span>
      </>
    );
  }
  const sp = nombre.indexOf(" ");
  const line1 = sp !== -1 ? nombre.slice(0, sp) : nombre;
  const line2 = sp !== -1 ? nombre.slice(sp + 1) : null;
  const noBreak = (s: string) => s.replace(/-/g, "‑");
  return (
    <>
      <span className="font-bold text-foreground text-center text-sm whitespace-nowrap">{noBreak(line1)}</span>
      {line2 && <span className="text-xs text-muted-foreground text-center whitespace-nowrap">{noBreak(line2)}</span>}
    </>
  );
}

const FIVE_MINUTES_MS = 5 * 60 * 1000;

function formatCountdown(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;

  if (ms < FIVE_MINUTES_MS) {
    return `${m.toString().padStart(2, "0")}m:${s.toString().padStart(2, "0")}s`;
  }
  return `${d}d:${h.toString().padStart(2, "0")}h:${m.toString().padStart(2, "0")}m`;
}

interface MatchCardProps {
  match: PartidoPronostico;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [pending, startTransition] = useTransition();
  const locked = match.status !== "PENDING";
  const now = useNow();

  const lockAtMs = new Date(match.dia).getTime() - LOCK_OFFSET_MS;
  const remaining = locked ? 0 : Math.max(0, lockAtMs - now);
  const showCountdown = !locked && remaining > 0;

  const vote = (prediction: PronosticoGanador) => {
    if (locked) return;
    startTransition(() => {
      setPronostico(match.id, prediction);
    });
  };

  const btnBase =
    "flex-1 rounded-2xl py-3 text-sm font-semibold transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed";

  const btnVariant = (selected: boolean) =>
    selected
      ? "bg-gradient-to-br from-rh to-rose-700 border-transparent text-white shadow-lg shadow-rh/20 hover:scale-[1.02] hover:shadow-rh/30"
      : "bg-card border-border text-muted-foreground hover:bg-accent/50 hover:border-border hover:text-foreground";

  const matchDate = new Date(match.dia).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const leftBorderColor =
    match.status === "FINISHED"
      ? match.puntos > 0
        ? "border-l-emerald-600 dark:border-l-emerald-400"
        : "border-l-rh"
      : match.status === "BLOCKED"
      ? "border-l-amber-600 dark:border-l-amber-400"
      : "border-l-blue-600 dark:border-l-blue-400";

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-opacity border-l-4",
        leftBorderColor,
        pending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0 overflow-hidden">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" />
          <span suppressHydrationWarning className="whitespace-nowrap">{matchDate}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {match.grupo && match.grupo.codigo !== "NONE" && <Badge variant="muted">{match.grupo.nombre}</Badge>}
          {{
            PENDING: <Badge variant="info">Open</Badge>,
            BLOCKED: <Badge variant="warning">Locked</Badge>,
            FINISHED: <Badge variant="success">Finished</Badge>,
          }[match.status]}
        </div>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        {/* Local */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {flagUrl(match.local.codigo) && (
            <div className="w-14 h-10 rounded overflow-hidden shadow-sm shrink-0">
              <img
                src={flagUrl(match.local.codigo, 80)}
                alt={match.local.codigo}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <TeamName nombre={match.local.nombre} codigo={match.local.codigo} />
        </div>

        <div className="flex flex-col items-center gap-1 px-2 shrink-0">
          {match.status === "FINISHED" ? (
            <div className="text-2xl font-bold text-foreground tabular-nums whitespace-nowrap">
              {match.resultadoLocal} – {match.resultadoVisitante}
            </div>
          ) : (
            <div className="text-xl font-bold text-border">VS</div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {flagUrl(match.visitante.codigo) && (
            <div className="w-14 h-10 rounded overflow-hidden shadow-sm shrink-0">
              <img
                src={flagUrl(match.visitante.codigo, 80)}
                alt={match.visitante.codigo}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <TeamName nombre={match.visitante.nombre} codigo={match.visitante.codigo} />
        </div>
      </div>

      {/* Prediction buttons */}
      <div className="mt-auto px-5 pb-5 flex flex-col gap-2">
        {!locked && (
          <p className="text-xs text-muted-foreground text-center">Your prediction</p>
        )}
        <div className="flex gap-2">
          <button
            className={cn(btnBase, btnVariant(match.pronostico?.ganador === "LOCAL"))}
            onClick={() => vote("LOCAL")}
            disabled={locked}
          >
            Home
          </button>
          {match.fase.codigo === "GRUPO" && (
            <button
              className={cn(btnBase, btnVariant(match.pronostico?.ganador === "EMPATE"))}
              onClick={() => vote("EMPATE")}
              disabled={locked}
            >
              Draw
            </button>
          )}
          <button
            className={cn(btnBase, btnVariant(match.pronostico?.ganador === "VISITANTE"))}
            onClick={() => vote("VISITANTE")}
            disabled={locked}
          >
            Away
          </button>
        </div>

        {match.status === "FINISHED" && match.puntos > 0 && (
          <div className="text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
            +{match.puntos} pts earned ✓
          </div>
        )}
        {match.status === "FINISHED" && match.pronostico && match.puntos === 0 && (
          <div className="text-center text-xs font-semibold text-rh mt-1">
            ✗ Better luck next time! — 0 pts
          </div>
        )}
        {match.status === "FINISHED" && !match.pronostico && (
          <div className="text-center text-xs font-semibold text-rh mt-1">
            ✗ No prediction made — 0 pts
          </div>
        )}

        {showCountdown && (
          <div className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold tabular-nums mt-1",
            remaining < FIVE_MINUTES_MS
              ? "bg-rh/10 text-rh"
              : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
          )}>
            <Timer className="h-3.5 w-3.5" />
            <span>Locks in {formatCountdown(remaining)}</span>
          </div>
        )}

        {match.odds && locked && (
          <div className="mt-2">
            <OddsBar odds={match.odds} showDraw={match.fase.codigo === "GRUPO"} />
          </div>
        )}
      </div>
    </div>
  );
}
