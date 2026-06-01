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
  UserCircle,
  Users,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/forecast", label: "Predictions", icon: TrendingUp },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/rules", label: "Rules", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = ((session?.user as any)?.roles ?? []).includes("ADMIN");

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rh flex items-center justify-center shadow-lg shadow-rh/50">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg tracking-tight select-none">
              <span className="font-light text-white/75">OPEN</span>
              <span className="font-black text-rh">SCORE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-150",
                  pathname === href
                    ? "bg-gradient-to-r from-rh/35 to-rh/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <>
                <Link
                  href="/admin/results"
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-150",
                    pathname === "/admin/results"
                      ? "bg-gradient-to-r from-rh/40 to-rh/15 text-rh/80"
                      : "text-rh/60 hover:text-rh/80 hover:bg-rh/15"
                  )}
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  Results
                </Link>
                <Link
                  href="/admin/usuarios"
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-150",
                    pathname === "/admin/usuarios"
                      ? "bg-gradient-to-r from-rh/40 to-rh/15 text-rh/80"
                      : "text-rh/60 hover:text-rh/80 hover:bg-rh/15"
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  Users
                </Link>
              </>
            )}
          </div>

          {/* User + logout */}
          <div className="hidden md:flex items-center gap-0.5">
            {session && (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                    pathname === "/profile"
                    ? "bg-gradient-to-r from-rh/35 to-rh/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                  )}
                >
                  <UserCircle className="h-3.5 w-3.5" />
                  {(session.user as any)?.nombre ?? session.user?.name}
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-xl px-4 pb-4 pt-2 space-y-0.5">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                pathname === href
                  ? "bg-gradient-to-r from-rh/35 to-rh/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <Link
                href="/admin/results"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                  pathname === "/admin/results"
                    ? "bg-gradient-to-r from-rh/40 to-rh/15 text-rh/80"
                    : "text-rh/60 hover:text-rh/80 hover:bg-rh/15"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                Results
              </Link>
              <Link
                href="/admin/usuarios"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                  pathname === "/admin/usuarios"
                    ? "bg-gradient-to-r from-rh/40 to-rh/15 text-rh/80"
                    : "text-rh/60 hover:text-rh/80 hover:bg-rh/15"
                )}
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
            </>
          )}
          {session && (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                  pathname === "/profile"
                  ? "bg-gradient-to-r from-rh/35 to-rh/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/10"
                )}
              >
                <UserCircle className="h-4 w-4" />
                Profile
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
