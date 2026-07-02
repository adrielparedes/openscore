"use client";

import type { PartidoPronostico } from "@/types";
import MatchCard from "./MatchCard";

interface Props {
  matches: PartidoPronostico[];
}

function localDateLabel(dia: Date | string): string {
  const d = new Date(dia);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function UpcomingDateGroups({ matches }: Props) {
  const groups: { label: string; items: PartidoPronostico[] }[] = [];

  for (const match of matches) {
    const label = localDateLabel(match.dia);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(match);
    } else {
      groups.push({ label, items: [match] });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, i) => (
        <div key={group.label}>
          {i > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{group.label}</h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">{group.items.length} match{group.items.length !== 1 ? "es" : ""}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {group.items.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
