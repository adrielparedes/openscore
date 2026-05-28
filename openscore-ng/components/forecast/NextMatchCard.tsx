"use client";

import { useTransition } from "react";
import { setPronostico } from "@/actions/pronosticos";
import type { PartidoPronostico } from "@/types";
import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/flags";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";

interface NextMatchCardProps {
  match: PartidoPronostico;
}

export default function NextMatchCard({ match }: NextMatchCardProps) {
  const [pending, startTransition] = useTransition();
  const locked = match.status !== "PENDING";

  const vote = (prediction: "local" | "visitante" | "empate") => {
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
  });

  const btnBase =
    "flex-1 rounded-xl py-3 text-sm font-semibold transition-all border disabled:opacity-50 disabled:cursor-not-allowed";

  const btnVariant = (selected: boolean) =>
    selected
      ? "bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-200/50 scale-[1.02]"
      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900";

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden",
        pending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarClock className="h-3.5 w-3.5" />
          <span>{matchDate}</span>
        </div>
        <div className="flex items-center gap-2">
          {match.grupo && (
            <Badge variant="muted">{match.grupo.nombre}</Badge>
          )}
          {locked ? (
            <Badge variant="warning">Locked</Badge>
          ) : (
            <Badge variant="success">Open</Badge>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-4 px-6 py-6">
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
          <span className="font-bold text-slate-900 text-center">{match.local.nombre}</span>
          <span className="text-xs text-slate-400 uppercase">{match.local.codigo}</span>
        </div>

        <div className="text-2xl font-bold text-slate-300 select-none">VS</div>

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
          <span className="font-bold text-slate-900 text-center">{match.visitante.nombre}</span>
          <span className="text-xs text-slate-400 uppercase">{match.visitante.codigo}</span>
        </div>
      </div>

      {/* Prediction buttons */}
      <div className="px-5 pb-5 flex flex-col gap-3">
        {locked ? (
          <p className="text-center text-sm text-slate-400 py-1">
            Predictions are locked for this match.
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-400 text-center">Your prediction</p>
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
          </>
        )}

        <Link
          href="/forecast"
          className="flex items-center justify-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors mt-1"
        >
          See all matches <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
