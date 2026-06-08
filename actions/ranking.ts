"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { calcularGanador } from "@/lib/utils";
import { rankingDuration, rankingUsersScored, cacheRequests, cacheMisses } from "@/lib/metrics";
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
  cacheMisses()?.add(1, { cache: "ranking" });
  const start = performance.now();
  const filtered = !!filters?.pais;

  const where: any = { deleted: false, blocked: false, email: { not: "admin@openscore.com" } };
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
      stickerCard: u.stickerCard ?? null,
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
  cacheMisses()?.add(1, { cache: "ranking-usuario" });
  const all = await fetchRanking();
  return all.find((r) => r.usuario === usuarioId) ?? null;
}

const _cachedGetAllRanking = unstable_cache(
  (size?: number) => fetchRanking({ size }),
  ["ranking", "all"],
  { tags: ["ranking"], revalidate: 60 }
);

const _cachedGetRankingByPais = unstable_cache(
  (pais: string) => fetchRanking({ pais }),
  ["ranking", "pais"],
  { tags: ["ranking"], revalidate: 60 }
);

const _cachedGetRankingForUsuario = unstable_cache(
  fetchRankingForUsuario,
  ["ranking-usuario"],
  { tags: ["ranking"], revalidate: 60 }
);

export async function getRanking(filters?: {
  pais?: string;
  size?: number;
}): Promise<RankingEntry[]> {
  cacheRequests()?.add(1, { cache: "ranking" });
  if (filters?.pais) {
    return _cachedGetRankingByPais(filters.pais);
  }
  return _cachedGetAllRanking(filters?.size);
}

export async function getRankingForUsuario(
  usuarioId: number
): Promise<RankingEntry | null> {
  cacheRequests()?.add(1, { cache: "ranking-usuario" });
  return _cachedGetRankingForUsuario(usuarioId);
}
