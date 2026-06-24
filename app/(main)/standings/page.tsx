import { getStandings, getGroupsWithTeams } from "@/actions/standings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { flagUrl } from "@/lib/flags";
import type { StandingConRelaciones } from "@/types";
import type { Equipo } from "@prisma/client";

interface TeamRow {
  id: number;
  nombre: string;
  codigo: string;
  partidos: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  diferenciaGol: number;
  puntos: number;
  golesAFavor: number;
}

export default async function StandingsPage() {
  const [standings, groupsWithTeams] = await Promise.all([
    getStandings(),
    getGroupsWithTeams(),
  ]);

  const standingsByGroup = new Map<string, StandingConRelaciones[]>();
  for (const s of standings) {
    if (!s.grupo?.codigo) continue;
    const key = s.grupo.codigo;
    if (!standingsByGroup.has(key)) standingsByGroup.set(key, []);
    standingsByGroup.get(key)!.push(s);
  }

  const thirdPlaced: (TeamRow & { grupo: string })[] = [];
  for (const { grupo } of groupsWithTeams) {
    const groupStandings = standingsByGroup.get(grupo.codigo);
    if (!groupStandings) continue;
    const sorted = [...groupStandings].sort(
      (a, b) => b.puntos - a.puntos || b.diferenciaGol - a.diferenciaGol || b.golesAFavor - a.golesAFavor || b.ganados - a.ganados
    );
    if (sorted.length >= 3) {
      const s = sorted[2];
      thirdPlaced.push({
        id: s.equipo.id,
        nombre: s.equipo.nombre,
        codigo: s.equipo.codigo,
        partidos: s.partidos,
        ganados: s.ganados,
        empatados: s.empatados,
        perdidos: s.perdidos,
        diferenciaGol: s.diferenciaGol,
        puntos: s.puntos,
        golesAFavor: s.golesAFavor,
        grupo: grupo.codigo.replace("GRUPO_", "Group "),
      });
    }
  }

  thirdPlaced.sort(
    (a, b) => b.puntos - a.puntos || b.diferenciaGol - a.diferenciaGol || b.golesAFavor - a.golesAFavor || b.ganados - a.ganados
  );

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Group Standings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Group stage positions updated after each match.
        </p>
      </div>

      {groupsWithTeams.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-center py-10 text-sm">
              No groups have been configured yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupsWithTeams.map(({ grupo, teams }) => (
              <GroupTable
                key={grupo.codigo}
                grupoCodigo={grupo.codigo}
                standings={standingsByGroup.get(grupo.codigo) ?? null}
                teams={teams}
              />
            ))}
          </div>

          {thirdPlaced.length > 0 && (
            <BestThirdTable thirdPlaced={thirdPlaced} />
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Qualifies automatically (top 2)</span>
            </div>
            <div className="flex items-center gap-2 group relative cursor-help">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="underline decoration-dotted underline-offset-2">May qualify as best third (top 8 of 12)</span>
              <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-72 rounded-lg bg-nav px-3 py-2 text-xs text-white shadow-lg z-10">
                In the 2026 World Cup, the 8 best third-placed teams out of 12 groups also advance to the knockout stage. They are ranked by points, then goal difference, then wins.
                <div className="absolute top-full left-4 h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-nav" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GroupTable({
  grupoCodigo,
  standings,
  teams,
}: {
  grupoCodigo: string;
  standings: StandingConRelaciones[] | null;
  teams: Equipo[];
}) {
  const grupoNombre = grupoCodigo.replace("GRUPO_", "Group ");

  const rows: TeamRow[] = standings
    ? [...standings]
        .sort((a, b) => b.puntos - a.puntos || b.diferenciaGol - a.diferenciaGol || b.golesAFavor - a.golesAFavor || b.ganados - a.ganados)
        .map((s) => ({
          id: s.equipo.id,
          nombre: s.equipo.nombre,
          codigo: s.equipo.codigo,
          partidos: s.partidos,
          ganados: s.ganados,
          empatados: s.empatados,
          perdidos: s.perdidos,
          diferenciaGol: s.diferenciaGol,
          puntos: s.puntos,
          golesAFavor: s.golesAFavor,
        }))
    : teams.map((t) => ({
        id: t.id,
        nombre: t.nombre,
        codigo: t.codigo,
        partidos: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0,
        diferenciaGol: 0,
        puntos: 0,
        golesAFavor: 0,
      }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{grupoNombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 pl-3 text-left font-medium w-8">#</th>
                <th className="pb-2 text-left font-medium">Team</th>
                <th className="pb-2 text-center font-medium w-9">MP</th>
                <th className="pb-2 text-center font-medium w-9">W</th>
                <th className="pb-2 text-center font-medium w-9">D</th>
                <th className="pb-2 text-center font-medium w-9">L</th>
                <th className="pb-2 text-center font-medium w-9">GF</th>
                <th className="pb-2 text-center font-medium w-9">GD</th>
                <th className="pb-2 pr-3 text-right font-medium w-10">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rows.map((row, i) => {
                const qualifies = i < 2;
                const thirdPlace = i === 2;
                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      qualifies
                        ? "bg-emerald-100 dark:bg-emerald-900/15"
                        : thirdPlace
                          ? "bg-amber-100 dark:bg-amber-900/15"
                          : "hover:bg-accent/50"
                    }`}
                  >
                    <td className="py-2.5 pl-3 pr-2 text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        {qualifies && (
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                        {thirdPlace && (
                          <div className="h-2 w-2 rounded-full bg-amber-400" />
                        )}
                        {!qualifies && !thirdPlace && (
                          <div className="h-2 w-2 rounded-full bg-transparent" />
                        )}
                        {i + 1}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className={`font-medium flex items-center gap-2 ${qualifies ? "text-foreground" : "text-muted-foreground"}`}>
                        {flagUrl(row.codigo) && (
                          <img
                            src={flagUrl(row.codigo, 20)}
                            alt={row.codigo}
                            className="h-3.5 w-5 object-cover rounded-sm"
                          />
                        )}
                        {row.nombre}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.partidos}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.ganados}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.empatados}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.perdidos}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.golesAFavor}</td>
                    <td className="py-2.5 text-center text-muted-foreground">
                      <span className={
                        row.diferenciaGol > 0
                          ? "text-emerald-700 dark:text-emerald-400"
                          : row.diferenciaGol < 0
                            ? "text-red-700 dark:text-red-400"
                            : "text-muted-foreground"
                      }>
                        {row.diferenciaGol > 0 ? `+${row.diferenciaGol}` : row.diferenciaGol}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-bold text-primary">{row.puntos}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function BestThirdTable({ thirdPlaced }: { thirdPlaced: (TeamRow & { grupo: string })[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Third-Placed Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-xs mb-4">
          The 8 best third-placed teams (out of 12) qualify for the knockout stage.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 pl-3 text-left font-medium w-8">#</th>
                <th className="pb-2 text-left font-medium">Team</th>
                <th className="pb-2 text-left font-medium hidden sm:table-cell">Group</th>
                <th className="pb-2 text-center font-medium w-9">MP</th>
                <th className="pb-2 text-center font-medium w-9">W</th>
                <th className="pb-2 text-center font-medium w-9">D</th>
                <th className="pb-2 text-center font-medium w-9">L</th>
                <th className="pb-2 text-center font-medium w-9">GF</th>
                <th className="pb-2 text-center font-medium w-9">GD</th>
                <th className="pb-2 pr-3 text-right font-medium w-10">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {thirdPlaced.map((row, i) => {
                const qualifies = i < 8;
                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      qualifies ? "bg-amber-100 dark:bg-amber-900/15" : "hover:bg-accent/50"
                    }`}
                  >
                    <td className="py-2.5 pl-3 pr-2 text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        {qualifies && (
                          <div className="h-2 w-2 rounded-full bg-amber-400" />
                        )}
                        {!qualifies && (
                          <div className="h-2 w-2 rounded-full bg-transparent" />
                        )}
                        {i + 1}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className={`font-medium flex items-center gap-2 ${qualifies ? "text-foreground" : "text-muted-foreground"}`}>
                        {flagUrl(row.codigo) && (
                          <img
                            src={flagUrl(row.codigo, 20)}
                            alt={row.codigo}
                            className="h-3.5 w-5 object-cover rounded-sm"
                          />
                        )}
                        {row.nombre}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{row.grupo}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.partidos}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.ganados}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.empatados}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.perdidos}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{row.golesAFavor}</td>
                    <td className="py-2.5 text-center text-muted-foreground">
                      <span className={
                        row.diferenciaGol > 0
                          ? "text-emerald-700 dark:text-emerald-400"
                          : row.diferenciaGol < 0
                            ? "text-red-700 dark:text-red-400"
                            : "text-muted-foreground"
                      }>
                        {row.diferenciaGol > 0 ? `+${row.diferenciaGol}` : row.diferenciaGol}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-bold text-primary">{row.puntos}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
