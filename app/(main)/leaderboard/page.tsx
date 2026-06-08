import { getRanking } from "@/actions/ranking";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import FilterPill from "@/components/ui/FilterPill";
import { Trophy, Medal } from "lucide-react";

const LEADERBOARD_PAISES = [
  { codigo: "ARG", nombre: "Argentina" },
  { codigo: "BRA", nombre: "Brazil" },
  { codigo: "CHL", nombre: "Chile" },
  { codigo: "COL", nombre: "Colombia" },
  { codigo: "MEX", nombre: "Mexico" },
  { codigo: "PER", nombre: "Peru" },
];

interface LeaderboardPageProps {
  searchParams: Promise<{ pais?: string }>;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-amber-700 dark:text-amber-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700 dark:text-amber-400" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">#{rank}</span>;
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const { pais } = await searchParams;
  const session = await auth();
  const myId = session?.user?.id ? parseInt(session.user.id) : null;

  const ranking = await getRanking({ pais });

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Global standings based on prediction accuracy.</p>
      </div>

      {/* Country filter */}
      <div className="flex gap-2 flex-wrap text-sm">
        <FilterPill href="/leaderboard" active={!pais}>
          All countries
        </FilterPill>
        {LEADERBOARD_PAISES.map((p) => (
          <FilterPill
            key={p.codigo}
            href={`/leaderboard?pais=${p.codigo}`}
            active={pais === p.codigo}
          >
            {p.nombre}
          </FilterPill>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pais ? `${pais.toUpperCase()} Rankings` : "Global Rankings"}</CardTitle>
        </CardHeader>
        <CardContent>
          {ranking.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No rankings yet. Be the first to make predictions!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-medium text-muted-foreground w-12">Rank</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Player</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Country</th>
                    <th className="pb-3 pr-2 text-right font-medium text-muted-foreground">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {ranking.map((entry) => {
                    const isMe = entry.usuario === myId;
                    return (
                      <tr
                        key={entry.usuario}
                        className={`transition-colors ${
                          isMe
                            ? "bg-rose-100 dark:bg-rose-900/20 border-l-2 border-l-rose-500"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <td className="py-3 pl-2">
                          <div className="flex items-center justify-center w-8">
                            <RankBadge rank={entry.ranking} />
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`font-medium ${isMe ? "text-primary" : "text-foreground"}`}>
                            {entry.nombre}
                            {isMe && <span className="ml-2 text-xs text-rose-700 dark:text-rose-400">(you)</span>}
                          </span>
                        </td>
                        <td className="py-3 hidden sm:table-cell">
                          <Badge variant="muted">{entry.pais.toUpperCase()}</Badge>
                        </td>
                        <td className="py-3 pr-2 text-right font-bold text-primary">
                          {entry.puntos} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
