import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function LeaderboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Global standings based on prediction accuracy.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-muted animate-pulse" />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-[160px] aspect-[3/4] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-5 w-8 rounded bg-muted animate-pulse" />
                <div className="h-5 w-40 rounded bg-muted animate-pulse" />
                <div className="h-5 w-12 rounded bg-muted animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
