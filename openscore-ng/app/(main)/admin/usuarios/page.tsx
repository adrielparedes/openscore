import { auth } from "@/lib/auth";
import { getAllUsuarios } from "@/actions/usuarios";
import PageHero from "@/components/ui/PageHero";
import AdminResetPasswordCard from "@/components/admin/AdminResetPasswordCard";
import { redirect } from "next/navigation";

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const usuarios = await getAllUsuarios();

  return (
    <div className="flex flex-col">
      <PageHero
        title="User Management"
        description="View users and reset passwords when needed."
        emoji="👥"
      />
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-4 px-4 sm:px-6 lg:px-8 py-8">
        {usuarios.map((usuario) => (
          <AdminResetPasswordCard key={usuario.id} usuario={usuario} />
        ))}
        {usuarios.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400 text-sm">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
