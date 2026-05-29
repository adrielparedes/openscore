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
      "px-4 py-2 text-xs rounded-2xl font-medium",
      selected
        ? "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white shadow-md shadow-pink-500/20 border border-white/20 transition-all duration-200"
        : "bg-white/70 backdrop-blur-md text-zinc-500 border border-zinc-200/60 hover:bg-white hover:text-zinc-800 transition-all"
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

        {/* Knockout bracket */}
        <button
          onClick={navigateBracket}
          className={cn(
            "px-4 py-2 text-xs rounded-2xl font-medium flex items-center gap-1.5",
            isBracket
              ? "bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white shadow-md shadow-pink-500/20 border border-white/20 transition-all duration-200"
              : "bg-white/70 backdrop-blur-md text-zinc-500 border border-zinc-200/60 hover:bg-white hover:text-zinc-800 transition-all"
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
