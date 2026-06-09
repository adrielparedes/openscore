import { getPronosticos, getKnockoutPronosticos, getUpcomingPronosticos } from "@/actions/pronosticos";
import MatchCard from "@/components/forecast/MatchCard";
import UpcomingDateGroups from "@/components/forecast/UpcomingDateGroups";
import ForecastFilters from "@/components/forecast/ForecastFilters";
import KnockoutTree from "@/components/forecast/KnockoutTree";
import { BracketProvider } from "@/components/forecast/BracketContext";
import { Suspense } from "react";
import type { PartidoPronostico } from "@/types";

interface ForecastPageProps {
  searchParams: Promise<{ grupo?: string; fase?: string; fecha?: string; view?: string; filter?: string }>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatUpcomingDate(date: Date): string {
  return `${DAYS[date.getUTCDay()]}, ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

const PHASE_ORDER = [
  "GRUPO",
  "TREINTAIDOSAVOS",
  "OCTAVOS",
  "CUARTOS",
  "SEMI",
  "TERCER",
  "FINAL",
];

function groupByFase(matches: PartidoPronostico[]) {
  const map = new Map<string, { nombre: string; matches: PartidoPronostico[] }>();
  for (const match of matches) {
    const key = match.fase.codigo;
    if (!map.has(key)) map.set(key, { nombre: match.fase.nombre, matches: [] });
    map.get(key)!.matches.push(match);
  }
  return [...map.entries()]
    .sort(([a], [b]) => {
      const ai = PHASE_ORDER.indexOf(a);
      const bi = PHASE_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .map(([, value]) => value);
}

async function MatchList({
  searchParams,
}: {
  searchParams: { grupo?: string; fase?: string; fecha?: string; filter?: string };
}) {
  const isAllMatches = !searchParams.grupo && !searchParams.fase && !searchParams.fecha;

  let matches = await getPronosticos({
    grupo: searchParams.grupo,
    fase: searchParams.fase,
    fecha: searchParams.fecha ? parseInt(searchParams.fecha) : undefined,
  });

  if (searchParams.filter === "not-predicted") {
    matches = matches.filter((m) => !m.pronostico && m.status === "PENDING");
  }

  if (matches.length === 0) {
    const emptyMessage = searchParams.filter === "not-predicted"
      ? "You're all caught up! Every match has a prediction."
      : "No matches found for the selected filter.";
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  if (isAllMatches) {
    const groups = groupByFase(matches);
    return (
      <div className="flex flex-col gap-8">
        {searchParams.filter === "not-predicted" && (
          <p className="text-sm text-muted-foreground">
            Showing {matches.length} match{matches.length !== 1 ? "es" : ""} still waiting for your prediction.
          </p>
        )}
        {groups.map((group) => (
          <div key={group.nombre}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {group.nombre}
              </h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">{group.matches.length} matches</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {group.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

async function UpcomingMatchList({ filter }: { filter?: string }) {
  const { today, nextDay, nextDayDate } = await getUpcomingPronosticos();

  const notPredicted = filter === "not-predicted";
  const filteredToday = notPredicted ? today.filter((m) => !m.pronostico && m.status === "PENDING") : today;
  const filteredNextDay = notPredicted ? nextDay.filter((m) => !m.pronostico && m.status === "PENDING") : nextDay;

  const hasToday = filteredToday.length > 0;
  const hasNextDay = filteredNextDay.length > 0;

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

  const total = filteredToday.length + filteredNextDay.length;
  const description = notPredicted
    ? `Showing ${total} upcoming match${total !== 1 ? "es" : ""} still waiting for your prediction.`
    : hasToday && hasNextDay
    ? `Showing today's ${filteredToday.length} match${filteredToday.length !== 1 ? "es" : ""} and the next ${filteredNextDay.length} upcoming.`
    : hasToday
    ? `Showing all of today's ${filteredToday.length} match${filteredToday.length !== 1 ? "es" : ""}.`
    : `No matches today — showing the next ${filteredNextDay.length} upcoming match${filteredNextDay.length !== 1 ? "es" : ""}.`;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">{description}</p>

      {hasToday && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Today</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">{filteredToday.length} match{filteredToday.length !== 1 ? "es" : ""}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredToday.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {hasNextDay && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {nextDayDate ? `From ${formatUpcomingDate(nextDayDate)}` : "Upcoming"}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">{filteredNextDay.length} match{filteredNextDay.length !== 1 ? "es" : ""}</span>
          </div>
          <UpcomingDateGroups matches={filteredNextDay} />
        </div>
      )}
    </div>
  );
}

async function KnockoutBracketSection() {
  const matches = await getKnockoutPronosticos();
  return <KnockoutTree matches={matches} />;
}

export default async function ForecastPage({ searchParams }: ForecastPageProps) {
  const params = await searchParams;
  const isBracket = params.view === "bracket";
  const isUpcoming = !params.grupo && !params.fase && !params.fecha && !params.view;

  const matchGridFallback = (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  );

  return (
    <BracketProvider>
      <div className="flex flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-6 pt-8 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Predictions</h1>
            <p className="text-muted-foreground text-sm mt-1">Select your prediction for each match. Picks lock 15 minutes before kickoff.</p>
          </div>
          <ForecastFilters />
        </div>

        {isBracket ? (
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
            <Suspense
              fallback={
                <div className="w-full rounded-xl border border-border bg-muted animate-pulse" style={{ height: "75vh", minHeight: 500 }} />
              }
            >
              <KnockoutBracketSection />
            </Suspense>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
            {isUpcoming ? (
              <Suspense fallback={matchGridFallback}>
                <UpcomingMatchList filter={params.filter} />
              </Suspense>
            ) : (
              <Suspense fallback={matchGridFallback}>
                <MatchList searchParams={params} />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </BracketProvider>
  );
}
