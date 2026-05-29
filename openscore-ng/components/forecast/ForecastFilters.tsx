"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Trophy } from "lucide-react";
import FilterPill from "@/components/ui/FilterPill";

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

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* Top row: All / Rounds / Bracket */}
      <div className="flex gap-2 flex-wrap items-center">
        <FilterPill
          active={!active.grupo && !active.fase && !active.fecha && !isBracket}
          onClick={() => navigate("fase", null)}
        >
          All matches
        </FilterPill>
        {fechas.map((f) => (
          <FilterPill
            key={f}
            active={!isBracket && active.fecha === String(f)}
            onClick={() => navigate("fecha", String(f))}
          >
            Round {f}
          </FilterPill>
        ))}

        {/* Knockout bracket */}
        <FilterPill
          active={isBracket}
          onClick={() => router.push("/forecast?view=bracket")}
        >
          <Trophy className="h-3 w-3" />
          Knockout Bracket
        </FilterPill>
      </div>

      {/* Groups — hidden when bracket view is active */}
      {!isBracket && (
        <div className="flex gap-2 flex-wrap">
          {GROUPS.map((g) => (
            <FilterPill
              key={g}
              active={active.grupo === g}
              onClick={() => navigate("grupo", active.grupo === g ? null : g)}
            >
              {g.replace("GRUPO_", "Group ")}
            </FilterPill>
          ))}
        </div>
      )}
    </div>
  );
}
