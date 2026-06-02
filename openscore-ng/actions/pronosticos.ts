"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calcularGanador, calcularStatus, isBloqueado } from "@/lib/utils";
import { recordAction } from "@/lib/withMetrics";
import type { PartidoPronostico } from "@/types";
import type { PronosticoGanador } from "@prisma/client";
import { revalidatePath, updateTag, unstable_cache } from "next/cache";

async function getUserId(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return parseInt(session.user.id);
}

// unstable_cache serializes Dates as ISO strings — re-hydrate before use.
function normalizeDia<T extends { dia: Date | string }>(p: T): T & { dia: Date } {
  return { ...p, dia: new Date(p.dia) };
}

function buildPartidoPronostico(partido: any, pronostico: any | null): PartidoPronostico {
  const { dia } = normalizeDia(partido);
  const status = calcularStatus(dia, partido.resultadoLocal);
  const ganador =
    status === "FINISHED"
      ? calcularGanador(
          partido.resultadoLocal!,
          partido.resultadoVisitante!,
          partido.resultadoPenales,
          partido.resultadoPenalesLocal,
          partido.resultadoPenalesVisitante
        )
      : null;

  let puntos = 0;
  if (status === "FINISHED" && pronostico && ganador) {
    puntos = pronostico.ganador === ganador ? partido.fase.puntos : 0;
  }

  return { ...partido, dia, status, ganador, pronostico, puntos };
}

const KNOCKOUT_PHASE_CODES = [
  "TREINTAIDOSAVOS",
  "OCTAVOS",
  "CUARTOS",
  "SEMI",
  "TERCER",
  "FINAL",
];

// ---------------------------------------------------------------------------
// Cached DB readers
// Partido data (teams, phases, dates, scores) is tagged 'matches' and shared
// across all users. Invalidated by admin mutations (setResultado, setEquipos).
// Pronostico data is keyed and tagged per user, invalidated by setPronostico.
// ---------------------------------------------------------------------------

function cachedPartidos(filters?: { grupo?: string; fase?: string; fecha?: number }) {
  const key = [
    "partidos",
    filters?.grupo ?? "",
    filters?.fase ?? "",
    String(filters?.fecha ?? ""),
  ];
  return unstable_cache(
    async () => {
      const where: any = { deleted: false };
      if (filters?.grupo) where.grupo = { codigo: filters.grupo };
      else if (filters?.fase) where.fase = { codigo: filters.fase };
      else if (filters?.fecha) where.fecha = filters.fecha;
      return prisma.partido.findMany({
        where,
        include: { local: true, visitante: true, fase: true, grupo: true },
        orderBy: { dia: "asc" },
      });
    },
    key,
    { tags: ["matches"] }
  )();
}

function cachedKnockoutPartidos() {
  return unstable_cache(
    async () =>
      prisma.partido.findMany({
        where: {
          deleted: false,
          fase: { codigo: { in: KNOCKOUT_PHASE_CODES } },
        },
        include: { local: true, visitante: true, fase: true, grupo: true },
        orderBy: { dia: "asc" },
      }),
    ["partidos-knockout"],
    { tags: ["matches"] }
  )();
}

// Cache the upcoming partido list keyed by UTC date so the result stays valid
// for the entire calendar day while still being busted by admin mutations.
function cachedUpcomingPartidos(todayStart: Date) {
  const dateKey = todayStart.toISOString().slice(0, 10);
  return unstable_cache(
    async () =>
      prisma.partido.findMany({
        where: { deleted: false, dia: { gte: todayStart } },
        include: { local: true, visitante: true, fase: true, grupo: true },
        orderBy: { dia: "asc" },
      }),
    ["partidos-upcoming", dateKey],
    { tags: ["matches"], revalidate: 60 }
  )();
}

function cachedPronosticos(usuarioId: number) {
  return unstable_cache(
    async () =>
      prisma.pronostico.findMany({
        where: { usuarioId, deleted: false },
      }),
    [`pronosticos-${usuarioId}`],
    { tags: [`pronosticos-${usuarioId}`] }
  )();
}

export async function getPronosticos(filters?: {
  grupo?: string;
  fase?: string;
  fecha?: number;
}): Promise<PartidoPronostico[]> {
  return recordAction("getPronosticos", async () => {
    const usuarioId = await getUserId();
    const [partidos, pronosticos] = await Promise.all([
      cachedPartidos(filters),
      cachedPronosticos(usuarioId),
    ]);
    return partidos.map((partido) => {
      const pronostico = pronosticos.find((p) => p.partidoId === partido.id) ?? null;
      return buildPartidoPronostico(partido, pronostico);
    });
  });
}

export async function setPronostico(
  partidoId: number,
  ganador: PronosticoGanador
): Promise<{ error?: string }> {
  return recordAction("setPronostico", async () => {
    const usuarioId = await getUserId();

    const partido = await prisma.partido.findUniqueOrThrow({
      where: { id: partidoId },
    });

    if (isBloqueado(partido.dia)) {
      return { error: "Match is locked — predictions closed 15 min before kickoff" };
    }

    await prisma.pronostico.upsert({
      where: { partidoId_usuarioId: { partidoId, usuarioId } },
      create: { partidoId, usuarioId, ganador },
      update: { ganador },
    });

    updateTag(`pronosticos-${usuarioId}`);
    revalidatePath("/forecast");
    revalidatePath("/");
    return {};
  });
}

export async function getKnockoutPronosticos(): Promise<PartidoPronostico[]> {
  return recordAction("getKnockoutPronosticos", async () => {
    const usuarioId = await getUserId();
    const [partidos, pronosticos] = await Promise.all([
      cachedKnockoutPartidos(),
      cachedPronosticos(usuarioId),
    ]);
    return partidos.map((partido) => {
      const pronostico = pronosticos.find((p) => p.partidoId === partido.id) ?? null;
      return buildPartidoPronostico(partido, pronostico);
    });
  });
}

export async function getUpcomingPronosticos(): Promise<{
  today: PartidoPronostico[];
  nextDay: PartidoPronostico[];
  nextDayDate: Date | null;
}> {
  return recordAction("getUpcomingPronosticos", async () => {
    const session = await auth();
    if (!session?.user?.id) return { today: [], nextDay: [], nextDayDate: null };
    const usuarioId = parseInt(session.user.id);

    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

    const [allUpcoming, pronosticos] = await Promise.all([
      cachedUpcomingPartidos(todayStart),
      cachedPronosticos(usuarioId),
    ]);

    const toPronostico = (p: any) => {
      const pronostico = pronosticos.find((pr) => pr.partidoId === p.id) ?? null;
      return buildPartidoPronostico(p, pronostico);
    };

    const todayMatches = allUpcoming.filter((p) => new Date(p.dia) < todayEnd);

    const afterToday = allUpcoming.filter((p) => new Date(p.dia) >= todayEnd);
    let nextDayMatches: typeof allUpcoming = [];
    let nextDayDate: Date | null = null;

    if (afterToday.length > 0) {
      const firstDia = new Date(afterToday[0].dia);
      const nextStart = new Date(Date.UTC(firstDia.getUTCFullYear(), firstDia.getUTCMonth(), firstDia.getUTCDate()));
      const nextEnd = new Date(nextStart.getTime() + 24 * 60 * 60 * 1000);
      nextDayMatches = afterToday.filter((p) => { const d = new Date(p.dia); return d >= nextStart && d < nextEnd; }).slice(0, 4);
      nextDayDate = nextStart;
    }

    return {
      today: todayMatches.map(toPronostico),
      nextDay: nextDayMatches.map(toPronostico),
      nextDayDate,
    };
  });
}

export async function getNextMatchPronostico(): Promise<PartidoPronostico | null> {
  return recordAction("getNextMatchPronostico", async () => {
    const session = await auth();
    if (!session?.user?.id) return null;
    const usuarioId = parseInt(session.user.id);

    const cutoff = new Date(Date.now() - 15 * 60 * 1000);

    const partido = await prisma.partido.findFirst({
      where: {
        deleted: false,
        dia: { gte: cutoff },
      },
      include: { local: true, visitante: true, fase: true, grupo: true },
      orderBy: { dia: "asc" },
    });

    if (!partido) return null;

    const pronostico =
      (await prisma.pronostico.findUnique({
        where: { partidoId_usuarioId: { partidoId: partido.id, usuarioId } },
      })) ?? null;

    return buildPartidoPronostico(partido, pronostico);
  });
}
