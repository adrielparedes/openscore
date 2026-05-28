"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { setPronostico } from "@/actions/pronosticos";
import type { PartidoPronostico } from "@/types";
import { cn } from "@/lib/utils";
import { flagUrl } from "@/lib/flags";
import { useTransition } from "react";

export type BracketSide = "left" | "right" | "center";

export type KnockoutMatchNodeType = Node<
  { match: PartidoPronostico; side?: BracketSide } & Record<string, unknown>,
  "knockoutMatch"
>;

export default function KnockoutMatchNode({ data }: NodeProps<KnockoutMatchNodeType>) {
  const { match, side = "left" } = data;
  const [pending, startTransition] = useTransition();
  const locked = match.status !== "PENDING";

  const isRight = side === "right";
  const isCenter = side === "center";

  const vote = (prediction: "local" | "visitante" | "empate") => {
    if (locked) return;
    startTransition(() => { setPronostico(match.id, prediction); });
  };

  const btnBase =
    "flex-1 rounded py-1.5 text-[11px] font-semibold transition-all border disabled:opacity-40 disabled:cursor-not-allowed";
  const btnVariant = (selected: boolean) =>
    selected
      ? "bg-rose-600 border-rose-500 text-white shadow-sm"
      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300";

  const handleCls = "!w-2 !h-2 !bg-slate-300 !border-slate-400";

  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-sm w-[260px] overflow-hidden text-left",
        locked ? "opacity-80 border-slate-200/60" : "border-slate-200",
        pending && "opacity-50 pointer-events-none"
      )}
    >
      {/* Target handle(s) */}
      {!isRight && <Handle type="target" position={Position.Left}  id="tl" className={handleCls} />}
      {(isRight || isCenter) && <Handle type="target" position={Position.Right} id="tr" className={handleCls} />}

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-100">
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
          {match.fase.nombre}
        </span>
        <span className={cn(
          "text-[10px] font-semibold",
          match.status === "PENDING"  && "text-emerald-600",
          match.status === "BLOCKED"  && "text-amber-600",
          match.status === "FINISHED" && "text-slate-400",
        )}>
          {match.status === "PENDING"  && "Open"}
          {match.status === "BLOCKED"  && "Locked"}
          {match.status === "FINISHED" && "Finished"}
        </span>
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between px-3 py-2.5 gap-1">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {flagUrl(match.local.codigo) && (
            <img src={flagUrl(match.local.codigo, 20)} alt={match.local.codigo}
              width={20} height={14} className="rounded-sm object-cover flex-shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-800 truncate">{match.local.nombre}</span>
        </div>
        <div className="px-1.5 text-xs font-bold text-slate-700 whitespace-nowrap flex-shrink-0">
          {match.status === "FINISHED"
            ? `${match.resultadoLocal} – ${match.resultadoVisitante}` : "vs"}
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-xs font-semibold text-slate-800 truncate text-right">{match.visitante.nombre}</span>
          {flagUrl(match.visitante.codigo) && (
            <img src={flagUrl(match.visitante.codigo, 20)} alt={match.visitante.codigo}
              width={20} height={14} className="rounded-sm object-cover flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Prediction buttons */}
      <div className="px-3 pb-3 flex gap-1.5">
        <button className={cn(btnBase, btnVariant(!!match.pronostico?.local))}     onClick={() => vote("local")}     disabled={locked}>Home</button>
        <button className={cn(btnBase, btnVariant(!!match.pronostico?.empate))}    onClick={() => vote("empate")}    disabled={locked}>Draw</button>
        <button className={cn(btnBase, btnVariant(!!match.pronostico?.visitante))} onClick={() => vote("visitante")} disabled={locked}>Away</button>
      </div>

      {match.status === "FINISHED" && match.puntos > 0 && (
        <div className="text-center text-[10px] font-semibold text-emerald-600 pb-2">
          +{match.puntos} pts ✓
        </div>
      )}

      {/* Source handle */}
      {!isCenter && (
        <Handle type="source" position={isRight ? Position.Left : Position.Right}
          id="src" className={handleCls} />
      )}
    </div>
  );
}
