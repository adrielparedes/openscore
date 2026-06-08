"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  "": "Home",
  forecast: "Predictions",
  standings: "Standings",
  leaderboard: "Leaderboard",
  rules: "Rules",
  profile: "Profile",
  dashboard: "Dashboard",
  admin: "Admin",
  results: "Results",
  usuarios: "Users",
  phases: "Phases",
};

function getLabel(segment: string): string {
  return LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return (
      <nav aria-label="Breadcrumb" className="px-4 pt-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 text-sm text-slate-500">
          <li className="flex items-center gap-1">
            <Home className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">Home</span>
          </li>
        </ol>
      </nav>
    );
  }

  const crumbs = segments.map((seg, i) => ({
    label: getLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <nav aria-label="Breadcrumb" className="px-4 pt-4 sm:px-6 lg:px-8">
      <ol className="flex items-center gap-1.5 text-sm text-slate-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-400 transition-colors hover:text-slate-700"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              {isLast ? (
                <span className="font-medium text-slate-700">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-slate-700"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
