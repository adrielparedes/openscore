"use client";

import { useTransition } from "react";
import { invalidateAllCaches } from "@/actions/partidos";

export default function ClearCacheButton() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await invalidateAllCaches();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted disabled:opacity-50 transition-colors"
    >
      {pending ? "Clearing…" : "Clear Cache"}
    </button>
  );
}
