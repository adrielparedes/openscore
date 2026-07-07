"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calcularGanador, calcularStatus, isBloqueado } from "@/lib/utils";
import { recordAction } from "@/lib/withMetrics";
import { cacheRequests, cacheMisses } from "@/lib/metrics";
import type { PartidoPronostico, MatchOdds } from "@/types";
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

function buildPartidoPronostico(
  partido: any,
  pronostico: any | null,
  odds: MatchOdds | null = null
): PartidoPronostico {
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

  return { ...partido, dia, status, ganador, pronostico, puntos, odds };
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
  cacheRequests()?.add(1, { cache: "matches" });
  return unstable_cache(
    async () => {
      cacheMisses()?.add(1, { cache: "matches" });
      const where: any = { deleted: false };
      if (filters?.grupo) where.grupo = { codigo: filters.grupo };
      else if (filters?.fase === "TERCER_FINAL") where.fase = { codigo: { in: ["TERCER", "FINAL"] } };
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
  cacheRequests()?.add(1, { cache: "matches" });
  return unstable_cache(
    async () => {
      cacheMisses()?.add(1, { cache: "matches" });
      return prisma.partido.findMany({
        where: {
          deleted: false,
          fase: { codigo: { in: KNOCKOUT_PHASE_CODES } },
        },
        include: { local: true, visitante: true, fase: true, grupo: true },
        orderBy: { dia: "asc" },
      });
    },
    ["partidos-knockout"],
    { tags: ["matches"] }
  )();
}

// Cache the upcoming partido list keyed by UTC date so the result stays valid
// for the entire calendar day while still being busted by admin mutations.
function cachedUpcomingPartidos(todayStart: Date) {
  const dateKey = todayStart.toISOString().slice(0, 10);
  cacheRequests()?.add(1, { cache: "matches" });
  return unstable_cache(
    async () => {
      cacheMisses()?.add(1, { cache: "matches" });
      return prisma.partido.findMany({
        where: { deleted: false, dia: { gte: todayStart } },
        include: { local: true, visitante: true, fase: true, grupo: true },
        orderBy: { dia: "asc" },
      });
    },
    ["partidos-upcoming", dateKey],
    { tags: ["matches"], revalidate: 60 }
  )();
}

function cachedPronosticos(usuarioId: number) {
  cacheRequests()?.add(1, { cache: "pronosticos" });
  return unstable_cache(
    async () => {
      cacheMisses()?.add(1, { cache: "pronosticos" });
      return prisma.pronostico.findMany({
        where: { usuarioId, deleted: false },
      });
    },
    [`pronosticos-${usuarioId}`],
    { tags: [`pronosticos-${usuarioId}`] }
  )();
}

async function cachedOdds(partidoIds: number[]): Promise<Map<number, MatchOdds>> {
  if (partidoIds.length === 0) return new Map();
  const key = ["odds", ...partidoIds.map(String).sort()];
  cacheRequests()?.add(1, { cache: "odds" });
  const record = await unstable_cache(
    async () => {
      cacheMisses()?.add(1, { cache: "odds" });
      const rows = await prisma.pronostico.groupBy({
        by: ["partidoId", "ganador"],
        where: { partidoId: { in: partidoIds }, deleted: false },
        _count: true,
      });
      const result: Record<number, MatchOdds> = {};
      for (const row of rows) {
        if (!result[row.partidoId]) {
          result[row.partidoId] = { local: 0, empate: 0, visitante: 0, total: 0 };
        }
        const entry = result[row.partidoId];
        entry.total += row._count;
        if (row.ganador === "LOCAL") entry.local = row._count;
        else if (row.ganador === "EMPATE") entry.empate = row._count;
        else if (row.ganador === "VISITANTE") entry.visitante = row._count;
      }
      return result;
    },
    key,
    { tags: ["odds"], revalidate: 60 }
  )();
  return new Map(Object.entries(record).map(([k, v]) => [Number(k), v]));
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
    const oddsMap = await cachedOdds(partidos.map((p) => p.id));
    return partidos.map((partido) => {
      const pronostico = pronosticos.find((p) => p.partidoId === partido.id) ?? null;
      return buildPartidoPronostico(partido, pronostico, oddsMap.get(partido.id) ?? null);
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
      include: { fase: true },
    });

    if (isBloqueado(partido.dia)) {
      return { error: "Match is locked — predictions closed 15 min before kickoff" };
    }

    if (ganador === "EMPATE" && partido.fase.codigo !== "GRUPO") {
      return { error: "Draws are not allowed in knockout stages" };
    }

    await prisma.pronostico.upsert({
      where: { partidoId_usuarioId: { partidoId, usuarioId } },
      create: { partidoId, usuarioId, ganador },
      update: { ganador },
    });

    updateTag(`pronosticos-${usuarioId}`);
    updateTag("odds");
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
    const oddsMap = await cachedOdds(partidos.map((p) => p.id));
    return partidos.map((partido) => {
      const pronostico = pronosticos.find((p) => p.partidoId === partido.id) ?? null;
      return buildPartidoPronostico(partido, pronostico, oddsMap.get(partido.id) ?? null);
    });
  });
}

export async function getUpcomingPronosticos(): Promise<PartidoPronostico[]> {
  return recordAction("getUpcomingPronosticos", async () => {
    const session = await auth();
    if (!session?.user?.id) return [];
    const usuarioId = parseInt(session.user.id);

    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const [allUpcoming, pronosticos] = await Promise.all([
      cachedUpcomingPartidos(todayStart),
      cachedPronosticos(usuarioId),
    ]);
    const oddsMap = await cachedOdds(allUpcoming.map((p) => p.id));

    return allUpcoming.map((p) => {
      const pronostico = pronosticos.find((pr) => pr.partidoId === p.id) ?? null;
      return buildPartidoPronostico(p, pronostico, oddsMap.get(p.id) ?? null);
    });
  });
}

export async function getNextMatchPronostico(
  prefetchedUsuarioId?: number
): Promise<PartidoPronostico | null> {
  return recordAction("getNextMatchPronostico", async () => {
    let usuarioId: number;
    if (prefetchedUsuarioId !== undefined) {
      usuarioId = prefetchedUsuarioId;
    } else {
      const session = await auth();
      if (!session?.user?.id) return null;
      usuarioId = parseInt(session.user.id);
    }

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

    const [pronostico, oddsMap] = await Promise.all([
      prisma.pronostico.findUnique({
        where: { partidoId_usuarioId: { partidoId: partido.id, usuarioId } },
      }),
      cachedOdds([partido.id]),
    ]);

    return buildPartidoPronostico(partido, pronostico ?? null, oddsMap.get(partido.id) ?? null);
  });
}
