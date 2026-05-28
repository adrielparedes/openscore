"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import KnockoutMatchNode, {
  type KnockoutMatchNodeType,
  type BracketSide,
} from "./KnockoutMatchNode";
import KnockoutPlaceholderNode, {
  type KnockoutPlaceholderNodeType,
} from "./KnockoutPlaceholderNode";
import type { PartidoPronostico } from "@/types";

// ─── Bracket template ─────────────────────────────────────────────────────────
// Left half (slots 0-7 of R32), right half (slots 8-15). Subsequent rounds are
// derived from bracket pairing order. Each entry: [local label, visitante label].
const TEMPLATE_R32_L: [string, string][] = [
  ["1st A", "2nd B"],
  ["1st C", "2nd D"],
  ["1st B", "2nd A"],
  ["1st D", "2nd C"],
  ["1st E", "2nd F"],
  ["1st G", "2nd H"],
  ["1st F", "2nd E"],
  ["1st H", "2nd G"],
];
const TEMPLATE_R32_R: [string, string][] = [
  ["1st I", "2nd J"],
  ["1st K", "2nd L"],
  ["1st J", "2nd I"],
  ["1st L", "2nd K"],
  ["Best 3rd (1)", "Best 3rd (2)"],
  ["Best 3rd (3)", "Best 3rd (4)"],
  ["Best 3rd (5)", "Best 3rd (6)"],
  ["Best 3rd (7)", "Best 3rd (8)"],
];
const TEMPLATE_R16_L: [string, string][] = [
  ["W R32 M1", "W R32 M2"],
  ["W R32 M3", "W R32 M4"],
  ["W R32 M5", "W R32 M6"],
  ["W R32 M7", "W R32 M8"],
];
const TEMPLATE_R16_R: [string, string][] = [
  ["W R32 M9",  "W R32 M10"],
  ["W R32 M11", "W R32 M12"],
  ["W R32 M13", "W R32 M14"],
  ["W R32 M15", "W R32 M16"],
];
const TEMPLATE_QF_L: [string, string][] = [
  ["W R16 M1", "W R16 M2"],
  ["W R16 M3", "W R16 M4"],
];
const TEMPLATE_QF_R: [string, string][] = [
  ["W R16 M5", "W R16 M6"],
  ["W R16 M7", "W R16 M8"],
];
const TEMPLATE_SF_L: [string, string][] = [["W QF1", "W QF2"]];
const TEMPLATE_SF_R: [string, string][] = [["W QF3", "W QF4"]];
const TEMPLATE_FINAL: [string, string][]  = [["W SF1", "W SF2"]];
const TEMPLATE_TERCER: [string, string][] = [["Loser SF1", "Loser SF2"]];

const PHASE_LABEL: Record<string, string> = {
  TREINTAIDOSAVOS: "Round of 32",
  OCTAVOS:         "Round of 16",
  CUARTOS:         "Quarter-finals",
  SEMI:            "Semi-finals",
  TERCER:          "3rd Place",
  FINAL:           "Final",
};

// ─── Layout constants ─────────────────────────────────────────────────────────
const NODE_W   = 260;
const NODE_H   = 154;
const COL_GAP  = 80;
const ROW_GAP  = 24;
const STRIDE_X = NODE_W + COL_GAP;   // 340
const STRIDE_Y = NODE_H + ROW_GAP;   // 178

// 9 columns: L-R32, L-R16, L-QF, L-SF, CENTER, R-SF, R-QF, R-R16, R-R32
const COL = {
  R32_L: 0 * STRIDE_X,
  R16_L: 1 * STRIDE_X,
  QF_L:  2 * STRIDE_X,
  SF_L:  3 * STRIDE_X,
  CTR:   4 * STRIDE_X,
  SF_R:  5 * STRIDE_X,
  QF_R:  6 * STRIDE_X,
  R16_R: 7 * STRIDE_X,
  R32_R: 8 * STRIDE_X,
};

// Y positions for one half (8 R32 slots).
// Same Y values are reused symmetrically for the right half.
const R32_YS = Array.from({ length: 8 }, (_, i) => i * STRIDE_Y);
const R16_YS = [0, 1, 2, 3].map((i) => (R32_YS[i * 2] + R32_YS[i * 2 + 1]) / 2);
const QF_YS  = [0, 1].map((i) => (R16_YS[i * 2] + R16_YS[i * 2 + 1]) / 2);
const SF_Y   = (QF_YS[0] + QF_YS[1]) / 2;
const FINAL_Y  = SF_Y;
const TERCER_Y = FINAL_Y + NODE_H + 56;

// ─── Node factory helpers ─────────────────────────────────────────────────────
function realNode(
  id: string,
  x: number,
  y: number,
  match: PartidoPronostico,
  side: BracketSide,
): KnockoutMatchNodeType {
  return {
    id,
    type: "knockoutMatch",
    position: { x, y },
    data: { match, side },
    draggable: false,
    selectable: false,
  };
}

function placeholderNode(
  id: string,
  x: number,
  y: number,
  local: string,
  visitante: string,
  fase: string,
  matchLabel: string,
  side: BracketSide,
): KnockoutPlaceholderNodeType {
  return {
    id,
    type: "knockoutPlaceholder",
    position: { x, y },
    data: { local, visitante, fase, matchLabel, side },
    draggable: false,
    selectable: false,
  };
}

function makeSlot(
  id: string,
  x: number,
  y: number,
  realMatch: PartidoPronostico | undefined,
  template: [string, string],
  faseCodigo: string,
  matchLabel: string,
  side: BracketSide,
): Node {
  if (realMatch) return realNode(id, x, y, realMatch, side);
  const [local, visitante] = template;
  return placeholderNode(id, x, y, local, visitante, PHASE_LABEL[faseCodigo] ?? faseCodigo, matchLabel, side);
}

// ─── Edge factory ─────────────────────────────────────────────────────────────
function bracketEdge(sourceId: string, targetId: string, targetHandle = "tl"): Edge {
  return {
    id: `e-${sourceId}->${targetId}`,
    source: sourceId,
    sourceHandle: "src",
    target: targetId,
    targetHandle,
    type: "smoothstep",
    style: { stroke: "#cbd5e1", strokeWidth: 1.5 },
    animated: false,
  };
}

// ─── Build graph ──────────────────────────────────────────────────────────────
function buildBracket(matches: PartidoPronostico[]): {
  nodes: Node[];
  edges: Edge[];
} {
  // Sort all real matches by date and group by phase
  const byPhase = new Map<string, PartidoPronostico[]>();
  for (const m of matches) {
    const c = m.fase.codigo;
    if (!byPhase.has(c)) byPhase.set(c, []);
    byPhase.get(c)!.push(m);
  }
  byPhase.forEach((arr) =>
    arr.sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime())
  );

  const r32 = byPhase.get("TREINTAIDOSAVOS") ?? [];
  const r16 = byPhase.get("OCTAVOS")         ?? [];
  const qf  = byPhase.get("CUARTOS")         ?? [];
  const sf  = byPhase.get("SEMI")            ?? [];
  const fin = byPhase.get("FINAL")           ?? [];
  const ter = byPhase.get("TERCER")          ?? [];

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // ── Left half ──
  TEMPLATE_R32_L.forEach(([l, v], i) => {
    nodes.push(makeSlot(`R32L-${i}`, COL.R32_L, R32_YS[i], r32[i],     [l,v], "TREINTAIDOSAVOS", `M${i+1}`,   "left"));
  });
  TEMPLATE_R16_L.forEach(([l, v], i) => {
    nodes.push(makeSlot(`R16L-${i}`, COL.R16_L, R16_YS[i], r16[i],     [l,v], "OCTAVOS",         `M${i+1}`,   "left"));
  });
  TEMPLATE_QF_L.forEach(([l, v], i) => {
    nodes.push(makeSlot(`QFL-${i}`,  COL.QF_L,  QF_YS[i],  qf[i],      [l,v], "CUARTOS",         `QF${i+1}`,  "left"));
  });
  TEMPLATE_SF_L.forEach(([l, v]) => {
    nodes.push(makeSlot(`SFL-0`,     COL.SF_L,  SF_Y,       sf[0],      [l,v], "SEMI",            "SF1",       "left"));
  });

  // ── Right half ──
  TEMPLATE_R32_R.forEach(([l, v], i) => {
    nodes.push(makeSlot(`R32R-${i}`, COL.R32_R, R32_YS[i], r32[8+i],   [l,v], "TREINTAIDOSAVOS", `M${9+i}`,   "right"));
  });
  TEMPLATE_R16_R.forEach(([l, v], i) => {
    nodes.push(makeSlot(`R16R-${i}`, COL.R16_R, R16_YS[i], r16[4+i],   [l,v], "OCTAVOS",         `M${5+i}`,   "right"));
  });
  TEMPLATE_QF_R.forEach(([l, v], i) => {
    nodes.push(makeSlot(`QFR-${i}`,  COL.QF_R,  QF_YS[i],  qf[2+i],    [l,v], "CUARTOS",         `QF${3+i}`,  "right"));
  });
  TEMPLATE_SF_R.forEach(([l, v]) => {
    nodes.push(makeSlot(`SFR-0`,     COL.SF_R,  SF_Y,       sf[1],      [l,v], "SEMI",            "SF2",       "right"));
  });

  // ── Center ──
  TEMPLATE_FINAL.forEach(([l, v]) => {
    nodes.push(makeSlot(`FINAL-0`,   COL.CTR,   FINAL_Y,    fin[0],     [l,v], "FINAL",           "Final",     "center"));
  });
  TEMPLATE_TERCER.forEach(([l, v]) => {
    nodes.push(makeSlot(`TERCER-0`,  COL.CTR,   TERCER_Y,   ter[0],     [l,v], "TERCER",          "3rd Place", "center"));
  });

  // ── Edges: left half (left→right) ──
  for (let i = 0; i < 8; i++) edges.push(bracketEdge(`R32L-${i}`, `R16L-${Math.floor(i/2)}`, "tl"));
  for (let i = 0; i < 4; i++) edges.push(bracketEdge(`R16L-${i}`, `QFL-${Math.floor(i/2)}`, "tl"));
  for (let i = 0; i < 2; i++) edges.push(bracketEdge(`QFL-${i}`,  `SFL-0`, "tl"));
  edges.push(bracketEdge("SFL-0", "FINAL-0", "tl"));

  // ── Edges: right half (right→left, source exits LEFT) ──
  for (let i = 0; i < 8; i++) edges.push(bracketEdge(`R32R-${i}`, `R16R-${Math.floor(i/2)}`, "tr"));
  for (let i = 0; i < 4; i++) edges.push(bracketEdge(`R16R-${i}`, `QFR-${Math.floor(i/2)}`, "tr"));
  for (let i = 0; i < 2; i++) edges.push(bracketEdge(`QFR-${i}`,  `SFR-0`, "tr"));
  edges.push(bracketEdge("SFR-0", "FINAL-0", "tr"));

  return { nodes, edges };
}

// ─── Column headers ────────────────────────────────────────────────────────────
const HEADERS = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Final",
  "Semi-finals",
  "Quarter-finals",
  "Round of 16",
  "Round of 32",
];

function PhaseHeaders() {
  return (
    <div className="flex select-none border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      {HEADERS.map((label, i) => (
        <div
          key={i}
          className={`text-center text-[11px] font-semibold uppercase tracking-wide py-2 flex-shrink-0
            ${label === "Final" ? "text-rose-500" : "text-slate-400"}`}
          style={{ width: NODE_W, marginRight: i < HEADERS.length - 1 ? COL_GAP : 0 }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
const nodeTypes = {
  knockoutMatch:       KnockoutMatchNode,
  knockoutPlaceholder: KnockoutPlaceholderNode,
};

interface KnockoutBracketProps {
  matches: PartidoPronostico[];
}

export default function KnockoutBracket({ matches }: KnockoutBracketProps) {
  const { nodes, edges } = useMemo(() => buildBracket(matches), [matches]);

  const bracketKey = matches
    .map((m) =>
      `${m.id}:${m.pronostico?.local ? "L" : ""}${m.pronostico?.empate ? "D" : ""}${m.pronostico?.visitante ? "V" : ""}:${m.status}`
    )
    .join("|");

  return (
    <div className="w-full rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-slate-50 flex flex-col">
      {/* Scrollable column headers */}
      <div className="overflow-x-auto px-4 pt-3">
        <PhaseHeaders />
      </div>

      {/* React Flow canvas */}
      <div style={{ height: "75vh", minHeight: 500 }}>
        <ReactFlow
          key={bracketKey}
          defaultNodes={nodes}
          defaultEdges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.06}
          maxZoom={1.5}
          panOnScroll
          panOnDrag
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: false }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => n.type === "knockoutPlaceholder" ? "#f1f5f9" : "#fff1f2"}
            nodeStrokeColor="#cbd5e1"
            nodeStrokeWidth={2}
            pannable
            zoomable
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
