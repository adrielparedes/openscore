"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calcularGanador, calcularStatus, isBloqueado } from "@/lib/utils";
import { recordAction } from "@/lib/withMetrics";
import type { PartidoPronostico } from "@/types";
import type { PronosticoGanador } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getUserId(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return parseInt(session.user.id);
}

function buildPartidoPronostico(partido: any, pronostico: any | null): PartidoPronostico {
  const status = calcularStatus(partido.dia, partido.resultadoLocal);
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

  return { ...partido, status, ganador, pronostico, puntos };
}

export async function getPronosticos(filters?: {
  grupo?: string;
  fase?: string;
  fecha?: number;
}): Promise<PartidoPronostico[]> {
  return recordAction("getPronosticos", async () => {
    const usuarioId = await getUserId();

    const where: any = { deleted: false };
    if (filters?.grupo) where.grupo = { codigo: filters.grupo };
    else if (filters?.fase) where.fase = { codigo: filters.fase };
    else if (filters?.fecha) where.fecha = filters.fecha;

    const partidos = await prisma.partido.findMany({
      where,
      include: { local: true, visitante: true, fase: true, grupo: true },
      orderBy: { dia: "asc" },
    });

    const pronosticos = await prisma.pronostico.findMany({
      where: { usuarioId, deleted: false },
    });

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

    revalidatePath("/forecast");
    revalidatePath("/");
    return {};
  });
}

const KNOCKOUT_PHASE_CODES = [
  "TREINTAIDOSAVOS",
  "OCTAVOS",
  "CUARTOS",
  "SEMI",
  "TERCER",
  "FINAL",
];

export async function getKnockoutPronosticos(): Promise<PartidoPronostico[]> {
  return recordAction("getKnockoutPronosticos", async () => {
    const usuarioId = await getUserId();

    const partidos = await prisma.partido.findMany({
      where: {
        deleted: false,
        fase: { codigo: { in: KNOCKOUT_PHASE_CODES } },
      },
      include: { local: true, visitante: true, fase: true, grupo: true },
      orderBy: { dia: "asc" },
    });

    const pronosticos = await prisma.pronostico.findMany({
      where: { usuarioId, deleted: false },
    });

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

    const allUpcoming = await prisma.partido.findMany({
      where: {
        deleted: false,
        dia: { gte: todayStart },
      },
      include: { local: true, visitante: true, fase: true, grupo: true },
      orderBy: { dia: "asc" },
    });

    const pronosticos = await prisma.pronostico.findMany({
      where: { usuarioId, deleted: false },
    });

    const toPronostico = (p: any) => {
      const pronostico = pronosticos.find((pr) => pr.partidoId === p.id) ?? null;
      return buildPartidoPronostico(p, pronostico);
    };

    const todayMatches = allUpcoming.filter((p) => p.dia < todayEnd);

    const afterToday = allUpcoming.filter((p) => p.dia >= todayEnd);
    let nextDayMatches: typeof allUpcoming = [];
    let nextDayDate: Date | null = null;

    if (afterToday.length > 0) {
      const first = afterToday[0];
      const nextStart = new Date(Date.UTC(first.dia.getUTCFullYear(), first.dia.getUTCMonth(), first.dia.getUTCDate()));
      const nextEnd = new Date(nextStart.getTime() + 24 * 60 * 60 * 1000);
      nextDayMatches = afterToday.filter((p) => p.dia >= nextStart && p.dia < nextEnd).slice(0, 4);
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
