"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import MatchCard from "./MatchCard";
import { flagUrl } from "@/lib/flags";
import { X, Timer, Check } from "lucide-react";
import { useBracket } from "./BracketContext";
import { useNow } from "@/components/providers/CountdownProvider";
import { cn } from "@/lib/utils";
import type { PartidoPronostico } from "@/types";

const LOCK_OFFSET_MS = 15 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

function formatCountdown(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (ms < FIVE_MINUTES_MS) return `${m.toString().padStart(2, "0")}m:${s.toString().padStart(2, "0")}s`;
  return `${d}d:${h.toString().padStart(2, "0")}h:${m.toString().padStart(2, "0")}m`;
}

// ─── View configs ─────────────────────────────────────────────────────────────
type ViewMode = "condensed" | "normal";

const CONFIGS: Record<ViewMode, { CARD_W: number; CARD_H: number; H_GAP: number; V_GAP: number; HEADER_H: number; CONTENT_PAD: number }> = {
  condensed: { CARD_W: 200, CARD_H: 76,  H_GAP: 32, V_GAP: 12, HEADER_H: 48, CONTENT_PAD: 16 },
  normal:    { CARD_W: 260, CARD_H: 292, H_GAP: 40, V_GAP: 24, HEADER_H: 64, CONTENT_PAD: 24 },
};

// ─── Phase metadata ───────────────────────────────────────────────────────────
const PER_WING: Record<string, number> = {
  TREINTAIDOSAVOS: 8,
  OCTAVOS:         4,
  CUARTOS:         2,
  SEMI:            1,
};

const PHASE_LABEL: Record<string, string> = {
  TREINTAIDOSAVOS: "Round of 32",
  OCTAVOS:         "Round of 16",
  CUARTOS:         "Quarter-finals",
  SEMI:            "Semi-finals",
  TERCER:          "3rd Place",
  FINAL:           "Final",
};

const WING_PHASE_CODES = ["TREINTAIDOSAVOS", "OCTAVOS", "CUARTOS", "SEMI"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slot {
  key:   string;
  match: PartidoPronostico | null;
  x:     number;
  y:     number;
  phase: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function halve(arr: number[]): number[] {
  const res: number[] = [];
  for (let i = 0; i < Math.floor(arr.length / 2); i++) {
    res.push((arr[2 * i] + arr[2 * i + 1]) / 2);
  }
  return res;
}

// ─── Static bracket structure ────────────────────────────────────────────────
// Maps each knockout match to its two feeder match IDs [local, visitante].
// This is immune to advanceKnockoutWinners replacing W{N} placeholder teams
// with real teams — the bracket wiring never changes.
const BRACKET_FEEDERS: Record<number, [number, number]> = {
  89: [74, 76], 90: [73, 75], 91: [79, 80], 92: [77, 78],
  93: [83, 84], 94: [85, 86], 95: [81, 82], 96: [87, 88],
  97: [89, 90], 98: [93, 94], 99: [91, 92], 100: [95, 96],
  101: [97, 98], 102: [99, 100],
  104: [101, 102],
};

// ─── Bracket order derivation ─────────────────────────────────────────────────
// Walks the tree level-by-level from the Final backwards, ensuring that adjacent
// pairs at each phase feed into the correct next-round slot.
function deriveBracketOrder(matches: PartidoPronostico[]): Record<string, PartidoPronostico[]> {
  const byId = new Map(matches.map(m => [m.id, m]));
  const byPhase: Record<string, PartidoPronostico[]> = {};
  for (const m of matches) {
    const c = m.fase.codigo;
    if (!byPhase[c]) byPhase[c] = [];
    byPhase[c].push(m);
  }

  const finalMatch = byPhase["FINAL"]?.[0];
  const tercerMatch = byPhase["TERCER"]?.[0];
  if (!finalMatch) {
    for (const arr of Object.values(byPhase)) {
      arr.sort((a, b) => a.id - b.id);
    }
    return byPhase;
  }

  function getFeeders(matchId: number): [number | null, number | null] {
    const entry = BRACKET_FEEDERS[matchId];
    if (entry) return entry;
    const m = byId.get(matchId);
    if (!m) return [null, null];
    const lm = m.local.codigo.match(/^W(\d+)$/);
    const vm = m.visitante.codigo.match(/^W(\d+)$/);
    return [lm ? parseInt(lm[1]) : null, vm ? parseInt(vm[1]) : null];
  }

  function expandLevel(matchIds: number[]): number[] {
    const result: number[] = [];
    for (const id of matchIds) {
      if (!byId.has(id)) continue;
      const [l, r] = getFeeders(id);
      if (l !== null) result.push(l);
      if (r !== null) result.push(r);
    }
    return result;
  }

  const [sf1Id, sf2Id] = getFeeders(finalMatch.id);
  const semiIds = [sf1Id, sf2Id].filter((id): id is number => id !== null);

  const phaseIds: Record<string, number[]> = {};
  phaseIds["SEMI"] = semiIds;
  phaseIds["CUARTOS"] = expandLevel(semiIds);
  phaseIds["OCTAVOS"] = expandLevel(phaseIds["CUARTOS"]);
  phaseIds["TREINTAIDOSAVOS"] = expandLevel(phaseIds["OCTAVOS"]);

  const ordered: Record<string, PartidoPronostico[]> = {};
  for (const phase of WING_PHASE_CODES) {
    const ids = phaseIds[phase] ?? [];
    ordered[phase] = ids.map(id => byId.get(id)!).filter(Boolean);
  }
  ordered["FINAL"] = finalMatch ? [finalMatch] : [];
  ordered["TERCER"] = tercerMatch ? [tercerMatch] : [];

  return ordered;
}

// ─── Layout builder ────────────────────────────────────────────────────────────
function buildLayout(matches: PartidoPronostico[], cfg: typeof CONFIGS[ViewMode]) {
  const { CARD_W, CARD_H, H_GAP, V_GAP } = cfg;
  const COL_W  = CARD_W + H_GAP;
  const SLOT_H = CARD_H + V_GAP;

  const byPhase = deriveBracketOrder(matches);

  const wingPhases = WING_PHASE_CODES.filter(p => (byPhase[p]?.length ?? 0) > 0);
  const nCols = Math.max(wingPhases.length, 1);
  const outerPhase   = wingPhases[0] ?? "SEMI";
  const outerPerWing = PER_WING[outerPhase] ?? 1;

  const centresByPhase: Record<string, number[]> = {};
  let cs = Array.from({ length: outerPerWing }, (_, i) => i * SLOT_H + CARD_H / 2);
  for (const p of wingPhases) {
    centresByPhase[p] = cs;
    cs = halve(cs);
  }
  const finalCentreY =
    wingPhases.length > 0
      ? centresByPhase[wingPhases[wingPhases.length - 1]][0]
      : CARD_H / 2;

  const finalX     = nCols * COL_W;
  const totalWidth = (2 * nCols + 1) * COL_W - H_GAP;
  const slots: Slot[]   = [];
  const paths: string[] = [];

  // Left wing
  for (let pi = 0; pi < wingPhases.length; pi++) {
    const phase   = wingPhases[pi];
    const x       = pi * COL_W;
    const phArr   = byPhase[phase] ?? [];
    const nExp    = PER_WING[phase] ?? 1;
    const centres = centresByPhase[phase];

    for (let i = 0; i < nExp; i++) {
      slots.push({ key: `L-${phase}-${i}`, match: phArr[i] ?? null, x, y: centres[i] - CARD_H / 2, phase });
    }

    const xR   = x + CARD_W;
    const xMid = xR + H_GAP / 2;

    if (pi < wingPhases.length - 1) {
      const nextC = centresByPhase[wingPhases[pi + 1]];
      const xNext = (pi + 1) * COL_W;
      for (let i = 0; i < nextC.length; i++) {
        const c1 = centres[2 * i]; const c2 = centres[2 * i + 1]; const cp = nextC[i];
        paths.push(`M ${xR} ${c1} H ${xMid} V ${c2} H ${xR}`);
        paths.push(`M ${xMid} ${cp} H ${xNext}`);
      }
    } else {
      paths.push(`M ${xR} ${finalCentreY} H ${finalX}`);
    }
  }

  // Right wing
  for (let pi = 0; pi < wingPhases.length; pi++) {
    const phase      = wingPhases[pi];
    const colFromCtr = wingPhases.length - pi;
    const x          = finalX + colFromCtr * COL_W;
    const phArr      = byPhase[phase] ?? [];
    const nExp       = PER_WING[phase] ?? 1;
    const centres    = centresByPhase[phase];

    for (let i = 0; i < nExp; i++) {
      slots.push({ key: `R-${phase}-${i}`, match: phArr[nExp + i] ?? null, x, y: centres[i] - CARD_H / 2, phase });
    }

    const xL   = x;
    const xMid = xL - H_GAP / 2;

    if (pi < wingPhases.length - 1) {
      const nextC  = centresByPhase[wingPhases[pi + 1]];
      const xInner = finalX + (colFromCtr - 1) * COL_W;
      for (let i = 0; i < nextC.length; i++) {
        const c1 = centres[2 * i]; const c2 = centres[2 * i + 1]; const cp = nextC[i];
        paths.push(`M ${xL} ${c1} H ${xMid} V ${c2} H ${xL}`);
        paths.push(`M ${xMid} ${cp} H ${xInner + CARD_W}`);
      }
    } else {
      paths.push(`M ${xL} ${finalCentreY} H ${finalX + CARD_W}`);
    }
  }

  const fin      = byPhase["FINAL"]?.[0]  ?? null;
  const ter      = byPhase["TERCER"]?.[0] ?? null;
  const finalTop = finalCentreY - CARD_H / 2;
  const thirdTop = finalTop + CARD_H + 40;

  slots.push({ key: "final", match: fin, x: finalX, y: finalTop,  phase: "FINAL"  });
  if (wingPhases.includes("SEMI")) {
    slots.push({ key: "third", match: ter, x: finalX, y: thirdTop, phase: "TERCER" });
  }

  const headers: { label: string; x: number; isFinal: boolean }[] = [
    ...wingPhases.map((p, pi) => ({ label: PHASE_LABEL[p], x: pi * COL_W, isFinal: false })),
    { label: "Final", x: finalX, isFinal: true },
    ...wingPhases.map((p, pi) => ({ label: PHASE_LABEL[p], x: finalX + (wingPhases.length - pi) * COL_W, isFinal: false })),
  ];

  const outerColH   = outerPerWing * SLOT_H;
  const finalColH   = thirdTop + CARD_H + V_GAP;
  const totalHeight = Math.max(outerColH, finalColH);

  return { slots, paths, totalWidth, totalHeight, headers };
}

// ─── Team cell inside compact node ────────────────────────────────────────────
function NodeTeam({ codigo, nombre }: { codigo: string; nombre: string }) {
  const flag = flagUrl(codigo, 40);
  if (flag) {
    return (
      <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
        <div className="w-6 h-4 rounded overflow-hidden shrink-0">
          <img src={flag} alt={codigo} className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-foreground text-[11px]">{codigo}</span>
      </div>
    );
  }
  // Placeholder: "Winner Group A" → "Winner" / "Group A"
  const sp = nombre.indexOf(" ");
  const line1 = sp !== -1 ? nombre.slice(0, sp) : nombre;
  const line2 = sp !== -1 ? nombre.slice(sp + 1) : null;
  return (
    <div className="flex-1 min-w-0 flex flex-col items-center leading-tight">
      <span className="font-semibold text-foreground text-[10px] whitespace-nowrap">{line1.replace(/-/g, '‑')}</span>
      {line2 && <span className="text-muted-foreground text-[10px] whitespace-nowrap">{line2.replace(/-/g, '‑')}</span>}
    </div>
  );
}

// ─── Compact node (condensed view) ────────────────────────────────────────────
function KnockoutNode({ slot, cardH, onClick }: { slot: Slot; cardH: number; onClick: () => void }) {
  const now = useNow();

  if (!slot.match) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background flex items-center justify-center" style={{ height: cardH }}>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">{PHASE_LABEL[slot.phase]}</span>
      </div>
    );
  }

  const m = slot.match;
  const finished = m.status === "FINISHED";
  const pick = m.pronostico?.ganador;
  const pickLabel =
    pick === "LOCAL"     ? m.local.codigo :
    pick === "VISITANTE" ? m.visitante.codigo :
    pick === "EMPATE"    ? "Draw" : null;

  const correct = finished && pick != null && m.puntos > 0;
  const wrong   = finished && pick != null && m.puntos === 0;
  const missed  = finished && pick == null;

  const borderColor = finished
    ? correct
      ? "border-l-emerald-600 dark:border-l-emerald-400"
      : "border-l-rh"
    : m.status === "BLOCKED"
    ? "border-l-amber-600 dark:border-l-amber-400"
    : "";

  const lockAtMs = new Date(m.dia).getTime() - LOCK_OFFSET_MS;
  const remaining = m.status !== "PENDING" ? 0 : Math.max(0, lockAtMs - now);
  const showLock = m.status === "PENDING" && remaining > 0;
  const isUrgent = remaining < FIVE_MINUTES_MS;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border bg-card hover:border-rose-300 hover:shadow-md transition-all text-left flex flex-col justify-center gap-1.5 px-2.5 py-2 cursor-pointer",
        finished || m.status === "BLOCKED" ? "border-l-4 border-border" : "border border-border",
        borderColor
      )}
      style={{ height: cardH }}
    >
      <div className="flex items-center justify-center gap-1">
        <NodeTeam codigo={m.local.codigo} nombre={m.local.nombre} />
        <span className="shrink-0 font-bold text-border text-[10px] w-8 text-center">
          {finished ? `${m.resultadoLocal}–${m.resultadoVisitante}` : "vs"}
        </span>
        <NodeTeam codigo={m.visitante.codigo} nombre={m.visitante.nombre} />
      </div>
      <div className="flex items-center">
        {showLock ? (
          <div className="group relative shrink-0">
            <Timer className={cn("h-3 w-3 translate-y-[1px]", isUrgent ? "text-rh" : "text-amber-700 dark:text-amber-400")} />
            <div className="pointer-events-none absolute bottom-full left-0 mb-1.5 hidden group-hover:block z-20">
              <div className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold whitespace-nowrap shadow-md",
                isUrgent ? "bg-rh/10 text-rh" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
              )}>
                <Timer className="h-2.5 w-2.5" />
                Locks in {formatCountdown(remaining)}
              </div>
            </div>
          </div>
        ) : <div className="w-3" />}
        <div className="flex-1 text-[10px] text-center leading-none">
          {pickLabel ? (
            correct ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center justify-center gap-0.5">
                <Check className="h-3 w-3" /> {pickLabel} +{m.puntos}
              </span>
            ) : wrong ? (
              <span className="text-rh font-semibold inline-flex items-center justify-center gap-0.5">
                <X className="h-3 w-3" /> {pickLabel}
              </span>
            ) : (
              <span className="text-primary font-semibold">Your pick: {pickLabel}</span>
            )
          ) : missed ? (
            <span className="text-rh font-semibold">No prediction</span>
          ) : m.status === "PENDING" ? (
            <span className="text-muted-foreground">Tap to predict</span>
          ) : (
            <span className="text-border">No prediction</span>
          )}
        </div>
        <div className="w-3" />
      </div>
    </button>
  );
}

// ─── Full node (normal view) ───────────────────────────────────────────────────
function FullNode({ slot, cardH }: { slot: Slot; cardH: number }) {
  if (!slot.match) {
    return (
      <div
        className="rounded-2xl border border-dashed border-border bg-card flex flex-col items-center justify-center gap-1 text-muted-foreground"
        style={{ height: cardH }}
      >
        <span className="text-xs font-semibold uppercase tracking-wide">{PHASE_LABEL[slot.phase]}</span>
        <span className="text-xs">TBD</span>
      </div>
    );
  }
  return <MatchCard match={slot.match} />;
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
function MatchModal({ match, onClose }: { match: PartidoPronostico; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {PHASE_LABEL[match.fase.codigo] ?? match.fase.codigo}
              </p>
              <p className="text-sm font-bold text-foreground">
                {match.local.nombre} vs {match.visitante.nombre}
              </p>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-y-auto p-4">
            <MatchCard match={match} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface KnockoutTreeProps {
  matches: PartidoPronostico[];
}

export default function KnockoutTree({ matches }: KnockoutTreeProps) {
  const { mode, zoom, mounted } = useBracket();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const measureContainer = useCallback(() => {
    if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
  }, []);

  useEffect(() => {
    measureContainer();
    window.addEventListener("resize", measureContainer);
    return () => window.removeEventListener("resize", measureContainer);
  }, [measureContainer]);

  if (!mounted) {
    return (
      <div className="w-full rounded-xl border border-border bg-background animate-pulse" style={{ height: "60vh", minHeight: 400 }} />
    );
  }
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = selectedId != null ? (matches.find(m => m.id === selectedId) ?? null) : null;

  const cfg = CONFIGS[mode];
  const layout = useMemo(() => buildLayout(matches, cfg), [matches, cfg]);
  const totalH = layout.totalHeight + cfg.HEADER_H + cfg.CONTENT_PAD;

  const fitScale = containerWidth > 0 ? containerWidth / layout.totalWidth : 1;
  const effectiveZoom = zoom * fitScale;

  return (
    <div ref={containerRef}>

      <div className="overflow-x-auto overflow-y-auto">
        <div style={{ width: layout.totalWidth * effectiveZoom, height: totalH * effectiveZoom }}>
          <div style={{ transformOrigin: "top left", transform: `scale(${effectiveZoom})`, width: layout.totalWidth, height: totalH }}>
            <div className="relative mx-auto" style={{ width: layout.totalWidth, height: totalH }}>

              {/* Phase headers */}
              <div
                className="absolute z-10 border-b border-border bg-card/95 backdrop-blur-sm"
                style={{ top: 0, left: 0, width: layout.totalWidth, height: cfg.HEADER_H }}
              >
                {layout.headers.map((h, i) => (
                  <div
                    key={i}
                    className="absolute flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide"
                    style={{ left: h.x, width: cfg.CARD_W, height: cfg.HEADER_H }}
                  >
                    {h.isFinal
                      ? <span className="text-primary">{h.label}</span>
                      : <span className="text-muted-foreground">{h.label}</span>
                    }
                  </div>
                ))}
              </div>

              {/* SVG + nodes */}
              <div
                className="absolute"
                style={{ top: cfg.HEADER_H + cfg.CONTENT_PAD, left: 0, width: layout.totalWidth, height: layout.totalHeight }}
              >
                <svg className="absolute inset-0 pointer-events-none" width={layout.totalWidth} height={layout.totalHeight}>
                  {layout.paths.map((d, i) => (
                    <path key={i} d={d} fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  ))}
                </svg>

                {layout.slots.map((slot) => (
                  <div key={slot.key} className="absolute" style={{ left: slot.x, top: slot.y, width: cfg.CARD_W }}>
                    {mode === "condensed" ? (
                      <KnockoutNode
                        slot={slot}
                        cardH={cfg.CARD_H}
                        onClick={() => slot.match && setSelectedId(slot.match.id)}
                      />
                    ) : (
                      <FullNode slot={slot} cardH={cfg.CARD_H} />
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {selected && mode === "condensed" && (
        <MatchModal match={selected} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
