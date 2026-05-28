"use server";

import { prisma } from "@/lib/prisma";
import { calcularGanador } from "@/lib/utils";
import type { RankingEntry } from "@/types";

function calcularPuntosUsuario(pronosticos: any[]): number {
  return pronosticos.reduce((total, p) => {
    const partido = p.partido;
    if (partido.resultadoLocal === null) return total;
    const ganador = calcularGanador(
      partido.resultadoLocal,
      partido.resultadoVisitante,
      partido.resultadoPenales,
      partido.resultadoPenalesLocal,
      partido.resultadoPenalesVisitante
    );
    const acertado =
      (p.local && ganador === "LOCAL") ||
      (p.visitante && ganador === "VISITANTE") ||
      (p.empate && ganador === "EMPATE");
    return total + (acertado ? partido.fase.puntos : 0);
  }, 0);
}

export async function getRanking(filters?: {
  pais?: string;
  size?: number;
}): Promise<RankingEntry[]> {
  const where: any = { deleted: false };
  if (filters?.pais) where.pais = { codigo: filters.pais };

  const usuarios = await prisma.usuario.findMany({
    where,
    include: {
      pais: true,
      pronosticos: {
        where: { deleted: false },
        include: {
          partido: {
            include: { fase: true },
          },
        },
      },
    },
  });

  const rankings: RankingEntry[] = usuarios
    .map((u) => ({
      usuario: u.id,
      nombre: `${u.nombre} ${u.apellido}`,
      pais: u.pais.codigo,
      puntos: calcularPuntosUsuario(u.pronosticos),
      ranking: 0,
    }))
    .sort((a, b) => b.puntos - a.puntos)
    .map((r, i) => ({ ...r, ranking: i + 1 }));

  if (filters?.size && filters.size > 0) {
    return rankings.slice(0, filters.size);
  }

  return rankings;
}

export async function getRankingForUsuario(usuarioId: number): Promise<RankingEntry | null> {
  const all = await getRanking();
  return all.find((r) => r.usuario === usuarioId) ?? null;
}
