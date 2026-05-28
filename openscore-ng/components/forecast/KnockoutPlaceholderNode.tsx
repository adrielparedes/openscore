"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import type { BracketSide } from "./KnockoutMatchNode";

export interface KnockoutPlaceholderData extends Record<string, unknown> {
  local: string;
  visitante: string;
  fase: string;
  matchLabel: string;
  side?: BracketSide;
}

export type KnockoutPlaceholderNodeType = Node<
  KnockoutPlaceholderData,
  "knockoutPlaceholder"
>;

export default function KnockoutPlaceholderNode({
  data,
}: NodeProps<KnockoutPlaceholderNodeType>) {
  const { side = "left" } = data;
  const isRight = side === "right";
  const isCenter = side === "center";

  const handleCls = "!w-2 !h-2 !bg-slate-300 !border-slate-300";

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 w-[260px] overflow-hidden opacity-70">
      {/* Target handle(s) */}
      {!isRight  && <Handle type="target" position={Position.Left}  id="tl" className={handleCls} />}
      {(isRight || isCenter) && <Handle type="target" position={Position.Right} id="tr" className={handleCls} />}

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/60 border-b border-slate-200">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
          {data.fase}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">{data.matchLabel}</span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between px-3 py-3 gap-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-5 h-3.5 rounded-sm bg-slate-200 flex-shrink-0" />
          <span className="text-xs font-medium text-slate-400 truncate">{data.local}</span>
        </div>
        <div className="px-1.5 flex-shrink-0">
          <HelpCircle className="h-4 w-4 text-slate-300" />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-xs font-medium text-slate-400 truncate text-right">{data.visitante}</span>
          <div className="w-5 h-3.5 rounded-sm bg-slate-200 flex-shrink-0" />
        </div>
      </div>

      {/* Disabled prediction buttons */}
      <div className="px-3 pb-3 flex gap-1.5">
        {["Home", "Draw", "Away"].map((label) => (
          <div key={label} className={cn(
            "flex-1 rounded py-1.5 text-center text-[11px] font-semibold",
            "bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed"
          )}>
            {label}
          </div>
        ))}
      </div>

      {/* Source handle */}
      {!isCenter && (
        <Handle type="source" position={isRight ? Position.Left : Position.Right}
          id="src" className={handleCls} />
      )}
    </div>
  );
}
