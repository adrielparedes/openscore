"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Settings, Monitor, Smartphone } from "lucide-react";
import {
  updateForecastDefaults,
  type ForecastDefault,
} from "@/actions/settings";

const VIEW_OPTIONS: { value: ForecastDefault; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "all", label: "All matches" },
  { value: "bracket", label: "Knockout Bracket" },
];

const MOBILE_VIEW_OPTIONS: { value: ForecastDefault; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "all", label: "All matches" },
];

interface Props {
  initialDesktop: ForecastDefault;
  initialMobile: ForecastDefault;
}

export default function ForecastDefaultsCard({
  initialDesktop,
  initialMobile,
}: Props) {
  const [desktop, setDesktop] = useState(initialDesktop);
  const [mobile, setMobile] = useState(initialMobile);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const hasChanges = desktop !== initialDesktop || mobile !== initialMobile;

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateForecastDefaults(desktop, mobile);
        setMessage("Saved successfully.");
      } catch {
        setMessage("Failed to save settings.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Forecast Page Defaults
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which view users see when they first visit the predictions
          page.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              Desktop default
            </label>
            <select
              value={desktop}
              onChange={(e) => setDesktop(e.target.value as ForecastDefault)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {VIEW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              Mobile default
            </label>
            <select
              value={mobile}
              onChange={(e) => setMobile(e.target.value as ForecastDefault)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {MOBILE_VIEW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {message && (
          <div
            className={`mt-3 rounded-md px-3 py-2 text-sm ${
              message.includes("success")
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </CardContent>
    </Card>
  );
}
