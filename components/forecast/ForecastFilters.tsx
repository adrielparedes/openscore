"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, LayoutGrid, Trophy } from "lucide-react";
import FilterPill from "@/components/ui/FilterPill";

const STAGES = [
  { code: "GRUPO", label: "Group Stage" },
  { code: "TREINTAIDOSAVOS", label: "Round of 32" },
  { code: "OCTAVOS", label: "Round of 16" },
  { code: "CUARTOS", label: "Quarter Finals" },
  { code: "SEMI", label: "Semi-Finals" },
  { code: "TERCER_FINAL", label: "Third Place & Final" },
];

export default function ForecastFilters() {
  const router = useRouter();
  const params = useSearchParams();

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
      {/* Top row: Upcoming / All / Bracket */}
      <div className="flex gap-2 flex-wrap items-center">
        <FilterPill
          active={isUpcoming}
          onClick={() => router.push("/forecast")}
        >
          <CalendarDays className="h-3 w-3" />
          Upcoming
        </FilterPill>

        <FilterPill
          active={isAll}
          onClick={() => navigate("view", "all")}
        >
          <LayoutGrid className="h-3 w-3" />
          All matches
        </FilterPill>

        {/* Knockout bracket — large screens only */}
        <div className="hidden lg:block">
          <FilterPill
            active={isBracket}
            onClick={() => router.push("/forecast?view=bracket")}
          >
            <Trophy className="h-3 w-3" />
            Knockout Bracket
          </FilterPill>
        </div>
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
