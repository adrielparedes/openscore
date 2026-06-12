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
  ChevronDown,
  SlidersHorizontal,
  ImageIcon,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsed) return;
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed]);

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
            href="/admin/dashboard"
            onClick={onNavigate}
            title={collapsed ? "Analytics" : undefined}
            className={cn(
              "flex items-center rounded-lg transition-all duration-150",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/admin/dashboard"
                ? "text-rh/80 bg-rh/10"
                : "text-rh/50 hover:text-rh/80 hover:bg-rh/10"
            )}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && "Analytics"}
          </Link>
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
          <Link
            href="/admin/banners"
            onClick={onNavigate}
            title={collapsed ? "Banners" : undefined}
            className={cn(
              "flex items-center rounded-lg transition-all duration-150",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/admin/banners"
                ? "text-rh/80 bg-rh/10"
                : "text-rh/50 hover:text-rh/80 hover:bg-rh/10"
            )}
          >
            <ImageIcon className="h-4 w-4 shrink-0" />
            {!collapsed && "Banners"}
          </Link>
        </div>
      )}

      {/* User menu */}
      <div className={cn(
        "shrink-0 border-t border-white/[0.08] py-3 space-y-1",
        collapsed ? "px-2" : "px-3"
      )}>
        {status === "loading" && (
          <div className={cn("rounded-lg bg-white/10 animate-pulse", collapsed ? "h-9 w-9 mx-auto" : "h-9")} />
        )}
        {status === "authenticated" && session && (
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              title={collapsed ? ((session.user as any)?.nombre ?? session.user?.name ?? "Profile") : undefined}
              className={cn(
                "flex w-full items-center rounded-lg transition-all duration-150",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5 text-sm font-medium",
                profileOpen || pathname === "/profile"
                  ? "bg-gradient-to-r from-rh/30 to-rh/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.07]"
              )}
            >
              <UserCircle className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">
                    {(session.user as any)?.nombre ?? session.user?.name}
                  </span>
                  <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-150", profileOpen && "rotate-180")} />
                </>
              )}
            </button>

            {profileOpen && !collapsed && (
              <div className="mt-1 space-y-0.5 animate-in fade-in slide-in-from-bottom-1 duration-150">
                <Link
                  href="/profile"
                  onClick={() => { setProfileOpen(false); onNavigate?.(); }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    pathname === "/profile"
                      ? "bg-gradient-to-r from-rh/30 to-rh/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/[0.07]"
                  )}
                >
                  <UserCircle className="h-4 w-4 shrink-0" />
                  Profile
                </Link>
                <ThemeToggle collapsed={false} />
                <button
                  onClick={() => { onToggleLayout?.(); onNavigate?.(); setProfileOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                >
                  <PanelTop className="h-4 w-4 shrink-0" />
                  Navbar layout
                </button>
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                  >
                    <PanelLeftClose className="h-4 w-4 shrink-0" />
                    Collapse
                  </button>
                )}
                <div className="my-1 border-t border-white/[0.08]" />
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Logout
                  </button>
                </form>
              </div>
            )}

            {profileOpen && collapsed && (
              <div className="absolute left-full bottom-0 ml-2 w-48 rounded-xl border border-white/[0.08] bg-nav shadow-xl py-1.5 animate-in fade-in slide-in-from-left-1 duration-150">
                <Link
                  href="/profile"
                  onClick={() => { setProfileOpen(false); onNavigate?.(); }}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-all duration-150",
                    pathname === "/profile"
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  )}
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
                <ThemeToggle className="gap-2.5 px-4 py-2.5 text-sm font-medium rounded-none hover:bg-white/10" />
                <button
                  onClick={() => { onToggleLayout?.(); onNavigate?.(); setProfileOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
                >
                  <PanelTop className="h-4 w-4" />
                  Navbar layout
                </button>
                {onToggleCollapse && (
                  <button
                    onClick={() => { onToggleCollapse(); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                    Expand
                  </button>
                )}
                <div className="my-1.5 border-t border-white/[0.08]" />
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
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
          "hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:flex-col bg-nav border-r border-white/[0.08] transition-[width] duration-200",
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
      <div className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-white/[0.08] bg-nav px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center">
          <OpenScoreLogo variant="light" className="h-7 w-auto" />
        </Link>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-nav shadow-2xl animate-in slide-in-from-left duration-200">
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
