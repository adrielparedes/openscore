"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import FilterPill from "@/components/ui/FilterPill";
import Input from "@/components/ui/Input";
import {
  buildAdminUsuariosUrl,
  PAGE_SIZE_OPTIONS,
  parseAdminUsuariosSearchParams,
} from "@/lib/adminUsuariosUrl";

const ROLES = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "Regular user" },
] as const;

const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "deleted", label: "Deleted" },
] as const;

const selectClass =
  "rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent";

interface AdminUsuariosFiltersProps {
  paises: { codigo: string; nombre: string }[];
}

export default function AdminUsuariosFilters({ paises }: AdminUsuariosFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = parseAdminUsuariosSearchParams({
    q: searchParams.get("q") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    pais: searchParams.get("pais") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });

  const [searchValue, setSearchValue] = useState(current.q ?? "");

  useEffect(() => {
    setSearchValue(current.q ?? "");
  }, [current.q]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchValue.trim();
      const currentQ = current.q?.trim() ?? "";
      if (trimmed !== currentQ) {
        router.push(buildAdminUsuariosUrl(current, { q: trimmed || undefined, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, current, router]);

  function update(overrides: Parameters<typeof buildAdminUsuariosUrl>[1]) {
    router.push(buildAdminUsuariosUrl(current, { ...overrides, page: overrides?.page ?? 1 }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search by name or email…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
          aria-label="Search users"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <FilterPill
              key={role.value}
              active={current.role === role.value}
              onClick={() => update({ role: role.value })}
            >
              {role.label}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <FilterPill
              key={status.value}
              active={current.status === status.value}
              onClick={() => update({ status: status.value })}
            >
              {status.label}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Country</span>
            <select
              value={current.pais ?? ""}
              onChange={(e) => update({ pais: e.target.value || undefined })}
              className={selectClass}
            >
              <option value="">All countries</option>
              {paises.map((pais) => (
                <option key={pais.codigo} value={pais.codigo}>
                  {pais.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Per page</span>
            <select
              value={current.pageSize}
              onChange={(e) => update({ pageSize: parseInt(e.target.value, 10), page: 1 })}
              className={selectClass}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
