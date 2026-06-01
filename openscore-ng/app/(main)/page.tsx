import { auth } from "@/lib/auth";
import { getRanking } from "@/actions/ranking";
import { getNextMatchPronostico } from "@/actions/pronosticos";
import { WorldCupCountdown } from "@/components/ui/WorldCupCountdown";
import NextMatchCard from "@/components/forecast/NextMatchCard";
import StickerCardDisplay from "@/components/profile/StickerCardDisplay";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Globe, ArrowRight, BookOpen } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  const nombre = (session?.user as any)?.nombre ?? session?.user?.name ?? "there";
  const [topRanking, nextMatch] = await Promise.all([
    getRanking({ size: 3 }),
    getNextMatchPronostico(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">

        {/* ── Emblem ──────────────────────────── col-span-1 */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex flex-col items-center justify-center gap-3">
          <Image
            src="/2026_FIFA_World_Cup_emblem.svg"
            alt="2026 FIFA World Cup"
            width={96}
            height={96}
            className="drop-shadow-lg"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 text-center">FIFA World Cup 2026</p>
        </div>

        {/* ── Welcome ─────────────────────────── col-span-1 */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 via-white to-slate-100 p-7 flex flex-col justify-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">Welcome back</p>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{nombre}!</h1>
          <p className="text-slate-500 text-sm">Ready to predict today&apos;s matches?</p>
        </section>

        {/* ── Countdown ───────────────────────── col-span-2, row-span-2 */}
        <div className="lg:col-span-2 lg:row-span-2 flex">
          <WorldCupCountdown className="flex-1" />
        </div>

        {/* ── Forecast CTA ────────────────────── col-span-1 */}
        <Link
          href="/forecast"
          className="group rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100/60 p-6 flex flex-col justify-between hover:border-rose-300 hover:shadow-sm transition-all"
        >
          <div className="h-10 w-10 rounded-xl bg-rose-600 flex items-center justify-center mb-4">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Predictions</div>
            <div className="text-xs text-slate-500 mt-0.5">Predict match results</div>
          </div>
          <ArrowRight className="h-4 w-4 text-rose-500 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* ── Leaderboard CTA ─────────────────── col-span-1 */}
        <Link
          href="/leaderboard"
          className="group rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-yellow-50/60 p-6 flex flex-col justify-between hover:border-amber-300 hover:shadow-sm transition-all"
        >
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Leaderboard</div>
            <div className="text-xs text-slate-500 mt-0.5">See global rankings</div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-500 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* ── Next Match ──────────────────────── col-span-2 */}
        <div className="lg:col-span-2">
          {nextMatch ? (
            <NextMatchCard match={nextMatch} />
          ) : (
            <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-8 text-sm text-slate-400">
              No upcoming matches scheduled.
            </div>
          )}
        </div>

        {/* ── Top 3 ───────────────────────────── col-span-2, row-span-2 */}
        <div className="lg:col-span-2 lg:row-span-2 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Top 3</h2>
            <Link href="/leaderboard" className="text-xs text-rose-500 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {topRanking.length === 0 ? (
            <p className="text-sm text-slate-400">No rankings yet — be the first to predict!</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 flex-1">
              {topRanking.map((entry) => (
                <StickerCardDisplay
                  key={entry.usuario}
                  nombre={entry.nombre}
                  pais={entry.pais}
                  puntos={entry.puntos}
                  ranking={entry.ranking}
                  stickerCard={entry.stickerCard}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── How to play ─────────────────────── col-span-1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <h2 className="font-bold text-slate-900">How to play</h2>
          </div>
          <ol className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center">1</span>
              <span>Go to <Link href="/forecast" className="text-rose-600 hover:underline">Predictions</Link> to see upcoming matches</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center">2</span>
              <span>Pick <strong className="text-slate-800">Home</strong>, <strong className="text-slate-800">Draw</strong>, or <strong className="text-slate-800">Away</strong></span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center">3</span>
              <span>Predictions lock <strong className="text-slate-800">15 min</strong> before kickoff</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center">4</span>
              <span>Knockout stages are worth <strong className="text-slate-800">more points!</strong></span>
            </li>
          </ol>
        </div>

        {/* ── Sticker Card CTA ────────────────── col-span-1 */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900 leading-snug">Your World Cup sticker card</h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload your photo &amp; pick your country — download in high res.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://mundialhub.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors px-4 py-2.5 text-white font-semibold text-sm shadow-sm group"
            >
              Create mine
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link
              href="/profile"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 transition-colors px-4 py-2.5 text-amber-700 font-semibold text-sm"
            >
              Upload to profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
