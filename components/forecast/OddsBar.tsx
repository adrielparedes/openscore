import type { MatchOdds } from "@/types";
import { cn } from "@/lib/utils";

interface OddsBarProps {
  odds: MatchOdds;
  showDraw: boolean;
}

export default function OddsBar({ odds, showDraw }: OddsBarProps) {
  if (odds.total === 0) return null;

  const pctLocal = Math.round((odds.local / odds.total) * 100);
  const pctEmpate = showDraw ? Math.round((odds.empate / odds.total) * 100) : 0;
  const pctVisitante = 100 - pctLocal - pctEmpate;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted">
        {pctLocal > 0 && (
          <div
            className="bg-blue-500 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${pctLocal}%` }}
          />
        )}
        {showDraw && pctEmpate > 0 && (
          <div
            className="bg-gray-400 dark:bg-gray-500 transition-all duration-300"
            style={{ width: `${pctEmpate}%` }}
          />
        )}
        {pctVisitante > 0 && (
          <div
            className="bg-amber-500 dark:bg-amber-400 transition-all duration-300"
            style={{ width: `${pctVisitante}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-[11px] font-medium text-muted-foreground tabular-nums">
        <span className={cn(pctLocal > 0 && "text-blue-600 dark:text-blue-400")}>
          {pctLocal}%
        </span>
        {showDraw && (
          <span className={cn(pctEmpate > 0 && "text-gray-500 dark:text-gray-400")}>
            {pctEmpate}%
          </span>
        )}
        <span className={cn(pctVisitante > 0 && "text-amber-600 dark:text-amber-400")}>
          {pctVisitante}%
        </span>
      </div>
    </div>
  );
}
