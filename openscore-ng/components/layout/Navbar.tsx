"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import {
  Home,
  TrendingUp,
  Trophy,
  BookOpen,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/forecast", label: "Forecast", icon: TrendingUp },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/rules", label: "Rules", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = ((session?.user as any)?.roles ?? []).includes("ADMIN");

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Openscore</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2",
                  pathname === href
                    ? "border-rose-500 text-rose-600"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/results"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2",
                  pathname.startsWith("/admin")
                    ? "border-rose-500 text-rose-600"
                    : "border-transparent text-rose-500 hover:text-rose-700 hover:border-rose-300"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                Results
              </Link>
            )}
          </div>

          {/* User + logout */}
          <div className="hidden md:flex items-center gap-3">
            {session && (
              <>
                <span className="text-sm text-slate-500">
                  {(session.user as any)?.nombre ?? session.user?.name}
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === href ? "bg-rose-50 text-rose-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/results"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-rose-50 text-rose-600"
                  : "text-rose-500 hover:text-rose-700"
              )}
            >
              <ClipboardList className="h-4 w-4" />
              Results
            </Link>
          )}
          {session && (
            <form action={logoutAction} className="mt-2">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-500 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          )}
        </div>
      )}
    </nav>
  );
}
