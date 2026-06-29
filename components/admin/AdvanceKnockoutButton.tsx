"use client";

import { useTransition, useState } from "react";
import { advanceKnockoutWinners } from "@/actions/advancement";
import { Swords } from "lucide-react";

export default function AdvanceKnockoutButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await advanceKnockoutWinners();
        setMessage(
          result.updated > 0
            ? `Advanced knockout winners: ${result.updated} match(es) updated.`
            : "No knockout matches to update (no finished matches or already advanced)."
        );
      } catch {
        setMessage("Failed to advance knockout winners.");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
      >
        <Swords
          className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
        />
        <span>{isPending ? "Advancing…" : "Advance Knockout Winners"}</span>
      </button>
      {message && (
        <span
          className={`text-xs font-medium ${message.includes("Failed") ? "text-red-500" : "text-emerald-600"}`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
