"use server";

import { prisma } from "@/lib/prisma";
import { calcularGanador, calcularStatus } from "@/lib/utils";
import type { PartidoConRelaciones, Equipo } from "@/types";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { calculateStandings } from "@/actions/standings";

function enrichPartido(p: any): PartidoConRelaciones {
  const status = calcularStatus(p.dia, p.resultadoLocal);
  const ganador =
    status === "FINISHED"
      ? calcularGanador(
          p.resultadoLocal!,
          p.resultadoVisitante!,
          p.resultadoPenales,
          p.resultadoPenalesLocal,
          p.resultadoPenalesVisitante
        )
      : null;
  return { ...p, status, ganador };
}

const include = {
  local: true,
  visitante: true,
  fase: true,
  grupo: true,
} as const;

export async function getPartidos(filters?: {
  grupo?: string;
  fase?: string;
  fecha?: number;
}): Promise<PartidoConRelaciones[]> {
  const where: any = { deleted: false };

  if (filters?.grupo) {
    where.grupo = { codigo: filters.grupo };
  } else if (filters?.fase) {
    where.fase = { codigo: filters.fase };
  } else if (filters?.fecha) {
    where.fecha = filters.fecha;
  }

  const partidos = await prisma.partido.findMany({
    where,
    include,
    orderBy: { dia: "asc" },
  });

  return partidos.map(enrichPartido);
}

export async function getPartido(id: number): Promise<PartidoConRelaciones> {
  const partido = await prisma.partido.findUniqueOrThrow({
    where: { id, deleted: false },
    include,
  });
  return enrichPartido(partido);
}

export async function getEquipos(): Promise<Equipo[]> {
  return prisma.equipo.findMany({
    where: { deleted: false },
    orderBy: { nombre: "asc" },
  });
}

export async function setEquipos(
  partidoId: number,
  data: { localId: number; visitanteId: number }
) {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) throw new Error("Unauthorized");

  await prisma.partido.update({
    where: { id: partidoId },
    data: { localId: data.localId, visitanteId: data.visitanteId },
  });

  revalidatePath("/");
  revalidatePath("/forecast");
  revalidatePath("/admin/results");
}

export async function getFechas(): Promise<number[]> {
  const rows = await prisma.partido.findMany({
    where: { deleted: false },
    select: { fecha: true },
    distinct: ["fecha"],
    orderBy: { fecha: "asc" },
  });
  return rows.map((r) => r.fecha);
}

export async function setResultado(
  partidoId: number,
  data: {
    local: number;
    visitante: number;
    penales?: boolean;
    penalesLocal?: number;
    penalesVisitante?: number;
  }
) {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) throw new Error("Unauthorized");

  await prisma.partido.update({
    where: { id: partidoId },
    data: {
      resultadoLocal: data.local,
      resultadoVisitante: data.visitante,
      resultadoPenales: data.penales ?? false,
      resultadoPenalesLocal: data.penalesLocal ?? null,
      resultadoPenalesVisitante: data.penalesVisitante ?? null,
    },
  });

  await calculateStandings();
  revalidatePath("/");
  revalidatePath("/forecast");
  revalidatePath("/leaderboard");
}
