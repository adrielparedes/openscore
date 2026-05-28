"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calcularGanador, calcularStatus, isBloqueado } from "@/lib/utils";
import type { PartidoPronostico } from "@/types";
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
    const acertado =
      (pronostico.local && ganador === "LOCAL") ||
      (pronostico.visitante && ganador === "VISITANTE") ||
      (pronostico.empate && ganador === "EMPATE");
    puntos = acertado ? partido.fase.puntos : 0;
  }

  return { ...partido, status, ganador, pronostico, puntos };
}

export async function getPronosticos(filters?: {
  grupo?: string;
  fase?: string;
  fecha?: number;
}): Promise<PartidoPronostico[]> {
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
}

type Prediction = "local" | "visitante" | "empate";

export async function setPronostico(
  partidoId: number,
  prediction: Prediction
): Promise<{ error?: string }> {
  const usuarioId = await getUserId();

  const partido = await prisma.partido.findUniqueOrThrow({
    where: { id: partidoId },
  });

  if (isBloqueado(partido.dia)) {
    return { error: "Match is locked — predictions closed 15 min before kickoff" };
  }

  await prisma.pronostico.upsert({
    where: { partidoId_usuarioId: { partidoId, usuarioId } },
    create: {
      partidoId,
      usuarioId,
      local: prediction === "local",
      visitante: prediction === "visitante",
      empate: prediction === "empate",
    },
    update: {
      local: prediction === "local",
      visitante: prediction === "visitante",
      empate: prediction === "empate",
    },
  });

  revalidatePath("/forecast");
  revalidatePath("/");
  return {};
}

export async function getNextMatchPronostico(): Promise<PartidoPronostico | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const usuarioId = parseInt(session.user.id);

  const cutoff = new Date(Date.now() - 15 * 60 * 1000);

  const partido = await prisma.partido.findFirst({
    where: {
      deleted: false,
      resultadoLocal: null,
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
}
