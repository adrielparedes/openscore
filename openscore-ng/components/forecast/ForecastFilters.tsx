"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

const GROUPS = [
  "GRUPO_A", "GRUPO_B", "GRUPO_C", "GRUPO_D",
  "GRUPO_E", "GRUPO_F", "GRUPO_G", "GRUPO_H",
  "GRUPO_I", "GRUPO_J", "GRUPO_K", "GRUPO_L",
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
    view: params.get("view"),
  };

  const isBracket = active.view === "bracket";

  function navigate(key: string, value: string | null) {
    const p = new URLSearchParams();
    if (value) p.set(key, value);
    router.push(`/forecast?${p.toString()}`);
  }

  function navigateBracket() {
    router.push("/forecast?view=bracket");
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
      {/* Top row: All / Rounds / Bracket */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => navigate("fase", null)}
          className={btnClass(!active.grupo && !active.fase && !active.fecha && !isBracket)}
        >
          All matches
        </button>
        {fechas.map((f) => (
          <button
            key={f}
            onClick={() => navigate("fecha", String(f))}
            className={btnClass(!isBracket && active.fecha === String(f))}
          >
            Round {f}
          </button>
        ))}

        {/* Divider */}
        <span className="text-slate-300 select-none">|</span>

        {/* Knockout bracket */}
        <button
          onClick={navigateBracket}
          className={cn(
            "px-3 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5",
            isBracket
              ? "bg-rose-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <Trophy className="h-3 w-3" />
          Knockout Bracket
        </button>
      </div>

      {/* Groups — hidden when bracket view is active */}
      {!isBracket && (
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
      )}
    </div>
  );
}
