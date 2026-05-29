import { auth } from "@/lib/auth";
import { getStandings } from "@/actions/standings";
import { getRankingForUsuario } from "@/actions/ranking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, TrendingUp, BarChart3 } from "lucide-react";
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
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Your stats and group standings</p>
        </div>
        {isAdmin && (
          <Badge variant="warning">Admin</Badge>
        )}
      </div>

      {/* My stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-1">
          <CardContent>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {myRanking ? `#${myRanking.ranking}` : "—"}
                </div>
                <div className="text-xs text-slate-400">Your rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-1">
          <CardContent>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {myRanking?.puntos ?? 0}
                </div>
                <div className="text-xs text-slate-400">Total points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-1">
          <CardContent>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{nombre}</div>
                <div className="text-xs text-slate-400">Logged in as</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Standings */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Group Standings</h2>
        {grupos.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-slate-400 text-center py-6 text-sm">
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
                        <tr className="text-slate-500 border-b border-slate-200">
                          <th className="pb-2 text-left font-medium">Team</th>
                          <th className="pb-2 text-center font-medium">P</th>
                          <th className="pb-2 text-center font-medium">W</th>
                          <th className="pb-2 text-center font-medium">D</th>
                          <th className="pb-2 text-center font-medium">L</th>
                          <th className="pb-2 text-center font-medium">GD</th>
                          <th className="pb-2 text-right font-medium">Pts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {grupoStandings.map((s, i) => (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                {i < 2 && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                )}
                                <span className={`font-medium ${i < 2 ? "text-slate-700" : "text-slate-500"}`}>
                                  {s.equipo.nombre}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 text-center text-slate-500">{s.partidos}</td>
                            <td className="py-2 text-center text-slate-500">{s.ganados}</td>
                            <td className="py-2 text-center text-slate-500">{s.empatados}</td>
                            <td className="py-2 text-center text-slate-500">{s.perdidos}</td>
                            <td className="py-2 text-center text-slate-500">
                              {s.diferenciaGol > 0 ? `+${s.diferenciaGol}` : s.diferenciaGol}
                            </td>
                            <td className="py-2 text-right font-bold text-rose-600">{s.puntos}</td>
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
