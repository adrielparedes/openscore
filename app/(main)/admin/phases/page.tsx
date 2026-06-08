import { auth } from "@/lib/auth";
import { getFases } from "@/actions/fases";
import PhaseRow from "@/components/admin/PhaseRow";
import { redirect } from "next/navigation";

export default async function AdminPhasesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const fases = await getFases();

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Phase Scoring</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Adjust how many points each tournament phase awards for a correct prediction.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {fases.map((fase) => (
          <PhaseRow key={fase.id} fase={fase} />
        ))}
      </div>

      {fases.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
          No phases found.
        </div>
      )}
    </div>
  );
}
