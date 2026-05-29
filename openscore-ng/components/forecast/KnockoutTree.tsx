"use client";

import { useMemo } from "react";
import MatchCard from "./MatchCard";
import type { PartidoPronostico } from "@/types";

// ─── Layout constants ─────────────────────────────────────────────────────────
const CARD_W   = 260;   // width given to each MatchCard container
const CARD_H   = 292;   // conservative estimated height of a rendered MatchCard
const H_GAP    = 40;    // horizontal gap between adjacent columns
const V_GAP    = 24;    // vertical gap between cards within a column
const COL_W    = CARD_W + H_GAP;   // 300 — x stride per column
const SLOT_H   = CARD_H + V_GAP;   // 316 — y stride per slot in the outermost column
const HEADER_H = 40;

// ─── Phase metadata ───────────────────────────────────────────────────────────
/** Expected number of matches per wing (left OR right half) in each knockout phase. */
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

/** Phases that make up the bracket "wings" (excluding FINAL / TERCER). */
const WING_PHASE_CODES = ["TREINTAIDOSAVOS", "OCTAVOS", "CUARTOS", "SEMI"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slot {
  key:   string;
  match: PartidoPronostico | null;
  x:     number;   // left edge of the card
  y:     number;   // top edge of the card (within the content area, below the header)
  phase: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Collapse an array of centres to the midpoints of each consecutive pair. */
function halve(arr: number[]): number[] {
  const res: number[] = [];
  for (let i = 0; i < Math.floor(arr.length / 2); i++) {
    res.push((arr[2 * i] + arr[2 * i + 1]) / 2);
  }
  return res;
}

// ─── Layout builder ────────────────────────────────────────────────────────────
function buildLayout(matches: PartidoPronostico[]) {
  // Group matches by phase and sort chronologically within each phase
  const byPhase: Record<string, PartidoPronostico[]> = {};
  for (const m of matches) {
    const c = m.fase.codigo;
    if (!byPhase[c]) byPhase[c] = [];
    byPhase[c].push(m);
  }
  for (const arr of Object.values(byPhase)) {
    arr.sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime());
  }

  // Determine which wing phases actually have matches in the DB
  const wingPhases = WING_PHASE_CODES.filter(p => (byPhase[p]?.length ?? 0) > 0);
  const nCols = Math.max(wingPhases.length, 1);

  // Determine the base slot count (outermost phase per wing)
  const outerPhase    = wingPhases[0] ?? "SEMI";
  const outerPerWing  = PER_WING[outerPhase] ?? 1;

  // Compute vertical centres for each wing phase (symmetric — shared by both wings).
  // Phase 0 (outermost): outerPerWing slots at even SLOT_H spacing.
  // Each subsequent phase: midpoints of consecutive pairs from the previous phase.
  const centresByPhase: Record<string, number[]> = {};
  let cs = Array.from({ length: outerPerWing }, (_, i) => i * SLOT_H + CARD_H / 2);
  for (const p of wingPhases) {
    centresByPhase[p] = cs;
    cs = halve(cs);
  }
  // After the loop, the last stored value is the SF (innermost wing phase) centre,
  // which equals the Final's centre Y.
  const finalCentreY =
    wingPhases.length > 0
      ? centresByPhase[wingPhases[wingPhases.length - 1]][0]
      : CARD_H / 2;

  // Column x positions:
  //   Left wing:  col 0 (outermost) … col nCols-1 (innermost = SF-L)
  //   Final:      col nCols
  //   Right wing: col nCols+1 (innermost = SF-R) … col 2*nCols (outermost)
  const finalX     = nCols * COL_W;
  const totalWidth = (2 * nCols + 1) * COL_W - H_GAP;

  const slots: Slot[]   = [];
  const paths: string[] = [];   // SVG <path d="…" /> strings

  // ── Left wing ──────────────────────────────────────────────────────────────
  for (let pi = 0; pi < wingPhases.length; pi++) {
    const phase   = wingPhases[pi];
    const x       = pi * COL_W;
    const phArr   = byPhase[phase] ?? [];
    const nExp    = PER_WING[phase] ?? 1;
    const centres = centresByPhase[phase];

    for (let i = 0; i < nExp; i++) {
      slots.push({
        key:   `L-${phase}-${i}`,
        match: phArr[i] ?? null,
        x,
        y:     centres[i] - CARD_H / 2,
        phase,
      });
    }

    const xR   = x + CARD_W;        // right edge of this column's cards
    const xMid = xR + H_GAP / 2;    // midpoint between this and the next column

    if (pi < wingPhases.length - 1) {
      // Connect each pair of matches to the single match in the next (inner) phase.
      // Draws a "]" bracket at xMid then a horizontal connector to the next column.
      const nextC = centresByPhase[wingPhases[pi + 1]];
      const xNext = (pi + 1) * COL_W;
      for (let i = 0; i < nextC.length; i++) {
        const c1 = centres[2 * i];
        const c2 = centres[2 * i + 1];
        const cp = nextC[i];
        paths.push(`M ${xR} ${c1} H ${xMid} V ${c2} H ${xR}`);
        paths.push(`M ${xMid} ${cp} H ${xNext}`);
      }
    } else {
      // SF-L → Final: simple horizontal line (H_GAP wide)
      paths.push(`M ${xR} ${finalCentreY} H ${finalX}`);
    }
  }

  // ── Right wing ─────────────────────────────────────────────────────────────
  // Mirrored: outermost phase at the far right, innermost adjacent to Final.
  // colFromCtr = distance (in columns) from the Final column.
  for (let pi = 0; pi < wingPhases.length; pi++) {
    const phase      = wingPhases[pi];
    const colFromCtr = wingPhases.length - pi;   // nCols … 1
    const x          = finalX + colFromCtr * COL_W;
    const phArr      = byPhase[phase] ?? [];
    const nExp       = PER_WING[phase] ?? 1;
    const centres    = centresByPhase[phase];

    // Right wing takes the second half of each phase's match array
    for (let i = 0; i < nExp; i++) {
      slots.push({
        key:   `R-${phase}-${i}`,
        match: phArr[nExp + i] ?? null,
        x,
        y:     centres[i] - CARD_H / 2,
        phase,
      });
    }

    const xL   = x;               // left edge of this column's cards
    const xMid = xL - H_GAP / 2;  // midpoint to the LEFT of this column

    if (pi < wingPhases.length - 1) {
      // Connect each pair to the single match in the next (inner) phase.
      // Draws a "[" bracket at xMid then a horizontal connector to the inner column.
      const nextC  = centresByPhase[wingPhases[pi + 1]];
      const xInner = finalX + (colFromCtr - 1) * COL_W;
      for (let i = 0; i < nextC.length; i++) {
        const c1 = centres[2 * i];
        const c2 = centres[2 * i + 1];
        const cp = nextC[i];
        paths.push(`M ${xL} ${c1} H ${xMid} V ${c2} H ${xL}`);
        paths.push(`M ${xMid} ${cp} H ${xInner + CARD_W}`);
      }
    } else {
      // SF-R → Final: simple horizontal line (H_GAP wide)
      paths.push(`M ${xL} ${finalCentreY} H ${finalX + CARD_W}`);
    }
  }

  // ── Final & 3rd place ───────────────────────────────────────────────────────
  const fin      = byPhase["FINAL"]?.[0]  ?? null;
  const ter      = byPhase["TERCER"]?.[0] ?? null;
  const finalTop = finalCentreY - CARD_H / 2;
  const thirdTop = finalTop + CARD_H + 56;

  slots.push({ key: "final", match: fin, x: finalX, y: finalTop,  phase: "FINAL"  });
  if (wingPhases.includes("SEMI")) {
    slots.push({ key: "third", match: ter, x: finalX, y: thirdTop, phase: "TERCER" });
  }

  // ── Column headers ──────────────────────────────────────────────────────────
  const headers: { label: string; x: number; isFinal: boolean }[] = [
    ...wingPhases.map((p, pi) => ({ label: PHASE_LABEL[p], x: pi * COL_W,                                  isFinal: false })),
    { label: "Final",  x: finalX,                                                                          isFinal: true  },
    ...wingPhases.map((p, pi) => ({ label: PHASE_LABEL[p], x: finalX + (wingPhases.length - pi) * COL_W,  isFinal: false })),
  ];

  // ── Total height ────────────────────────────────────────────────────────────
  const outerColH  = outerPerWing * SLOT_H;
  const finalColH  = thirdTop + CARD_H + V_GAP;
  const totalHeight = Math.max(outerColH, finalColH);

  return { slots, paths, totalWidth, totalHeight, headers };
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface KnockoutTreeProps {
  matches: PartidoPronostico[];
}

export default function KnockoutTree({ matches }: KnockoutTreeProps) {
  const layout = useMemo(() => buildLayout(matches), [matches]);

  return (
    <div className="w-full rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50">
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "82vh" }}>
        <div
          className="relative"
          style={{ width: layout.totalWidth, height: layout.totalHeight + HEADER_H }}
        >
          {/* ── Phase column headers ─────────────────────────────────────────── */}
          <div
            className="absolute z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm"
            style={{ top: 0, left: 0, width: layout.totalWidth, height: HEADER_H }}
          >
            {layout.headers.map((h, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center text-[11px] font-semibold uppercase tracking-wide"
                style={{ left: h.x, width: CARD_W, height: HEADER_H }}
              >
                {h.isFinal ? (
                  <span className="text-rose-500">{h.label}</span>
                ) : (
                  <span className="text-slate-400">{h.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* ── SVG connector lines + Match cards ────────────────────────────── */}
          <div
            className="absolute"
            style={{ top: HEADER_H, left: 0, width: layout.totalWidth, height: layout.totalHeight }}
          >
            <svg
              className="absolute inset-0 pointer-events-none"
              width={layout.totalWidth}
              height={layout.totalHeight}
            >
              {layout.paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>

            {layout.slots.map((slot) => (
              <div
                key={slot.key}
                className="absolute"
                style={{ left: slot.x, top: slot.y, width: CARD_W }}
              >
                {slot.match ? (
                  <MatchCard match={slot.match} />
                ) : (
                  <div
                    className="rounded-2xl border border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-1 text-slate-400"
                    style={{ height: CARD_H }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {PHASE_LABEL[slot.phase]}
                    </span>
                    <span className="text-xs">TBD</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
