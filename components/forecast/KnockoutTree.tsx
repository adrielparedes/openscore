"use client";

import { useMemo, useState } from "react";
import MatchCard from "./MatchCard";
import { flagUrl } from "@/lib/flags";
import { X } from "lucide-react";
import { useBracket } from "./BracketContext";
import type { PartidoPronostico } from "@/types";

// ─── View configs ─────────────────────────────────────────────────────────────
const CONFIGS = {
  condensed: { CARD_W: 200, CARD_H: 76,  H_GAP: 32, V_GAP: 12, HEADER_H: 48, CONTENT_PAD: 16 },
  normal:    { CARD_W: 260, CARD_H: 292, H_GAP: 40, V_GAP: 24, HEADER_H: 64, CONTENT_PAD: 24 },
} as const;

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

// ─── Layout builder ────────────────────────────────────────────────────────────
function buildLayout(matches: PartidoPronostico[], cfg: typeof CONFIGS[ViewMode]) {
  const { CARD_W, CARD_H, H_GAP, V_GAP } = cfg;
  const COL_W  = CARD_W + H_GAP;
  const SLOT_H = CARD_H + V_GAP;

  const byPhase: Record<string, PartidoPronostico[]> = {};
  for (const m of matches) {
    const c = m.fase.codigo;
    if (!byPhase[c]) byPhase[c] = [];
    byPhase[c].push(m);
  }
  for (const arr of Object.values(byPhase)) {
    arr.sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime());
  }

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

// ─── Compact node (condensed view) ────────────────────────────────────────────
function KnockoutNode({ slot, cardH, onClick }: { slot: Slot; cardH: number; onClick: () => void }) {
  if (!slot.match) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center" style={{ height: cardH }}>
        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{PHASE_LABEL[slot.phase]}</span>
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

  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-md transition-all text-left flex flex-col justify-center gap-1.5 px-2.5 py-2 cursor-pointer"
      style={{ height: cardH }}
    >
      <div className="flex items-center gap-1.5 text-xs">
        {flagUrl(m.local.codigo, 40) && (
          <div className="w-6 h-4 rounded overflow-hidden shrink-0">
            <img src={flagUrl(m.local.codigo, 40)} alt={m.local.codigo} className="w-full h-full object-cover" />
          </div>
        )}
        <span className="font-semibold text-slate-800 truncate flex-1">{m.local.nombre}</span>
        <span className="shrink-0 font-bold text-slate-400 text-[11px] w-10 text-center">
          {finished ? `${m.resultadoLocal}–${m.resultadoVisitante}` : "vs"}
        </span>
        <span className="font-semibold text-slate-800 truncate flex-1 text-right">{m.visitante.nombre}</span>
        {flagUrl(m.visitante.codigo, 40) && (
          <div className="w-6 h-4 rounded overflow-hidden shrink-0">
            <img src={flagUrl(m.visitante.codigo, 40)} alt={m.visitante.codigo} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div className="text-[10px] text-center leading-none">
        {pickLabel ? (
          <span className="text-rose-500 font-semibold">Your pick: {pickLabel}</span>
        ) : m.status === "PENDING" ? (
          <span className="text-slate-400">Tap to predict</span>
        ) : (
          <span className="text-slate-300">No prediction</span>
        )}
      </div>
    </button>
  );
}

// ─── Full node (normal view) ───────────────────────────────────────────────────
function FullNode({ slot, cardH }: { slot: Slot; cardH: number }) {
  if (!slot.match) {
    return (
      <div
        className="rounded-2xl border border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-1 text-slate-400"
        style={{ height: cardH }}
      >
        <span className="text-xs font-semibold uppercase tracking-wide">{PHASE_LABEL[slot.phase]}</span>
        <span className="text-xs">TBD</span>
      </div>
    );
  }
  return <MatchCard match={slot.match} />;
}

// ─── Drawer ────────────────────────────────────────────────────────────────────
function MatchDrawer({ match, onClose }: { match: PartidoPronostico; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {PHASE_LABEL[match.fase.codigo] ?? match.fase.codigo}
            </p>
            <p className="text-sm font-bold text-slate-900">
              {match.local.nombre} vs {match.visitante.nombre}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <MatchCard match={match} />
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
  const { mode, zoom } = useBracket();
  const [selected, setSelected] = useState<PartidoPronostico | null>(null);

  const cfg = CONFIGS[mode];
  const layout = useMemo(() => buildLayout(matches, cfg), [matches, cfg]);
  const totalH = layout.totalHeight + cfg.HEADER_H + cfg.CONTENT_PAD;

  return (
    <div>

      <div className="overflow-x-auto overflow-y-auto">
        <div style={{ width: layout.totalWidth * zoom, height: totalH * zoom }}>
          <div style={{ transformOrigin: "top left", transform: `scale(${zoom})`, width: layout.totalWidth, height: totalH }}>
            <div className="relative mx-auto" style={{ width: layout.totalWidth, height: totalH }}>

              {/* Phase headers */}
              <div
                className="absolute z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm"
                style={{ top: 0, left: 0, width: layout.totalWidth, height: cfg.HEADER_H }}
              >
                {layout.headers.map((h, i) => (
                  <div
                    key={i}
                    className="absolute flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide"
                    style={{ left: h.x, width: cfg.CARD_W, height: cfg.HEADER_H }}
                  >
                    {h.isFinal
                      ? <span className="text-rose-500">{h.label}</span>
                      : <span className="text-slate-400">{h.label}</span>
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
                        onClick={() => slot.match && setSelected(slot.match)}
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
        <MatchDrawer match={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
