"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, LayoutGrid, Trophy, LayoutList } from "lucide-react";
import FilterPill from "@/components/ui/FilterPill";
import { useBracket } from "./BracketContext";

const STAGES = [
  { code: "GRUPO", label: "Group Stage" },
  { code: "TREINTAIDOSAVOS", label: "Round of 32" },
  { code: "OCTAVOS", label: "Round of 16" },
  { code: "CUARTOS", label: "Quarter Finals" },
  { code: "SEMI", label: "Semi-Finals" },
  { code: "TERCER_FINAL", label: "Third Place & Final" },
];

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.1;

export default function ForecastFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const { mode, setMode, zoom, setZoom, mounted } = useBracket();

  const active = {
    grupo: params.get("grupo"),
    fase: params.get("fase"),
    fecha: params.get("fecha"),
    view: params.get("view"),
  };

  const isBracket = active.view === "bracket";
  const isUpcoming = !active.grupo && !active.fase && !active.fecha && !active.view;
  const isAll = active.view === "all" && !active.grupo && !active.fase && !active.fecha;

  function navigate(key: string, value: string | null) {
    const p = new URLSearchParams();
    if (value) p.set(key, value);
    router.push(`/forecast?${p.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* Top row: Upcoming / All / Bracket + bracket toolbar */}
      <div className="flex gap-2 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          <FilterPill active={isUpcoming} onClick={() => router.push("/forecast")}>
            <CalendarDays className="h-3 w-3" />
            Upcoming
          </FilterPill>

          <FilterPill active={isAll} onClick={() => navigate("view", "all")}>
            <LayoutGrid className="h-3 w-3" />
            All matches
          </FilterPill>

          <div className="hidden lg:block">
            <FilterPill active={isBracket} onClick={() => router.push("/forecast?view=bracket")}>
              <Trophy className="h-3 w-3" />
              Knockout Bracket
            </FilterPill>
          </div>
        </div>

        {/* Bracket toolbar — only when in bracket view and preference loaded */}
        {isBracket && mounted && (
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setMode("condensed")}
                className={`h-7 px-2.5 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "condensed" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" />
                Condensed
              </button>
              <button
                onClick={() => setMode("normal")}
                className={`h-7 px-2.5 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "normal" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Normal
              </button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom(Math.max(MIN_ZOOM, parseFloat((zoom - ZOOM_STEP).toFixed(1))))}
                disabled={zoom <= MIN_ZOOM}
                className="h-7 w-7 rounded border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold text-base leading-none"
              >−</button>
              <span className="text-xs text-slate-500 w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(MAX_ZOOM, parseFloat((zoom + ZOOM_STEP).toFixed(1))))}
                disabled={zoom >= MAX_ZOOM}
                className="h-7 w-7 rounded border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold text-base leading-none"
              >+</button>
            </div>
          </div>
        )}
      </div>

      {/* Stage filters */}
      {!isBracket && (
        <div className="flex gap-2 flex-wrap">
          {STAGES.map((stage) => (
            <FilterPill
              key={stage.code}
              active={active.fase === stage.code}
              onClick={() => navigate("fase", active.fase === stage.code ? null : stage.code)}
            >
              {stage.label}
            </FilterPill>
          ))}
        </div>
      )}
    </div>
  );
}
