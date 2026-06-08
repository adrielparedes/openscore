import { auth } from "@/lib/auth";
import { getUsuarios, getPaises } from "@/actions/usuarios";
import AdminResetPasswordCard from "@/components/admin/AdminResetPasswordCard";
import AdminUsuariosFilters from "@/components/admin/AdminUsuariosFilters";
import AdminUsuariosPagination from "@/components/admin/AdminUsuariosPagination";
import { parseAdminUsuariosSearchParams } from "@/lib/adminUsuariosUrl";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface AdminUsuariosPageProps {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    pais?: string;
    page?: string;
    pageSize?: string;
  }>;
}

function FiltersFallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-10 rounded-lg bg-muted animate-pulse" />
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function AdminUsuariosPage({ searchParams }: AdminUsuariosPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const params = await searchParams;
  const filters = parseAdminUsuariosSearchParams(params);

  const [{ usuarios, total, page, pageSize, totalPages }, paises] = await Promise.all([
    getUsuarios({
      search: filters.q,
      role: filters.role,
      status: filters.status,
      pais: filters.pais,
      page: filters.page,
      pageSize: filters.pageSize,
    }),
    getPaises(),
  ]);

  const hasFilters =
    !!filters.q ||
    filters.role !== "all" ||
    filters.status !== "all" ||
    !!filters.pais;

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-4 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View, block, delete users and reset passwords.
        </p>
      </div>

      <Suspense fallback={<FiltersFallback />}>
        <AdminUsuariosFilters paises={paises.map((p) => ({ codigo: p.codigo, nombre: p.nombre }))} />
      </Suspense>

      {usuarios.map((usuario) => (
        <AdminResetPasswordCard key={usuario.id} usuario={usuario} />
      ))}

      {usuarios.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
          {hasFilters ? "No users match the current filters." : "No users found."}
        </div>
      )}

      <Suspense fallback={null}>
        <AdminUsuariosPagination
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}
