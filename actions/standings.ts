"use server";

import { prisma } from "@/lib/prisma";
import { calcularGanador } from "@/lib/utils";
import { standingsDuration } from "@/lib/metrics";
import { recordAction } from "@/lib/withMetrics";
import type { StandingConRelaciones } from "@/types";
import type { Equipo, Grupo } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface GroupWithTeams {
  grupo: Grupo;
  teams: Equipo[];
}

export async function getGroupsWithTeams(): Promise<GroupWithTeams[]> {
  return recordAction("getGroupsWithTeams", async () => {
    const partidos = await prisma.partido.findMany({
      where: { deleted: false, fase: { codigo: "GRUPO" }, grupoId: { not: null } },
      include: { local: true, visitante: true, grupo: true },
    });

    const groupMap = new Map<string, { grupo: Grupo; teams: Map<number, Equipo> }>();

    for (const p of partidos) {
      if (!p.grupo) continue;
      const key = p.grupo.codigo;
      if (!groupMap.has(key)) {
        groupMap.set(key, { grupo: p.grupo, teams: new Map() });
      }
      const entry = groupMap.get(key)!;
      entry.teams.set(p.local.id, p.local);
      entry.teams.set(p.visitante.id, p.visitante);
    }

    return Array.from(groupMap.values())
      .map(({ grupo, teams }) => ({ grupo, teams: Array.from(teams.values()) }))
      .sort((a, b) => a.grupo.codigo.localeCompare(b.grupo.codigo));
  });
}

export async function getStandings(grupo?: string): Promise<StandingConRelaciones[]> {
  return recordAction("getStandings", async () => {
    const where: any = {};
    if (grupo) where.grupo = { codigo: grupo };

    return prisma.standing.findMany({
      where,
      include: { equipo: true, grupo: true },
      orderBy: [{ puntos: "desc" }, { diferenciaGol: "desc" }, { ganados: "desc" }],
    });
  });
}

export async function calculateStandings(): Promise<void> {
  return recordAction("calculateStandings", async () => {
    const start = performance.now();
    try {
      await prisma.standing.deleteMany({});

      const equipos = await prisma.equipo.findMany({ where: { deleted: false } });
      const partidos = await prisma.partido.findMany({
        where: { deleted: false, fase: { codigo: "GRUPO" } },
        include: { local: true, visitante: true, grupo: true, fase: true },
      });

      for (const equipo of equipos) {
        const equipoPartidos = partidos.filter(
          (p) =>
            p.local.codigo === equipo.codigo ||
            p.visitante.codigo === equipo.codigo
        );

        let ganados = 0;
        let perdidos = 0;
        let empatados = 0;
        let golesAFavor = 0;
        let diferenciaGol = 0;
        let cantidadPartidos = 0;
        let grupoId: number | null = null;

        for (const partido of equipoPartidos) {
          grupoId = partido.grupoId;

          if (partido.resultadoLocal === null) continue;

          cantidadPartidos++;
          const esLocal = partido.local.codigo === equipo.codigo;
          const golesEquipo = esLocal ? partido.resultadoLocal : partido.resultadoVisitante!;
          const golesRival = esLocal ? partido.resultadoVisitante! : partido.resultadoLocal;

          golesAFavor += golesEquipo;
          diferenciaGol += golesEquipo - golesRival;

          const ganador = calcularGanador(
            partido.resultadoLocal,
            partido.resultadoVisitante!,
            partido.resultadoPenales,
            partido.resultadoPenalesLocal,
            partido.resultadoPenalesVisitante
          );

          if (ganador === "EMPATE") {
            empatados++;
          } else if (
            (ganador === "LOCAL" && esLocal) ||
            (ganador === "VISITANTE" && !esLocal)
          ) {
            ganados++;
          } else {
            perdidos++;
          }
        }

        if (grupoId !== null || cantidadPartidos > 0) {
          await prisma.standing.create({
            data: {
              equipoId: equipo.id,
              grupoId,
              ganados,
              perdidos,
              empatados,
              golesAFavor,
              diferenciaGol,
              partidos: cantidadPartidos,
              puntos: ganados * 3 + empatados,
            },
          });
        }
      }

      revalidatePath("/", "layout");
    } finally {
      standingsDuration()?.record((performance.now() - start) / 1000);
    }
  });
}
