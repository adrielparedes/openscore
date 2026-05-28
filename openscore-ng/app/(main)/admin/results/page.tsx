import { auth } from "@/lib/auth";
import { getPartidos, getFechas } from "@/actions/partidos";
import ResultMatchCard from "@/components/admin/ResultMatchCard";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";

export default async function AdminResultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const [partidos, fechas] = await Promise.all([getPartidos(), getFechas()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <ClipboardList className="h-5 w-5 text-rose-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Match Results</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Enter or update scores for each match
          </p>
        </div>
      </div>

      {fechas.map((fecha) => {
        const fechaPartidos = partidos.filter((p) => p.fecha === fecha);
        if (fechaPartidos.length === 0) return null;

        const sampleDate = new Date(fechaPartidos[0].dia).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        return (
          <section key={fecha}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Matchday {fecha}
              </h2>
              <span className="text-xs text-slate-400">{sampleDate}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fechaPartidos.map((partido) => (
                <ResultMatchCard key={partido.id} match={partido} />
              ))}
            </div>
          </section>
        );
      })}

      {partidos.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400 text-sm">
          No matches found.
        </div>
      )}
    </div>
  );
}
