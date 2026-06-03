import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface FilterPillBaseProps {
  active?: boolean;
  children: ReactNode;
  className?: string;
}

interface FilterPillButtonProps extends FilterPillBaseProps {
  href?: never;
  onClick?: () => void;
}

interface FilterPillLinkProps extends FilterPillBaseProps {
  href: string;
  onClick?: never;
}

type FilterPillProps = FilterPillButtonProps | FilterPillLinkProps;

const pillClass = (active: boolean) =>
  cn(
    "px-4 py-2 text-xs rounded-2xl font-medium inline-flex items-center gap-1.5 transition-all duration-200",
    active
      ? "bg-gradient-to-br from-rh to-rose-700 text-white shadow-md shadow-rh/20 border border-white/20"
      : "bg-white/70 backdrop-blur-md text-zinc-500 border border-zinc-200/60 hover:bg-white hover:text-zinc-800"
  );

export default function FilterPill({ active = false, children, className, href, onClick }: FilterPillProps) {
  if (href !== undefined) {
    return (
      <Link href={href} className={cn(pillClass(active), className)}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(pillClass(active), className)}>
      {children}
    </button>
  );
}
