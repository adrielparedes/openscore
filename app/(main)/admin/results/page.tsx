import { auth } from "@/lib/auth";
import { getPartidos, getEquipos } from "@/actions/partidos";
import ResultMatchCard from "@/components/admin/ResultMatchCard";
import { redirect } from "next/navigation";

export default async function AdminResultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const [partidos, equipos] = await Promise.all([getPartidos(), getEquipos()]);

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Match Results</h1>
        <p className="text-slate-500 text-sm mt-1">Enter or update scores for each match.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partidos.map((partido) => (
          <ResultMatchCard key={partido.id} match={partido} equipos={equipos} />
        ))}
      </div>

      {partidos.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400 text-sm">
          No matches found.
        </div>
      )}
    </div>
  );
}
