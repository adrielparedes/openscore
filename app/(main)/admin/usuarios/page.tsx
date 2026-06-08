import { auth } from "@/lib/auth";
import { getAllUsuarios } from "@/actions/usuarios";
import AdminResetPasswordCard from "@/components/admin/AdminResetPasswordCard";
import { redirect } from "next/navigation";

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const usuarios = await getAllUsuarios();

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-4 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">View, block, delete users and reset passwords.</p>
      </div>
        {usuarios.map((usuario) => (
          <AdminResetPasswordCard key={usuario.id} usuario={usuario} />
        ))}
        {usuarios.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
            No users found.
          </div>
        )}
    </div>
  );
}
