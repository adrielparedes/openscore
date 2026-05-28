import { getRanking } from "@/actions/ranking";
import { getPaises } from "@/actions/usuarios";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Trophy, Medal } from "lucide-react";
import type { Pais } from "@/types";

interface LeaderboardPageProps {
  searchParams: Promise<{ pais?: string }>;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-amber-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
  return <span className="text-sm font-bold text-slate-400 w-5 text-center">#{rank}</span>;
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const { pais } = await searchParams;
  const session = await auth();
  const myId = session?.user?.id ? parseInt(session.user.id) : null;

  const [ranking, paises] = await Promise.all([
    getRanking({ pais }),
    getPaises(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leaderboard</h1>
        <p className="text-slate-500 text-sm mt-1">Global standings based on prediction accuracy</p>
      </div>

      {/* Country filter */}
      <div className="flex gap-2 flex-wrap text-sm">
        <a
          href="/leaderboard"
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            !pais ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All countries
        </a>
        {(paises as Pais[]).map((p) => (
          <a
            key={p.codigo}
            href={`/leaderboard?pais=${p.codigo}`}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              pais === p.codigo
                ? "bg-rose-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p.nombre}
          </a>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pais ? `${pais.toUpperCase()} Rankings` : "Global Rankings"}</CardTitle>
        </CardHeader>
        <CardContent>
          {ranking.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No rankings yet. Be the first to make predictions!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left font-medium text-slate-500 w-12">Rank</th>
                    <th className="pb-3 text-left font-medium text-slate-500">Player</th>
                    <th className="pb-3 text-left font-medium text-slate-500 hidden sm:table-cell">Country</th>
                    <th className="pb-3 text-right font-medium text-slate-500">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ranking.map((entry) => {
                    const isMe = entry.usuario === myId;
                    return (
                      <tr
                        key={entry.usuario}
                        className={`transition-colors ${
                          isMe
                            ? "bg-rose-50 border-l-2 border-l-rose-500"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-3 pl-2">
                          <div className="flex items-center justify-center w-8">
                            <RankBadge rank={entry.ranking} />
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`font-medium ${isMe ? "text-rose-600" : "text-slate-700"}`}>
                            {entry.nombre}
                            {isMe && <span className="ml-2 text-xs text-rose-400">(you)</span>}
                          </span>
                        </td>
                        <td className="py-3 hidden sm:table-cell">
                          <Badge variant="muted">{entry.pais.toUpperCase()}</Badge>
                        </td>
                        <td className="py-3 text-right font-bold text-rose-600">
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
