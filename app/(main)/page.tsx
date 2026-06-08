import { auth } from "@/lib/auth";
import { getRanking } from "@/actions/ranking";
import { getNextMatchPronostico } from "@/actions/pronosticos";
import { getActiveBanners } from "@/actions/banners";
import { WorldCupCountdown } from "@/components/ui/WorldCupCountdown";
import { HomeCarousel } from "@/components/ui/HomeCarousel";
import NextMatchCard from "@/components/forecast/NextMatchCard";
import StickerCardDisplay from "@/components/profile/StickerCardDisplay";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Globe, ArrowRight, BookOpen } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  const nombre = (session?.user as any)?.nombre ?? session?.user?.name ?? "there";
  const usuarioId = session?.user?.id ? parseInt(session.user.id) : undefined;
  const [topRanking, nextMatch, banners] = await Promise.all([
    getRanking({ size: 3 }),
    getNextMatchPronostico(usuarioId),
    getActiveBanners(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4">

      {/* ── Top bento: Emblem + Welcome + Countdown + CTAs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="rounded-2xl overflow-hidden shadow-sm">
          <Image
            src="/RH_OpenScore_web.png"
            alt="Red Hat Open Score — World Cup 2026"
            width={1080}
            height={1080}
            className="h-full w-full object-cover"
            priority
            unoptimized
          />
        </div>

        <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/20 p-7 flex flex-col justify-center gap-2 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Welcome back</p>
          <h1 className="text-2xl font-bold text-foreground leading-tight">{nombre}!</h1>
          <p className="text-muted-foreground text-sm">Ready to predict today&apos;s matches?</p>
        </section>

        <div className="lg:col-span-2 lg:row-span-2 flex">
          {banners.length > 0 ? (
            <HomeCarousel banners={banners} />
          ) : (
            <WorldCupCountdown className="flex-1" />
          )}
        </div>

        <Link
          href="/forecast"
          className="group rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-gradient-to-br from-rose-100 dark:from-rose-900/20 to-rose-100 dark:to-rose-800/10 p-6 flex flex-col justify-between shadow-sm hover:border-rose-300 dark:hover:border-rose-700/60 hover:shadow-md transition-all"
        >
          <div className="h-10 w-10 rounded-xl bg-rose-600 flex items-center justify-center mb-4">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-foreground">Predictions</div>
            <div className="text-xs text-muted-foreground mt-0.5">Predict match results</div>
          </div>
          <ArrowRight className="h-4 w-4 text-rose-700 dark:text-rose-400 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/leaderboard"
          className="group rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-100 dark:from-amber-900/20 to-amber-100 dark:to-amber-800/10 p-6 flex flex-col justify-between shadow-sm hover:border-amber-300 dark:hover:border-amber-700/60 hover:shadow-md transition-all"
        >
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-foreground">Leaderboard</div>
            <div className="text-xs text-muted-foreground mt-0.5">See global rankings</div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-700 dark:text-amber-400 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>

      {/* ── Bottom: dos columnas independientes, gap uniforme en cada una ── */}
      <div className="hidden md:flex gap-4">

        {/* Columna izquierda */}
        <div className="flex-1 flex flex-col gap-4">
          {nextMatch ? (
            <NextMatchCard match={nextMatch} />
          ) : (
            <div className="rounded-2xl border border-border bg-muted flex items-center justify-center p-8 text-sm text-muted-foreground shadow-sm">
              No upcoming matches scheduled.
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex-1 rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-bold text-foreground">How to play</h2>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2.5">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">1</span>
                  <span>Go to <Link href="/forecast" className="text-primary hover:underline">Predictions</Link> to see upcoming matches</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">2</span>
                  <span>Pick <strong className="text-foreground">Home</strong>, <strong className="text-foreground">Draw</strong>, or <strong className="text-foreground">Away</strong></span>
                </li>
                <li className="flex gap-2.5">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">3</span>
                  <span>Predictions lock <strong className="text-foreground">15 min</strong> before kickoff</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">4</span>
                  <span>Knockout stages are worth <strong className="text-foreground">more points!</strong></span>
                </li>
              </ol>
            </div>
            <div className="flex-1 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-100 dark:from-amber-900/20 via-amber-50 dark:via-amber-900/10 to-orange-100 dark:to-orange-900/10 p-6 flex flex-col justify-between gap-4 shadow-sm">
              <div>
                <h2 className="font-bold text-foreground leading-snug">Your World Cup sticker card</h2>
                <p className="text-xs text-muted-foreground mt-1">
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
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-card hover:bg-accent transition-colors px-4 py-2.5 text-amber-700 dark:text-amber-400 font-semibold text-sm"
                >
                  Upload to profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Top 3</h2>
              <Link href="/leaderboard" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {topRanking.length === 0 ? (
              <p className="text-sm text-muted-foreground">No rankings yet — be the first to predict!</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
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
          <a
            href="https://redhat.enterprise.slack.com/archives/C0B7WVA16H5"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-purple-200 dark:border-purple-800/40 bg-gradient-to-br from-purple-100 dark:from-purple-900/20 via-violet-100 dark:via-violet-900/15 to-indigo-100 dark:to-indigo-900/10 p-6 flex items-center gap-4 shadow-sm hover:border-purple-300 dark:hover:border-purple-600/50 hover:shadow-md transition-all"
          >
            <div className="h-11 w-11 shrink-0 rounded-xl bg-card flex items-center justify-center shadow-sm border border-purple-200 dark:border-purple-700/40">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
                <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
                <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#36C5F0"/>
                <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
                <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#2EB67D"/>
                <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
                <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#ECB22E"/>
                <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground">Join the conversation</div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">#openscore on Slack</div>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-700 dark:text-purple-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>

      {/* Mobile: stack vertical */}
      <div className="flex flex-col gap-4 md:hidden">
        {nextMatch ? (
          <NextMatchCard match={nextMatch} />
        ) : (
          <div className="rounded-2xl border border-border bg-muted flex items-center justify-center p-8 text-sm text-muted-foreground">
            No upcoming matches scheduled.
          </div>
        )}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">Top 3</h2>
            <Link href="/leaderboard" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {topRanking.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rankings yet — be the first to predict!</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
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
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-bold text-foreground">How to play</h2>
          </div>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">1</span>
              <span>Go to <Link href="/forecast" className="text-primary hover:underline">Predictions</Link> to see upcoming matches</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">2</span>
              <span>Pick <strong className="text-foreground">Home</strong>, <strong className="text-foreground">Draw</strong>, or <strong className="text-foreground">Away</strong></span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">3</span>
              <span>Predictions lock <strong className="text-foreground">15 min</strong> before kickoff</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center">4</span>
              <span>Knockout stages are worth <strong className="text-foreground">more points!</strong></span>
            </li>
          </ol>
        </div>
        <a
          href="https://redhat.enterprise.slack.com/archives/C0B7WVA16H5"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-purple-200 dark:border-purple-800/40 bg-gradient-to-br from-purple-100 dark:from-purple-900/20 via-violet-100 dark:via-violet-900/15 to-indigo-100 dark:to-indigo-900/10 p-6 flex items-center gap-4 shadow-sm hover:border-purple-300 dark:hover:border-purple-600/50 hover:shadow-md transition-all"
        >
          <div className="h-11 w-11 shrink-0 rounded-xl bg-purple-600 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
                <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
                <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#36C5F0"/>
                <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
                <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#2EB67D"/>
                <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
                <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#ECB22E"/>
                <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
              </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground">Join the conversation</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">#openscore on Slack</div>
          </div>
          <ArrowRight className="h-4 w-4 text-purple-700 dark:text-purple-400 shrink-0 group-hover:translate-x-1 transition-transform" />
        </a>
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-100 dark:from-amber-900/20 via-amber-50 dark:via-amber-900/10 to-orange-100 dark:to-orange-900/10 p-6 flex flex-col justify-between gap-4 shadow-sm">
          <div>
            <h2 className="font-bold text-foreground leading-snug">Your World Cup sticker card</h2>
            <p className="text-xs text-muted-foreground mt-1">
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
              className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-card hover:bg-accent transition-colors px-4 py-2.5 text-amber-700 dark:text-amber-400 font-semibold text-sm"
            >
              Upload to profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
