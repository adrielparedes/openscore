"use client";

import { useState, useTransition } from "react";
import { getAnalytics, type AnalyticsData } from "@/actions/analytics";
import { calculateStandings } from "@/actions/standings";
import { advanceGroupWinners, advanceKnockoutWinners } from "@/actions/advancement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import RegistrationChart from "@/components/admin/RegistrationChart";
import {
  Users,
  UserCheck,
  UserX,
  Trash2,
  Target,
  ClipboardCheck,
  Trophy,
  BarChart3,
  TrendingUp,
  Globe,
  RefreshCw,
  UserPlus,
  TableProperties,
  Network,
  Swords,
} from "lucide-react";

function StatCard({
  icon: Icon,
  value,
  label,
  iconClass,
  iconBg,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  iconClass: string;
  iconBg: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4 pt-1">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            <Icon className={`h-6 w-6 ${iconClass}`} />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-rh to-rh/60 transition-all"
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

export default function AdminDashboardContent({
  initialData,
}: {
  initialData: AnalyticsData;
}) {
  const [analytics, setAnalytics] = useState(initialData);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();
  const [isRecalculating, startRecalc] = useTransition();
  const [recalcMessage, setRecalcMessage] = useState<string | null>(null);
  const [isAdvancingGroups, startAdvanceGroups] = useTransition();
  const [isAdvancingKnockout, startAdvanceKnockout] = useTransition();
  const [advanceMessage, setAdvanceMessage] = useState<string | null>(null);

  function handleRefresh() {
    startTransition(async () => {
      try {
        const fresh = await getAnalytics();
        setAnalytics(fresh);
        setLastRefresh(new Date());
      } catch {
        // silently skip on error
      }
    });
  }

  function handleRecalcStandings() {
    setRecalcMessage(null);
    startRecalc(async () => {
      try {
        await calculateStandings();
        setRecalcMessage("Standings recalculated successfully.");
      } catch {
        setRecalcMessage("Failed to recalculate standings.");
      }
    });
  }

  function handleAdvanceGroups() {
    setAdvanceMessage(null);
    startAdvanceGroups(async () => {
      try {
        const result = await advanceGroupWinners();
        const skipped = result.details.find((d) => d.startsWith("Skipped"));
        if (result.updated > 0) {
          setAdvanceMessage(
            `Advanced group winners: ${result.updated} match(es) updated.${skipped ? ` ${skipped}` : ""}`
          );
        } else {
          setAdvanceMessage(
            skipped
              ? `No groups advanced. ${skipped}`
              : "No group matches to update (already advanced or standings incomplete)."
          );
        }
      } catch {
        setAdvanceMessage("Failed to advance group winners.");
      }
    });
  }

  function handleAdvanceKnockout() {
    setAdvanceMessage(null);
    startAdvanceKnockout(async () => {
      try {
        const result = await advanceKnockoutWinners();
        setAdvanceMessage(
          result.updated > 0
            ? `Advanced knockout winners: ${result.updated} match(es) updated.`
            : "No knockout matches to update (no finished matches or already advanced)."
        );
      } catch {
        setAdvanceMessage("Failed to advance knockout winners.");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform overview — users, predictions, and match progress.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button
            onClick={handleAdvanceGroups}
            disabled={isAdvancingGroups}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Network
              className={`h-3.5 w-3.5 ${isAdvancingGroups ? "animate-spin" : ""}`}
            />
            <span>{isAdvancingGroups ? "Advancing…" : "Advance Group Winners"}</span>
          </button>
          <button
            onClick={handleAdvanceKnockout}
            disabled={isAdvancingKnockout}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Swords
              className={`h-3.5 w-3.5 ${isAdvancingKnockout ? "animate-spin" : ""}`}
            />
            <span>{isAdvancingKnockout ? "Advancing…" : "Advance Knockout Winners"}</span>
          </button>
          <button
            onClick={handleRecalcStandings}
            disabled={isRecalculating}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            <TableProperties
              className={`h-3.5 w-3.5 ${isRecalculating ? "animate-spin" : ""}`}
            />
            <span>{isRecalculating ? "Recalculating…" : "Recalculate Standings"}</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <span>
            Updated {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {recalcMessage && (
        <div className={`rounded-md px-3 py-2 text-sm ${recalcMessage.includes("success") ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
          {recalcMessage}
        </div>
      )}

      {advanceMessage && (
        <div className={`rounded-md px-3 py-2 text-sm ${advanceMessage.includes("Failed") ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"}`}>
          {advanceMessage}
        </div>
      )}

      {/* User & prediction stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          value={analytics.users.total}
          label="Total registered"
          iconBg="bg-rose-100 dark:bg-rose-900/30"
          iconClass="text-primary"
        />
        <StatCard
          icon={UserCheck}
          value={analytics.users.active}
          label="Active users"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          iconClass="text-emerald-700 dark:text-emerald-400"
        />
        <StatCard
          icon={UserX}
          value={analytics.users.blocked}
          label="Blocked users"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          iconClass="text-amber-700 dark:text-amber-400"
        />
        <StatCard
          icon={Trash2}
          value={analytics.users.deleted}
          label="Deleted users"
          iconBg="bg-slate-100 dark:bg-slate-800/50"
          iconClass="text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          value={analytics.predictions.total.toLocaleString()}
          label="Predictions made"
          iconBg="bg-violet-100 dark:bg-violet-900/30"
          iconClass="text-violet-700 dark:text-violet-400"
        />
        <StatCard
          icon={TrendingUp}
          value={`${analytics.predictions.coveragePercent}%`}
          label="Prediction coverage"
          iconBg="bg-sky-100 dark:bg-sky-900/30"
          iconClass="text-sky-700 dark:text-sky-400"
        />
        <StatCard
          icon={ClipboardCheck}
          value={`${analytics.matchesProgress.withResults}/${analytics.matchesProgress.total}`}
          label="Matches with results"
          iconBg="bg-teal-100 dark:bg-teal-900/30"
          iconClass="text-teal-700 dark:text-teal-400"
        />
        <StatCard
          icon={Trophy}
          value={analytics.pointsDistribution.max}
          label="Top score"
          iconBg="bg-rose-100 dark:bg-rose-900/30"
          iconClass="text-primary"
        />
      </div>

      {/* Daily registrations bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            New Users per Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationChart
            days={analytics.dailyRegistrations.days}
            countries={analytics.dailyRegistrations.countries}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations by country */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Registrations by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.registrationsByCountry.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No registrations yet.
              </p>
            ) : (
              <ol className="space-y-3">
                {analytics.registrationsByCountry.map((entry, i) => {
                  const maxCount = analytics.registrationsByCountry[0].count;
                  const barPercent =
                    maxCount > 0 ? (entry.count / maxCount) * 100 : 0;
                  return (
                    <li key={entry.countryCode} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-foreground">
                          <span className="text-muted-foreground w-5 text-right text-xs">
                            {i + 1}.
                          </span>
                          {entry.countryName}
                          <span className="text-xs text-muted-foreground font-normal">
                            ({entry.countryCode})
                          </span>
                        </span>
                        <span className="font-semibold text-foreground tabular-nums">
                          {entry.count}
                        </span>
                      </div>
                      <ProgressBar percent={barPercent} />
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Points distribution & matches progress */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Points Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {analytics.pointsDistribution.average}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Average</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {analytics.pointsDistribution.median}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Median</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {analytics.pointsDistribution.max}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Maximum</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Matches Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {analytics.matchesProgress.percent}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {analytics.matchesProgress.withResults} of{" "}
                    {analytics.matchesProgress.total} matches have results
                  </div>
                </div>
              </div>
              <ProgressBar percent={analytics.matchesProgress.percent} />
              <p className="text-xs text-muted-foreground mt-3">
                {analytics.matchesProgress.total - analytics.matchesProgress.withResults}{" "}
                matches still awaiting results.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Overall Prediction Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {analytics.predictions.coveragePercent}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {analytics.predictions.total.toLocaleString()} of{" "}
                    {analytics.predictions.totalPossible.toLocaleString()} possible
                    predictions
                  </div>
                </div>
              </div>
              <ProgressBar percent={analytics.predictions.coveragePercent} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prediction coverage per match */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Coverage by Match</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.predictionsPerMatch.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              No matches found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="pb-2 text-left font-medium">Match</th>
                    <th className="pb-2 text-left font-medium">Phase</th>
                    <th className="pb-2 text-right font-medium">Predictions</th>
                    <th className="pb-2 text-right font-medium w-28">Coverage</th>
                    <th className="pb-2 pl-4 font-medium w-40 hidden sm:table-cell" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {analytics.predictionsPerMatch.map((match) => (
                    <tr
                      key={match.partidoId}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-2.5 font-medium text-foreground">
                        {match.label}
                      </td>
                      <td className="py-2.5 text-muted-foreground">{match.fase}</td>
                      <td className="py-2.5 text-right tabular-nums text-foreground">
                        {match.count}
                      </td>
                      <td className="py-2.5 text-right tabular-nums font-semibold text-primary">
                        {match.percentOfUsers}%
                      </td>
                      <td className="py-2.5 pl-4 hidden sm:table-cell">
                        <ProgressBar percent={match.percentOfUsers} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
