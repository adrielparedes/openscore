import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const PHASES = [
  { name: "Group Stage", codigo: "GRUPO", points: 1, description: "Pick the winner of each group match" },
  { name: "Round of 32", codigo: "TREINTAIDOSAVOS", points: 2, description: "First knockout round, double points" },
  { name: "Round of 16", codigo: "OCTAVOS", points: 3, description: "Triple points" },
  { name: "Quarter-finals", codigo: "CUARTOS", points: 4, description: "Quadruple points" },
  { name: "Semi-finals", codigo: "SEMI", points: 5, description: "Five times the points" },
  { name: "3rd Place", codigo: "TERCER", points: 6, description: "Bronze match — same as the Final!" },
  { name: "Final", codigo: "FINAL", points: 6, description: "Maximum points — 6x!" },
];

export default function RulesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rules</h1>
        <p className="text-slate-500 text-sm mt-1">How Openscore works.</p>
      </div>

      {/* Participation & Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle>Participation &amp; Eligibility</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-3 text-sm text-slate-600">
            <li>To participate, you must be registered.</li>
            <li>
              Only Red Hat associates from Argentina, Chile, Peru, Colombia/CEACA and Mexico can win
              prizes/rewards, using their corporate e-mail address (only one Red Hat e-mail account
              per person).
            </li>
            <li>
              Remote employees can participate but only if they are located in Latin America, linked
              to a Red Hat office.
            </li>
            <li>
              Contractors with a Red Hat e-mail address can participate but are not allowed to
              receive rewards.
            </li>
            <li>
              Participants may register any time during the World Cup and until the day before the
              final match. Points will be awarded only for the matches for which predictions were
              entered; consequently, <strong className="text-slate-900">0 (ZERO)</strong> points
              will be awarded for matches with no predictions entered.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Prizes & Winners */}
      <Card>
        <CardHeader>
          <CardTitle>Prizes &amp; Winners</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-3 text-sm text-slate-600">
            <li>
              There will be one winner in each Red Hat office:{" "}
              <strong className="text-slate-900">1 (ONE)</strong> winner in Argentina,{" "}
              <strong className="text-slate-900">1 (ONE)</strong> winner in Brazil,{" "}
              <strong className="text-slate-900">1 (ONE)</strong> winner in Chile,{" "}
              <strong className="text-slate-900">1 (ONE)</strong> winner in Colombia/CEACA,{" "}
              <strong className="text-slate-900">1 (ONE)</strong> winner in Peru, and{" "}
              <strong className="text-slate-900">1 (ONE)</strong> winner in Mexico.
            </li>
            <li>
              In the case of a tie in the first place of each sub-region, a random drawing will
              take place to determine the winner.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Making Predictions — full width */}
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

      {/* Two-column layout: Scoring System | Penalty Shootouts + Leaderboard */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column: Scoring System */}
        <div className="flex-1">
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
        </div>

        {/* Right column: Penalty Shootouts + Leaderboard */}
        <div className="flex-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Knockout Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                For predictions from the <strong className="text-slate-900">Round of 32</strong>{" "}
                onwards, the 90 minutes of the match plus the additional time, if any, and
                penalties will be taken into account.
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
    </div>
  );
}
