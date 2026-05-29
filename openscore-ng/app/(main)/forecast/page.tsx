import { getPronosticos, getKnockoutPronosticos } from "@/actions/pronosticos";
import { getFechas } from "@/actions/partidos";
import MatchCard from "@/components/forecast/MatchCard";
import ForecastFilters from "@/components/forecast/ForecastFilters";
import KnockoutTree from "@/components/forecast/KnockoutTree";
import { Suspense } from "react";
import type { PartidoPronostico } from "@/types";

interface ForecastPageProps {
  searchParams: Promise<{ grupo?: string; fase?: string; fecha?: string; view?: string }>;
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
  searchParams: { grupo?: string; fase?: string; fecha?: string };
}) {
  const isAllMatches = !searchParams.grupo && !searchParams.fase && !searchParams.fecha;

  const matches = await getPronosticos({
    grupo: searchParams.grupo,
    fase: searchParams.fase,
    fecha: searchParams.fecha ? parseInt(searchParams.fecha) : undefined,
  });

  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">No matches found for the selected filter.</p>
      </div>
    );
  }

  if (isAllMatches) {
    const groups = groupByFase(matches);
    return (
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <div key={group.nombre}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                {group.nombre}
              </h2>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">{group.matches.length} matches</span>
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

async function KnockoutBracketSection() {
  const matches = await getKnockoutPronosticos();
  return <KnockoutTree matches={matches} />;
}

export default async function ForecastPage({ searchParams }: ForecastPageProps) {
  const params = await searchParams;
  const fechas = await getFechas();
  const isBracket = params.view === "bracket";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Forecast</h1>
        <p className="text-slate-500 text-sm mt-1">
          Select your prediction for each match. Picks lock 15 minutes before kickoff.
        </p>
      </div>

      <ForecastFilters fechas={fechas} />

      {isBracket ? (
        <Suspense
          fallback={
            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 animate-pulse" style={{ height: "75vh", minHeight: 500 }} />
          }
        >
          <KnockoutBracketSection />
        </Suspense>
      ) : (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          }
        >
          <MatchList searchParams={params} />
        </Suspense>
      )}
    </div>
  );
}
