"use server";

import { prisma } from "@/lib/prisma";
import { calcularGanador } from "@/lib/utils";
import type { StandingConRelaciones } from "@/types";
import { revalidatePath } from "next/cache";

export async function getStandings(grupo?: string): Promise<StandingConRelaciones[]> {
  const where: any = {};
  if (grupo) where.grupo = { codigo: grupo };

  return prisma.standing.findMany({
    where,
    include: { equipo: true, grupo: true },
    orderBy: [{ puntos: "desc" }, { diferenciaGol: "desc" }, { ganados: "desc" }],
  });
}

export async function calculateStandings(): Promise<void> {
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
    let diferenciaGol = 0;
    let cantidadPartidos = 0;
    let grupoId: number | null = null;

    for (const partido of equipoPartidos) {
      grupoId = partido.grupoId;

      if (partido.resultadoLocal === null) continue;

      cantidadPartidos++;
      const gol = partido.resultadoLocal - partido.resultadoVisitante!;
      const ganador = calcularGanador(
        partido.resultadoLocal,
        partido.resultadoVisitante!,
        partido.resultadoPenales,
        partido.resultadoPenalesLocal,
        partido.resultadoPenalesVisitante
      );

      const esLocal = partido.local.codigo === equipo.codigo;

      if (ganador === "EMPATE") {
        empatados++;
      } else if (
        (ganador === "LOCAL" && esLocal) ||
        (ganador === "VISITANTE" && !esLocal)
      ) {
        ganados++;
        diferenciaGol += Math.abs(gol);
      } else {
        perdidos++;
        diferenciaGol -= Math.abs(gol);
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
          diferenciaGol,
          partidos: cantidadPartidos,
          puntos: ganados * 3 + empatados,
        },
      });
    }
  }

  revalidatePath("/");
}
