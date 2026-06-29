import { auth } from "@/lib/auth";
import { getPartidos, getEquipos } from "@/actions/partidos";
import AdminResultsList from "@/components/admin/AdminResultsList";
import ClearCacheButton from "@/components/admin/ClearCacheButton";
import AdvanceKnockoutButton from "@/components/admin/AdvanceKnockoutButton";
import { redirect } from "next/navigation";

export default async function AdminResultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const [partidos, equipos] = await Promise.all([getPartidos(), getEquipos()]);

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Match Results</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter or update scores for each match.</p>
        </div>
        <div className="flex items-center gap-3">
          <AdvanceKnockoutButton />
          <ClearCacheButton />
        </div>
      </div>

      <AdminResultsList partidos={partidos} equipos={equipos} />
    </div>
  );
}
