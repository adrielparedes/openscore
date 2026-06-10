"use server";

import { prisma } from "@/lib/prisma";
import { calcularGanador, calcularStatus } from "@/lib/utils";
import { recordAction } from "@/lib/withMetrics";
import { cacheRequests, cacheMisses } from "@/lib/metrics";
import type { PartidoConRelaciones, Equipo } from "@/types";
import { auth } from "@/lib/auth";
import { revalidatePath, revalidateTag, updateTag, unstable_cache } from "next/cache";
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
  return recordAction("getPartidos", async () => {
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
  });
}

export async function getPartido(id: number): Promise<PartidoConRelaciones> {
  return recordAction("getPartido", async () => {
    const partido = await prisma.partido.findUniqueOrThrow({
      where: { id, deleted: false },
      include,
    });
    return enrichPartido(partido);
  });
}

export async function getEquipos(): Promise<Equipo[]> {
  return recordAction("getEquipos", async () => {
    return prisma.equipo.findMany({
      where: { deleted: false },
      orderBy: { nombre: "asc" },
    });
  });
}

export async function setEquipos(
  partidoId: number,
  data: { localId: number; visitanteId: number }
) {
  return recordAction("setEquipos", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) throw new Error("Unauthorized");

    await prisma.partido.update({
      where: { id: partidoId },
      data: { localId: data.localId, visitanteId: data.visitanteId },
    });

    updateTag("matches");
    revalidatePath("/");
    revalidatePath("/forecast");
    revalidatePath("/admin/results");
  });
}

const _cachedGetFechas = unstable_cache(
  async () => {
    cacheMisses()?.add(1, { cache: "fechas" });
    const rows = await prisma.partido.findMany({
      where: { deleted: false },
      select: { fecha: true },
      distinct: ["fecha"],
      orderBy: { fecha: "asc" },
    });
    return rows.map((r: { fecha: number }) => r.fecha);
  },
  ["fechas"],
  { tags: ["matches"] }
);

const cachedGetFechas = async () => {
  cacheRequests()?.add(1, { cache: "fechas" });
  return _cachedGetFechas();
};

export async function getFechas(): Promise<number[]> {
  return recordAction("getFechas", cachedGetFechas);
}

const TOTAL_MATCHES = 104;

const _cachedGetTournamentProgress = unstable_cache(
  async () => {
    cacheMisses()?.add(1, { cache: "tournamentProgress" });
    const withResults = await prisma.partido.count({
      where: { deleted: false, resultadoLocal: { not: null } },
    });
    return { withResults, total: TOTAL_MATCHES };
  },
  ["tournamentProgress"],
  { tags: ["matches"] }
);

export async function getTournamentProgress() {
  cacheRequests()?.add(1, { cache: "tournamentProgress" });
  return _cachedGetTournamentProgress();
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
  return recordAction("setResultado", async () => {
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
    updateTag("matches");
    revalidateTag("ranking", "max");
    revalidatePath("/");
    revalidatePath("/forecast");
    revalidatePath("/leaderboard");
    revalidatePath("/standings");
  });
}

export async function resetResultado(partidoId: number) {
  return recordAction("resetResultado", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) throw new Error("Unauthorized");

    await prisma.partido.update({
      where: { id: partidoId },
      data: {
        resultadoLocal: null,
        resultadoVisitante: null,
        resultadoPenales: false,
        resultadoPenalesLocal: null,
        resultadoPenalesVisitante: null,
      },
    });

    await calculateStandings();
    updateTag("matches");
    revalidateTag("ranking", "max");
    revalidatePath("/");
    revalidatePath("/forecast");
    revalidatePath("/leaderboard");
    revalidatePath("/standings");
  });
}

export async function invalidateAllCaches() {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) throw new Error("Unauthorized");

  updateTag("matches");
  revalidateTag("ranking", "max");
  revalidatePath("/", "layout");
  revalidatePath("/forecast");
  revalidatePath("/leaderboard");
  revalidatePath("/standings");
  revalidatePath("/admin/results");
}
