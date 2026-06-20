"use client";

import { useState } from "react";
import ResultMatchCard from "@/components/admin/ResultMatchCard";
import type { PartidoConRelaciones, Equipo } from "@/types";
import { cn } from "@/lib/utils";

interface AdminResultsListProps {
  partidos: PartidoConRelaciones[];
  equipos: Equipo[];
}

export default function AdminResultsList({ partidos, equipos }: AdminResultsListProps) {
  const [pendingOnly, setPendingOnly] = useState(true);

  const filtered = pendingOnly
    ? partidos.filter((p) => p.resultadoLocal == null)
    : partidos;

  const pendingCount = partidos.filter((p) => p.resultadoLocal == null).length;

  return (
    <>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            className={cn(
              "relative w-9 h-5 rounded-full transition-colors",
              pendingOnly ? "bg-rose-500" : "bg-muted"
            )}
            onClick={() => setPendingOnly((v) => !v)}
          >
            <div
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform",
                pendingOnly && "translate-x-4"
              )}
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            Pending only
          </span>
        </label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {pendingOnly
            ? `${filtered.length} pending`
            : `${partidos.length} total · ${pendingCount} pending`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((partido) => (
          <ResultMatchCard key={partido.id} match={partido} equipos={equipos} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
          {pendingOnly ? "All matches have results!" : "No matches found."}
        </div>
      )}
    </>
  );
}
