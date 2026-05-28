"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const GROUPS = [
  "GRUPO_A", "GRUPO_B", "GRUPO_C", "GRUPO_D",
  "GRUPO_E", "GRUPO_F", "GRUPO_G", "GRUPO_H",
  "GRUPO_I", "GRUPO_J", "GRUPO_K", "GRUPO_L",
];
const FASES = [
  { codigo: "TREINTAIDOSAVOS", label: "Round of 32" },
  { codigo: "OCTAVOS", label: "Round of 16" },
  { codigo: "CUARTOS", label: "Quarter-finals" },
  { codigo: "SEMI", label: "Semi-finals" },
  { codigo: "TERCER", label: "3rd Place" },
  { codigo: "FINAL", label: "Final" },
];

interface ForecastFiltersProps {
  fechas: number[];
}

export default function ForecastFilters({ fechas }: ForecastFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const active = {
    grupo: params.get("grupo"),
    fase: params.get("fase"),
    fecha: params.get("fecha"),
  };

  function navigate(key: string, value: string | null) {
    const p = new URLSearchParams();
    if (value) p.set(key, value);
    router.push(`/forecast?${p.toString()}`);
  }

  const btnClass = (selected: boolean) =>
    cn(
      "px-3 py-1.5 text-xs rounded-lg font-medium transition-colors",
      selected
        ? "bg-rose-600 text-white"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    );

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* Today / All */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => navigate("fase", null)}
          className={btnClass(!active.grupo && !active.fase && !active.fecha)}
        >
          All matches
        </button>
        {fechas.map((f) => (
          <button
            key={f}
            onClick={() => navigate("fecha", String(f))}
            className={btnClass(active.fecha === String(f))}
          >
            Round {f}
          </button>
        ))}
      </div>

      {/* Groups */}
      <div className="flex gap-2 flex-wrap">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => navigate("grupo", active.grupo === g ? null : g)}
            className={btnClass(active.grupo === g)}
          >
            {g.replace("GRUPO_", "Group ")}
          </button>
        ))}
      </div>

      {/* Knockout */}
      <div className="flex gap-2 flex-wrap">
        {FASES.map(({ codigo, label }) => (
          <button
            key={codigo}
            onClick={() => navigate("fase", active.fase === codigo ? null : codigo)}
            className={btnClass(active.fase === codigo)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
