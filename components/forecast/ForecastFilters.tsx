"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, LayoutGrid, Trophy, LayoutList } from "lucide-react";
import FilterPill from "@/components/ui/FilterPill";
import { useBracket } from "./BracketContext";

const NOT_PREDICTED_KEY = "openscore-not-predicted";

const STAGES = [
  { code: "GRUPO", label: "Group Stage" },
  { code: "TREINTAIDOSAVOS", label: "Round of 32" },
  { code: "OCTAVOS", label: "Round of 16" },
  { code: "CUARTOS", label: "Quarter Finals" },
  { code: "SEMI", label: "Semi-Finals" },
  { code: "TERCER_FINAL", label: "Third Place & Final" },
];

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map((l) => ({
  code: `GRUPO_${l}`,
  label: `Group ${l}`,
}));

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.1;

export default function ForecastFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const { mode, setMode, zoom, setZoom, mounted: bracketMounted } = useBracket();

  const [notPredicted, setNotPredicted] = useState(false);
  const [npMounted, setNpMounted] = useState(false);

  useEffect(() => {
    setNotPredicted(localStorage.getItem(NOT_PREDICTED_KEY) === "true");
    setNpMounted(true);
  }, []);

  const active = {
    grupo: params.get("grupo"),
    fase: params.get("fase"),
    fecha: params.get("fecha"),
    view: params.get("view"),
  };

  const isBracket = active.view === "bracket";
  const isUpcoming = !active.grupo && !active.fase && !active.fecha && !active.view;
  const isAll = active.view === "all" && !active.grupo && !active.fase && !active.fecha;

  const buildUrl = useCallback((base: URLSearchParams, np: boolean) => {
    if (np) base.set("filter", "not-predicted");
    else base.delete("filter");
    return `/forecast?${base.toString()}`;
  }, []);

  function navigate(key: string, value: string | null) {
    const p = new URLSearchParams();
    if (value) p.set(key, value);
    router.push(buildUrl(p, notPredicted));
  }

  function toggleNotPredicted() {
    const next = !notPredicted;
    setNotPredicted(next);
    localStorage.setItem(NOT_PREDICTED_KEY, String(next));
    const p = new URLSearchParams(params.toString());
    router.push(buildUrl(p, next));
  }

  function navigateGroup(code: string) {
    const p = new URLSearchParams();
    p.set("fase", "GRUPO");
    if (active.grupo !== code) p.set("grupo", code);
    router.push(buildUrl(p, notPredicted));
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* Top row: Upcoming / All / Bracket + bracket toolbar */}
      <div className="flex gap-2 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          <FilterPill active={isUpcoming} onClick={() => router.push(buildUrl(new URLSearchParams(), notPredicted))}>
            <CalendarDays className="h-3 w-3" />
            Upcoming
          </FilterPill>

          <FilterPill active={isAll} onClick={() => navigate("view", "all")}>
            <LayoutGrid className="h-3 w-3" />
            All matches
          </FilterPill>

          <div className="hidden lg:block">
            <FilterPill active={isBracket} onClick={() => router.push(buildUrl(new URLSearchParams([["view", "bracket"]]), notPredicted))}>
              <Trophy className="h-3 w-3" />
              Knockout Bracket
            </FilterPill>
          </div>
        </div>

        {/* Bracket toolbar — only when in bracket view and preference loaded */}
        {isBracket && bracketMounted && (
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setMode("condensed")}
                className={`h-7 px-2.5 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "condensed" ? "bg-nav text-white" : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" />
                Condensed
              </button>
              <button
                onClick={() => setMode("normal")}
                className={`h-7 px-2.5 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === "normal" ? "bg-nav text-white" : "text-muted-foreground hover:bg-accent/50"
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
                className="h-7 w-7 rounded border border-border bg-card text-muted-foreground flex items-center justify-center hover:bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold text-base leading-none"
              >−</button>
              <span className="text-xs text-muted-foreground w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(MAX_ZOOM, parseFloat((zoom + ZOOM_STEP).toFixed(1))))}
                disabled={zoom >= MAX_ZOOM}
                className="h-7 w-7 rounded border border-border bg-card text-muted-foreground flex items-center justify-center hover:bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold text-base leading-none"
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

      {/* Group filters — only when Group Stage is selected */}
      {!isBracket && active.fase === "GRUPO" && (
        <div className="flex gap-2 flex-wrap">
          {GROUPS.map((group) => (
            <FilterPill
              key={group.code}
              active={active.grupo === group.code}
              onClick={() => navigateGroup(group.code)}
            >
              {group.label}
            </FilterPill>
          ))}
        </div>
      )}

      {/* Not Predicted toggle */}
      {!isBracket && npMounted && (
        <label className="inline-flex items-center gap-2 cursor-pointer select-none self-start">
          <button
            role="switch"
            aria-checked={notPredicted}
            onClick={toggleNotPredicted}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200 cursor-pointer ${
              notPredicted
                ? "bg-gradient-to-r from-rh to-rose-700 border-white/20"
                : "bg-muted border-border"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                notPredicted ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-xs font-medium transition-colors ${notPredicted ? "text-foreground" : "text-muted-foreground"}`}>
            Show only not predicted
          </span>
        </label>
      )}
    </div>
  );
}
