import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "muted" | "info";
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-emerald-900/30 text-emerald-400 border border-emerald-700/50",
    warning: "bg-amber-900/30 text-amber-400 border border-amber-700/50",
    danger: "bg-red-900/30 text-red-400 border border-red-700/50",
    muted: "bg-muted text-muted-foreground",
    info: "bg-blue-900/30 text-blue-400 border border-blue-700/50",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
