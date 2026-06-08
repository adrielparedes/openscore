"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { buildAdminUsuariosUrl, parseAdminUsuariosSearchParams } from "@/lib/adminUsuariosUrl";
import { cn } from "@/lib/utils";

interface AdminUsuariosPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);

  return pages;
}

export default function AdminUsuariosPagination({
  total,
  page,
  pageSize,
  totalPages,
}: AdminUsuariosPaginationProps) {
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

  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const visiblePages = getVisiblePages(page, totalPages);

  function goToPage(nextPage: number) {
    router.push(buildAdminUsuariosUrl(current, { page: nextPage }));
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
      <p className="text-sm text-muted-foreground text-center sm:text-left">
        Showing <span className="font-medium text-foreground">{start}</span>
        {" – "}
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> users
      </p>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {visiblePages.map((p, i) =>
              p === "ellipsis" ? (
                <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                  className={cn(
                    "min-w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                    p === page
                      ? "bg-gradient-to-br from-rh to-rose-700 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
