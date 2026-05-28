import { getPronosticos } from "@/actions/pronosticos";
import { getFechas } from "@/actions/partidos";
import MatchCard from "@/components/forecast/MatchCard";
import ForecastFilters from "@/components/forecast/ForecastFilters";
import { Suspense } from "react";

interface ForecastPageProps {
  searchParams: Promise<{ grupo?: string; fase?: string; fecha?: string }>;
}

async function MatchList({
  searchParams,
}: {
  searchParams: { grupo?: string; fase?: string; fecha?: string };
}) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

export default async function ForecastPage({ searchParams }: ForecastPageProps) {
  const params = await searchParams;
  const fechas = await getFechas();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Forecast</h1>
        <p className="text-slate-500 text-sm mt-1">
          Select your prediction for each match. Picks lock 15 minutes before kickoff.
        </p>
      </div>

      <ForecastFilters fechas={fechas} />

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
    </div>
  );
}
