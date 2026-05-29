import { auth } from "@/lib/auth";
import { getRanking } from "@/actions/ranking";
import { getNextMatchPronostico } from "@/actions/pronosticos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { WorldCupCountdown } from "@/components/ui/WorldCupCountdown";
import NextMatchCard from "@/components/forecast/NextMatchCard";
import PaniniCardDisplay from "@/components/profile/PaniniCardDisplay";
import Link from "next/link";
import { Trophy, TrendingUp, Globe, ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  const nombre = (session?.user as any)?.nombre ?? session?.user?.name ?? "there";
  const [topRanking, nextMatch] = await Promise.all([
    getRanking({ size: 3 }),
    getNextMatchPronostico(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 to-slate-100 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center">
            <Trophy className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {nombre}! 👋</h1>
            <p className="text-slate-500 text-sm">Ready to predict today&apos;s matches?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <Link
            href="/forecast"
            className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 hover:bg-rose-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-rose-500" />
              <div>
                <div className="font-semibold text-slate-900">Make Predictions</div>
                <div className="text-xs text-slate-500">Forecast match results</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-rose-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-amber-500" />
              <div>
                <div className="font-semibold text-slate-900">Leaderboard</div>
                <div className="text-xs text-slate-500">See global rankings</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Countdown + Next Match */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorldCupCountdown />
        {nextMatch ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Next match
            </h2>
            <NextMatchCard match={nextMatch} />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-8 text-sm text-slate-400">
            No upcoming matches scheduled.
          </div>
        )}
      </div>

      {/* Panini Card CTA */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <span className="text-2xl">⚽</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">New — Free</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Create your own World Cup Panini card!</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload your photo, pick your country and stats — download your card in high resolution. Free, no sign-up needed.
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
          <a
            href="https://mundialhub.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors px-5 py-2.5 text-white font-semibold text-sm shadow-sm group"
          >
            Create mine
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <Link
            href="/profile"
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 transition-colors px-5 py-2.5 text-amber-700 font-semibold text-sm shadow-sm"
          >
            Upload to profile
          </Link>
        </div>
      </div>

      {/* Top 3 + How to play */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How to play</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
              <li>Go to <Link href="/forecast" className="text-rose-600 hover:underline">Forecast</Link> to see upcoming matches</li>
              <li>Pick <strong className="text-slate-900">Home</strong>, <strong className="text-slate-900">Draw</strong>, or <strong className="text-slate-900">Away</strong> for each match</li>
              <li>Predictions lock <strong className="text-slate-900">15 minutes</strong> before kickoff</li>
              <li>Earn points for each correct prediction — knockout stages are worth more!</li>
            </ol>
          </CardContent>
        </Card>

        {/* Top 3 leaderboard with panini cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top 3</CardTitle>
              <Link href="/leaderboard" className="text-xs text-rose-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {topRanking.length === 0 ? (
              <p className="text-sm text-slate-400">No rankings yet — be the first to predict!</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {topRanking.map((entry) => (
                  <PaniniCardDisplay
                    key={entry.usuario}
                    nombre={entry.nombre}
                    pais={entry.pais}
                    puntos={entry.puntos}
                    ranking={entry.ranking}
                    paniniCard={entry.paniniCard}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
