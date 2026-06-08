import { auth } from "@/lib/auth";
import { getAnalytics } from "@/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { redirect } from "next/navigation";
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

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const analytics = await getAnalytics();

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform overview — users, predictions, and match progress.
        </p>
      </div>

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
