export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type AdminUsuariosUrlParams = {
  q?: string;
  role?: string;
  status?: string;
  pais?: string;
  page?: number;
  pageSize?: number;
};

export function parseAdminUsuariosSearchParams(searchParams: {
  q?: string;
  role?: string;
  status?: string;
  pais?: string;
  page?: string;
  pageSize?: string;
}): AdminUsuariosUrlParams & { page: number; pageSize: number } {
  const rawPageSize = parseInt(searchParams.pageSize ?? "", 10);
  const pageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize as (typeof PAGE_SIZE_OPTIONS)[number])
    ? rawPageSize
    : DEFAULT_PAGE_SIZE;
  const page = Math.max(parseInt(searchParams.page ?? "", 10) || 1, 1);

  return {
    q: searchParams.q,
    role: searchParams.role ?? "all",
    status: searchParams.status ?? "all",
    pais: searchParams.pais,
    page,
    pageSize,
  };
}

export function buildAdminUsuariosUrl(
  params: AdminUsuariosUrlParams,
  overrides?: Partial<AdminUsuariosUrlParams>
): string {
  const merged = { ...params, ...overrides };
  const sp = new URLSearchParams();

  if (merged.q?.trim()) sp.set("q", merged.q.trim());
  if (merged.role && merged.role !== "all") sp.set("role", merged.role);
  if (merged.status && merged.status !== "all") sp.set("status", merged.status);
  if (merged.pais) sp.set("pais", merged.pais);
  if (merged.page && merged.page > 1) sp.set("page", String(merged.page));
  if (merged.pageSize && merged.pageSize !== DEFAULT_PAGE_SIZE) {
    sp.set("pageSize", String(merged.pageSize));
  }

  const qs = sp.toString();
  return `/admin/usuarios${qs ? `?${qs}` : ""}`;
}
