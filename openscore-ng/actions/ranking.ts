"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { calcularGanador } from "@/lib/utils";
import { rankingDuration, rankingUsersScored } from "@/lib/metrics";
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
    const acertado = p.ganador === ganador;
    return total + (acertado ? partido.fase.puntos : 0);
  }, 0);
}

async function fetchRanking(filters?: {
  pais?: string;
  size?: number;
}): Promise<RankingEntry[]> {
  const start = performance.now();
  const filtered = !!filters?.pais;

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
      paniniCard: u.paniniCard ?? null,
    }))
    .sort((a, b) => b.puntos - a.puntos)
    .map((r, i) => ({ ...r, ranking: i + 1 }));

  const elapsed = (performance.now() - start) / 1000;
  rankingDuration()?.record(elapsed, { filtered: String(filtered) });
  rankingUsersScored()?.record(rankings.length);

  if (filters?.size && filters.size > 0) {
    return rankings.slice(0, filters.size);
  }

  return rankings;
}

async function fetchRankingForUsuario(
  usuarioId: number
): Promise<RankingEntry | null> {
  const all = await fetchRanking();
  return all.find((r) => r.usuario === usuarioId) ?? null;
}

export const getRanking = unstable_cache(fetchRanking, ["ranking"], {
  tags: ["ranking"],
  revalidate: 60,
});

export const getRankingForUsuario = unstable_cache(
  fetchRankingForUsuario,
  ["ranking-usuario"],
  { tags: ["ranking"], revalidate: 60 }
);
