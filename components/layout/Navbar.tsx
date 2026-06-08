"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import OpenScoreLogo from "@/components/ui/OpenScoreLogo";
import { useSession } from "next-auth/react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { useLayout } from "@/components/providers/LayoutProvider";
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
  Shield,
  ChevronDown,
  Table,
  PanelLeft,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/forecast", label: "Predictions", icon: TrendingUp },
  { href: "/standings", label: "Standings", icon: Table },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/rules", label: "Rules", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toggle } = useLayout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const isAdmin = ((session?.user as any)?.roles ?? []).includes("ADMIN");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <OpenScoreLogo variant="light" className="h-10 w-auto" />
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
              <div ref={adminRef} className="relative">
                <button
                  onClick={() => setAdminOpen((o) => !o)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-150",
                    pathname.startsWith("/admin")
                      ? "bg-gradient-to-r from-rh/40 to-rh/15 text-rh/80"
                      : "text-rh/60 hover:text-rh/80 hover:bg-rh/15"
                  )}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-150", adminOpen && "rotate-180")} />
                </button>
                {adminOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/[0.08] bg-slate-950 shadow-xl py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <Link
                      href="/admin/results"
                      onClick={() => setAdminOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                        pathname === "/admin/results"
                          ? "text-rh/80 bg-rh/10"
                          : "text-white/50 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <ClipboardList className="h-3.5 w-3.5" />
                      Results
                    </Link>
                    <Link
                      href="/admin/usuarios"
                      onClick={() => setAdminOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                        pathname === "/admin/usuarios"
                          ? "text-rh/80 bg-rh/10"
                          : "text-white/50 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Users className="h-3.5 w-3.5" />
                      Users
                    </Link>
                    <Link
                      href="/admin/phases"
                      onClick={() => setAdminOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                        pathname === "/admin/phases"
                          ? "text-rh/80 bg-rh/10"
                          : "text-white/50 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Phases
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User + logout */}
          <div className="hidden md:flex items-center gap-0.5">
            <button
              onClick={toggle}
              title="Switch to sidebar layout"
              className="flex items-center gap-1.5 rounded-full p-2 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </button>
            {status === "loading" && (
              <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" />
            )}
            {status === "authenticated" && session && (
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
        <div className="md:hidden border-t border-white/[0.08] bg-slate-950 px-4 pb-4 pt-2 space-y-0.5">
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
              <div className="mt-2 mb-1 flex items-center gap-2 px-4 pt-2 border-t border-white/[0.06]">
                <Shield className="h-3.5 w-3.5 text-rh/50" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-rh/50">Admin</span>
              </div>
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
              <Link
                href="/admin/phases"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                  pathname === "/admin/phases"
                    ? "bg-gradient-to-r from-rh/40 to-rh/15 text-rh/80"
                    : "text-rh/60 hover:text-rh/80 hover:bg-rh/15"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Phases
              </Link>
            </>
          )}
          <div className="mt-2 pt-2 border-t border-white/[0.06]">
            <button
              onClick={() => { toggle(); setMobileOpen(false); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
            >
              <PanelLeft className="h-4 w-4" />
              Sidebar layout
            </button>
          </div>
          {status === "authenticated" && session && (
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
