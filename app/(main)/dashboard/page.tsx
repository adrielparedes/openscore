import { auth } from "@/lib/auth";
import { getStandings } from "@/actions/standings";
import { getRankingForUsuario } from "@/actions/ranking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, TrendingUp, Target, Percent } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id);
  const nombre = (session.user as any)?.nombre ?? session.user.name;
  const roles = (session.user as any)?.roles ?? [];
  const isAdmin = roles.includes("ADMIN");

  const [myRanking, standings] = await Promise.all([
    getRankingForUsuario(userId),
    getStandings(),
  ]);

  const grupos = [...new Set(standings.map((s) => s.grupo?.codigo).filter(Boolean))];

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your stats and group standings</p>
        </div>
        {isAdmin && (
          <Badge variant="warning">Admin</Badge>
        )}
      </div>

      {/* My stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {myRanking ? `#${myRanking.ranking}` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Your rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {myRanking?.puntos ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">Total points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {myRanking ? `${myRanking.aciertos}/${myRanking.totalPronosticos}` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Correct picks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Percent className="h-6 w-6 text-violet-700 dark:text-violet-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {myRanking ? `${myRanking.accuracy}%` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Standings */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Group Standings</h2>
        {grupos.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-6 text-sm">
                Standings will appear once group stage matches are played.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grupos.map((grupoCodigo) => {
              const grupoStandings = standings
                .filter((s) => s.grupo?.codigo === grupoCodigo)
                .sort((a, b) => b.puntos - a.puntos || b.diferenciaGol - a.diferenciaGol);

              const grupoNombre = grupoCodigo?.replace("GRUPO_", "Group ") ?? "";

              return (
                <Card key={grupoCodigo}>
                  <CardHeader>
                    <CardTitle>{grupoNombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-muted-foreground border-b border-border">
                          <th className="pb-2 text-left font-medium">Team</th>
                          <th className="pb-2 text-center font-medium">P</th>
                          <th className="pb-2 text-center font-medium">W</th>
                          <th className="pb-2 text-center font-medium">D</th>
                          <th className="pb-2 text-center font-medium">L</th>
                          <th className="pb-2 text-center font-medium">GD</th>
                          <th className="pb-2 text-right font-medium">Pts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {grupoStandings.map((s, i) => (
                          <tr key={s.id} className="hover:bg-accent/50 transition-colors">
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                {i < 2 && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                )}
                                <span className={`font-medium ${i < 2 ? "text-foreground" : "text-muted-foreground"}`}>
                                  {s.equipo.nombre}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 text-center text-muted-foreground">{s.partidos}</td>
                            <td className="py-2 text-center text-muted-foreground">{s.ganados}</td>
                            <td className="py-2 text-center text-muted-foreground">{s.empatados}</td>
                            <td className="py-2 text-center text-muted-foreground">{s.perdidos}</td>
                            <td className="py-2 text-center text-muted-foreground">
                              {s.diferenciaGol > 0 ? `+${s.diferenciaGol}` : s.diferenciaGol}
                            </td>
                            <td className="py-2 text-right font-bold text-primary">{s.puntos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
