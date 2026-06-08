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
  Table,
  PanelTop,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/forecast", label: "Predictions", icon: TrendingUp },
  { href: "/standings", label: "Standings", icon: Table },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/rules", label: "Rules", icon: BookOpen },
];

function SidebarContent({
  collapsed,
  onNavigate,
  onToggleLayout,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleLayout?: () => void;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = ((session?.user as any)?.roles ?? []).includes("ADMIN");

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        "flex h-16 shrink-0 items-center border-b border-white/[0.08]",
        collapsed ? "justify-center px-2" : "px-4"
      )}>
        <Link href="/" onClick={onNavigate} className="flex items-center">
          <OpenScoreLogo variant="light" className={collapsed ? "h-8 w-8" : "h-8 w-auto"} />
        </Link>
      </div>

      {/* Nav links */}
      <nav className={cn("flex-1 overflow-y-auto py-4 space-y-1", collapsed ? "px-2" : "px-3")}>
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center rounded-lg transition-all duration-150",
              collapsed
                ? "justify-center p-2.5"
                : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === href
                ? "bg-gradient-to-r from-rh/30 to-rh/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/[0.07]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && label}
          </Link>
        ))}

      </nav>

      {/* Admin section */}
      {isAdmin && (
        <div className={cn(
          "shrink-0 border-t border-white/[0.08] py-3 space-y-1",
          collapsed ? "px-2" : "px-3"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rh/50">Admin</span>
            </div>
          )}
          <Link
            href="/admin/results"
            onClick={onNavigate}
            title={collapsed ? "Results" : undefined}
            className={cn(
              "flex items-center rounded-lg transition-all duration-150",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/admin/results"
                ? "text-rh/80 bg-rh/10"
                : "text-rh/50 hover:text-rh/80 hover:bg-rh/10"
            )}
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            {!collapsed && "Results"}
          </Link>
          <Link
            href="/admin/usuarios"
            onClick={onNavigate}
            title={collapsed ? "Users" : undefined}
            className={cn(
              "flex items-center rounded-lg transition-all duration-150",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/admin/usuarios"
                ? "text-rh/80 bg-rh/10"
                : "text-rh/50 hover:text-rh/80 hover:bg-rh/10"
            )}
          >
            <Users className="h-4 w-4 shrink-0" />
            {!collapsed && "Users"}
          </Link>
          <Link
            href="/admin/phases"
            onClick={onNavigate}
            title={collapsed ? "Phases" : undefined}
            className={cn(
              "flex items-center rounded-lg transition-all duration-150",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/admin/phases"
                ? "text-rh/80 bg-rh/10"
                : "text-rh/50 hover:text-rh/80 hover:bg-rh/10"
            )}
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" />
            {!collapsed && "Phases"}
          </Link>
        </div>
      )}

      {/* Bottom section */}
      <div className={cn(
        "shrink-0 border-t border-white/[0.08] py-3 space-y-1",
        collapsed ? "px-2" : "px-3"
      )}>
        {/* Collapse toggle (desktop only) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium"
            )}
          >
            {collapsed
              ? <PanelLeftOpen className="h-4 w-4 shrink-0" />
              : <PanelLeftClose className="h-4 w-4 shrink-0" />
            }
            {!collapsed && "Collapse"}
          </button>
        )}

        {/* Switch to navbar */}
        <button
          onClick={() => { onToggleLayout?.(); onNavigate?.(); }}
          title={collapsed ? "Navbar layout" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium"
          )}
        >
          <PanelTop className="h-4 w-4 shrink-0" />
          {!collapsed && "Navbar layout"}
        </button>

        {/* User */}
        {status === "loading" && (
          <div className={cn("rounded-lg bg-white/10 animate-pulse", collapsed ? "h-9 w-9 mx-auto" : "h-9")} />
        )}
        {status === "authenticated" && session && (
          <>
            <Link
              href="/profile"
              onClick={onNavigate}
              title={collapsed ? ((session.user as any)?.nombre ?? session.user?.name ?? "Profile") : undefined}
              className={cn(
                "flex items-center rounded-lg transition-all duration-150",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium",
                pathname === "/profile"
                  ? "bg-gradient-to-r from-rh/30 to-rh/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.07]"
              )}
            >
              <UserCircle className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="truncate">
                  {(session.user as any)?.nombre ?? session.user?.name}
                </span>
              )}
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                title={collapsed ? "Logout" : undefined}
                className={cn(
                  "flex w-full items-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium"
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && "Logout"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggle, collapsed, toggleCollapsed } = useLayout();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:flex-col bg-slate-950 border-r border-white/[0.08] transition-[width] duration-200",
          collapsed ? "md:w-16" : "md:w-60"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleLayout={toggle}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center">
          <OpenScoreLogo variant="dark" className="h-7 w-auto" />
        </Link>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-slate-950 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
              onToggleLayout={toggle}
            />
          </aside>
        </div>
      )}
    </>
  );
}
