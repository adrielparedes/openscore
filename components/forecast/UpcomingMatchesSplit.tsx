"use client";

import type { PartidoPronostico } from "@/types";
import MatchCard from "./MatchCard";
import UpcomingDateGroups from "./UpcomingDateGroups";

interface Props {
  matches: PartidoPronostico[];
  filter?: string;
}

/**
 * Splits upcoming matches into "today" and "next day" groups using the
 * browser's local timezone so that late-evening matches aren't shown
 * under the wrong calendar date.
 */
export default function UpcomingMatchesSplit({ matches, filter }: Props) {
  const notPredicted = filter === "not-predicted";
  const filtered = notPredicted
    ? matches.filter((m) => !m.pronostico && m.status === "PENDING")
    : matches;

  const now = new Date();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const todayMatches = filtered.filter((m) => new Date(m.dia) < todayEnd);
  const afterToday = filtered.filter((m) => new Date(m.dia) >= todayEnd);
  const nextDayMatches = afterToday.slice(0, 6);

  const hasToday = todayMatches.length > 0;
  const hasNextDay = nextDayMatches.length > 0;

  if (!hasToday && !hasNextDay) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
        <p className="text-muted-foreground">
          {notPredicted
            ? "You're all caught up! Every upcoming match has a prediction."
            : "No upcoming matches scheduled."}
        </p>
      </div>
    );
  }

  const total = todayMatches.length + nextDayMatches.length;
  const description = notPredicted
    ? `Showing ${total} upcoming match${total !== 1 ? "es" : ""} still waiting for your prediction.`
    : hasToday && hasNextDay
    ? `Showing today's ${todayMatches.length} match${todayMatches.length !== 1 ? "es" : ""} and the next ${nextDayMatches.length} upcoming.`
    : hasToday
    ? `Showing all of today's ${todayMatches.length} match${todayMatches.length !== 1 ? "es" : ""}.`
    : `No matches today — showing the next ${nextDayMatches.length} upcoming match${nextDayMatches.length !== 1 ? "es" : ""}.`;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground" suppressHydrationWarning>
        {description}
      </p>

      {hasToday && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Today
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span
              className="text-xs text-muted-foreground font-medium"
              suppressHydrationWarning
            >
              {todayMatches.length} match{todayMatches.length !== 1 ? "es" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {todayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {hasNextDay && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2
              className="text-sm font-semibold text-foreground uppercase tracking-wider"
              suppressHydrationWarning
            >
              {new Date(nextDayMatches[0].dia).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span
              className="text-xs text-muted-foreground font-medium"
              suppressHydrationWarning
            >
              {nextDayMatches.length} match
              {nextDayMatches.length !== 1 ? "es" : ""}
            </span>
          </div>
          <UpcomingDateGroups matches={nextDayMatches} />
        </div>
      )}
    </div>
  );
}
