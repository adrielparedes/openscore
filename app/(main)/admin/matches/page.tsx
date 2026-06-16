import { auth } from "@/lib/auth";
import { getPartidos, getGrupos } from "@/actions/partidos";
import { getFases } from "@/actions/fases";
import MatchEditCard from "@/components/admin/MatchEditCard";
import { redirect } from "next/navigation";

export default async function AdminMatchesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const [partidos, fases, grupos] = await Promise.all([
    getPartidos(),
    getFases(),
    getGrupos(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Matches</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update date, time, venue, phase, group, and matchday for each match.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {partidos.map((partido) => (
          <MatchEditCard
            key={partido.id}
            match={partido}
            fases={fases}
            grupos={grupos}
          />
        ))}
      </div>

      {partidos.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
          No matches found.
        </div>
      )}
    </div>
  );
}
