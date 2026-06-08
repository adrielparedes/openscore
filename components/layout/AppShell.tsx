"use client";

import { useLayout } from "@/components/providers/LayoutProvider";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { mode, collapsed } = useLayout();

  if (mode === "navbar") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <Breadcrumb />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          Openscore © {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding-left] duration-200",
          collapsed ? "md:pl-16" : "md:pl-60"
        )}
      >
        <Breadcrumb />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          Openscore © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
