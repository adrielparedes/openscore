"use client";

import { useTransition } from "react";
import { setPronostico } from "@/actions/pronosticos";
import type { PartidoPronostico } from "@/types";
import type { PronosticoGanador } from "@prisma/client";
import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/flags";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, CalendarClock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface NextMatchCardProps {
  match: PartidoPronostico;
}

export default function NextMatchCard({ match }: NextMatchCardProps) {
  const [pending, startTransition] = useTransition();
  const finished = match.status === "FINISHED";
  const locked = match.status !== "PENDING";

  const vote = (prediction: PronosticoGanador) => {
    if (locked) return;
    startTransition(() => {
      setPronostico(match.id, prediction);
    });
  };

  const matchDate = new Date(match.dia).toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const btnBase =
    "flex-1 rounded-2xl py-3 text-sm font-semibold transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed";

  const btnVariant = (selected: boolean) =>
    selected
      ? "bg-gradient-to-br from-rh to-rose-700 border-transparent text-white shadow-lg shadow-rh/20 hover:scale-[1.02] hover:shadow-rh/30"
      : "bg-card border-border text-muted-foreground hover:bg-accent/50 hover:border-border hover:text-foreground";

  const userPrediction = match.pronostico?.ganador ?? null;
  const predictionCorrect = finished && userPrediction !== null && userPrediction === match.ganador;

  const leftBorderColor = finished
    ? predictionCorrect
      ? "border-l-emerald-600 dark:border-l-emerald-500"
      : "border-l-rh"
    : locked
    ? "border-l-amber-600 dark:border-l-amber-400"
    : "border-l-blue-600 dark:border-l-blue-400";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm overflow-hidden border-l-4",
        leftBorderColor,
        pending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          <span suppressHydrationWarning>{matchDate}</span>
        </div>
        <div className="flex items-center gap-2">
          {match.grupo && (
            <Badge variant="muted">{match.grupo.nombre}</Badge>
          )}
          {finished ? (
            <Badge variant="success">Finished</Badge>
          ) : locked ? (
            <Badge variant="warning">Locked</Badge>
          ) : (
            <Badge variant="info">Open</Badge>
          )}
        </div>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-4 px-6 py-6">
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
          <span className="font-bold text-foreground text-center">{match.local.nombre}</span>
          <span className="text-xs text-muted-foreground uppercase">{match.local.codigo}</span>
        </div>

        {finished ? (
          <div className="flex flex-col items-center gap-1">
            <div className="text-3xl font-black text-foreground tracking-tight tabular-nums">
              {match.resultadoLocal} – {match.resultadoVisitante}
            </div>
            {match.resultadoPenales && (
              <span className="text-xs text-muted-foreground">
                ({match.resultadoPenalesLocal} – {match.resultadoPenalesVisitante} pens)
              </span>
            )}
          </div>
        ) : (
          <div className="text-2xl font-bold text-border select-none">VS</div>
        )}

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
          <span className="font-bold text-foreground text-center">{match.visitante.nombre}</span>
          <span className="text-xs text-muted-foreground uppercase">{match.visitante.codigo}</span>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-5 pb-5 flex flex-col gap-3">
        {finished ? (
          userPrediction ? (
            <div className={cn(
              "flex items-center justify-center gap-2 rounded-xl py-2 px-4 text-sm font-semibold",
              predictionCorrect
                ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                : "bg-rh/10 text-rh"
            )}>
              {predictionCorrect ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {predictionCorrect
                ? `Correct! +${match.puntos} pts`
                : `Wrong prediction`}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl py-2 px-4 text-sm font-semibold bg-rh/10 text-rh">
              <XCircle className="h-4 w-4" />
              No prediction made
            </div>
          )
        ) : locked ? (
          <p className="text-center text-sm text-muted-foreground py-1">
            Predictions are locked for this match.
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground text-center">Your prediction</p>
            <div className="flex gap-2">
              <button
                className={cn(btnBase, btnVariant(match.pronostico?.ganador === "LOCAL"))}
                onClick={() => vote("LOCAL")}
                disabled={locked}
              >
                Home
              </button>
              <button
                className={cn(btnBase, btnVariant(match.pronostico?.ganador === "EMPATE"))}
                onClick={() => vote("EMPATE")}
                disabled={locked}
              >
                Draw
              </button>
              <button
                className={cn(btnBase, btnVariant(match.pronostico?.ganador === "VISITANTE"))}
                onClick={() => vote("VISITANTE")}
                disabled={locked}
              >
                Away
              </button>
            </div>
          </>
        )}

        <Link
          href="/forecast"
          className="flex items-center justify-center gap-1 text-xs text-rh hover:text-rh/80 transition-colors mt-1"
        >
          See all matches <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
