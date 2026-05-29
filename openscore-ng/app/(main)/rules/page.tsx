import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import PageHero from "@/components/ui/PageHero";

const PHASES = [
  { name: "Group Stage", codigo: "GRUPO", points: 1, description: "Pick the winner of each group match" },
  { name: "Round of 32", codigo: "TREINTAIDOSAVOS", points: 2, description: "First knockout round, double points" },
  { name: "Round of 16", codigo: "OCTAVOS", points: 3, description: "Triple points" },
  { name: "Quarter-finals", codigo: "CUARTOS", points: 4, description: "Quadruple points" },
  { name: "Semi-finals", codigo: "SEMI", points: 5, description: "Five times the points" },
  { name: "3rd Place", codigo: "TERCER", points: 5, description: "Bronze match" },
  { name: "Final", codigo: "FINAL", points: 6, description: "Maximum points — 6x!" },
];

export default function RulesPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Rules"
        description="How Openscore works."
        emoji="📋"
      />
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">

      <Card>
        <CardHeader>
          <CardTitle>Making Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-sm text-slate-600">
            <li>
              Navigate to <strong className="text-slate-900">Predictions</strong> to see all matches.
            </li>
            <li>
              For each match, select one of three outcomes:{" "}
              <strong className="text-slate-900">Home</strong> (left team wins),{" "}
              <strong className="text-slate-900">Draw</strong>, or{" "}
              <strong className="text-slate-900">Away</strong> (right team wins).
            </li>
            <li>
              Predictions can be changed at any time until the match is{" "}
              <strong className="text-slate-900">locked</strong>.
            </li>
            <li>
              Matches lock automatically{" "}
              <strong className="text-slate-900">15 minutes before kickoff</strong>. No changes
              after that.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">
            Points increase with the importance of the round:
          </p>
          <div className="space-y-2">
            {PHASES.map((phase) => (
              <div
                key={phase.codigo}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
              >
                <div>
                  <div className="font-medium text-slate-700">{phase.name}</div>
                  <div className="text-xs text-slate-400">{phase.description}</div>
                </div>
                <Badge variant={phase.points >= 4 ? "warning" : "default"}>
                  {phase.points} {phase.points === 1 ? "pt" : "pts"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Penalty Shootouts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            In knock-out stages, if a match goes to penalties, the winner is determined by the
            penalty shootout result — <strong className="text-slate-900">not</strong> by the score
            after extra time. Predict accordingly.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            The global leaderboard ranks all players by total points accumulated across all
            matches. You can also filter by country to see your regional standings.
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
