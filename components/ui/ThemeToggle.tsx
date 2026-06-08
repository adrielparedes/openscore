"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  collapsed?: boolean;
  className?: string;
}

export default function ThemeToggle({ collapsed = false, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={cn(
        "rounded-lg bg-white/10 animate-pulse",
        collapsed ? "h-9 w-9" : "h-9 w-full"
      )} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex items-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150",
        collapsed ? "justify-center p-2.5" : "w-full gap-3 px-3 py-2.5 text-sm font-medium",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 shrink-0" />
      )}
      {!collapsed && (isDark ? "Light mode" : "Dark mode")}
    </button>
  );
}
