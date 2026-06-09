"use server";

import { pool } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { rankingDuration, rankingUsersScored, cacheRequests, cacheMisses } from "@/lib/metrics";
import type { RankingEntry } from "@/types";

async function fetchRanking(filters?: {
  pais?: string;
  size?: number;
}): Promise<RankingEntry[]> {
  cacheMisses()?.add(1, { cache: "ranking" });
  const start = performance.now();
  const filtered = !!filters?.pais;

  const params: (string | number)[] = [];
  let paisFilter = "";
  if (filters?.pais) {
    params.push(filters.pais);
    paisFilter = `AND pa."codigo" = $${params.length}`;
  }

  const sql = `
    WITH match_counts AS (
      SELECT
        COUNT(*) FILTER (WHERE "resultadoLocal" IS NOT NULL) AS finished,
        COUNT(*) AS total
      FROM "Partido"
    ),
    user_stats AS (
      SELECT
        u.id AS usuario,
        u.nombre || ' ' || u.apellido AS nombre,
        pa.codigo AS pais,
        u."stickerCard",
        COALESCE(SUM(
          CASE WHEN p."resultadoLocal" IS NOT NULL AND (
            pr.ganador::text = CASE
              WHEN p."resultadoPenales" = true AND p."resultadoPenalesLocal" IS NOT NULL AND p."resultadoPenalesVisitante" IS NOT NULL THEN
                CASE
                  WHEN p."resultadoPenalesLocal" > p."resultadoPenalesVisitante" THEN 'LOCAL'
                  WHEN p."resultadoPenalesLocal" < p."resultadoPenalesVisitante" THEN 'VISITANTE'
                  ELSE 'EMPATE'
                END
              ELSE
                CASE
                  WHEN p."resultadoLocal" > p."resultadoVisitante" THEN 'LOCAL'
                  WHEN p."resultadoLocal" < p."resultadoVisitante" THEN 'VISITANTE'
                  ELSE 'EMPATE'
                END
            END
          ) THEN f.puntos ELSE 0 END
        ), 0)::int AS puntos,
        COALESCE(SUM(
          CASE WHEN p."resultadoLocal" IS NOT NULL AND (
            pr.ganador::text = CASE
              WHEN p."resultadoPenales" = true AND p."resultadoPenalesLocal" IS NOT NULL AND p."resultadoPenalesVisitante" IS NOT NULL THEN
                CASE
                  WHEN p."resultadoPenalesLocal" > p."resultadoPenalesVisitante" THEN 'LOCAL'
                  WHEN p."resultadoPenalesLocal" < p."resultadoPenalesVisitante" THEN 'VISITANTE'
                  ELSE 'EMPATE'
                END
              ELSE
                CASE
                  WHEN p."resultadoLocal" > p."resultadoVisitante" THEN 'LOCAL'
                  WHEN p."resultadoLocal" < p."resultadoVisitante" THEN 'VISITANTE'
                  ELSE 'EMPATE'
                END
            END
          ) THEN 1 ELSE 0 END
        ), 0)::int AS aciertos,
        COUNT(pr.id) FILTER (WHERE p."resultadoLocal" IS NOT NULL)::int AS "totalPronosticos",
        COUNT(pr.id)::int AS "totalPredicted"
      FROM "Usuario" u
      JOIN "Pais" pa ON pa.id = u."paisId"
      LEFT JOIN "Pronostico" pr ON pr."usuarioId" = u.id AND pr.deleted = false
      LEFT JOIN "Partido" p ON p.id = pr."partidoId"
      LEFT JOIN "Fase" f ON f.id = p."faseId"
      WHERE u.deleted = false AND u.blocked = false AND u.email != 'admin@openscore.com'
      ${paisFilter}
      GROUP BY u.id, u.nombre, u.apellido, pa.codigo, u."stickerCard"
    )
    SELECT
      us.*,
      mc.finished AS "totalPartidos",
      mc.total AS "totalMatches",
      CASE WHEN us."totalPronosticos" > 0
        THEN ROUND((us.aciertos::numeric / us."totalPronosticos") * 100)::int
        ELSE 0 END AS accuracy,
      CASE WHEN mc.finished > 0
        THEN ROUND((us."totalPronosticos"::numeric / mc.finished) * 100)::int
        ELSE 0 END AS coverage
    FROM user_stats us, match_counts mc
    ORDER BY us.puntos DESC
  `;

  const { rows } = await pool.query(sql, params);

  const rankings: RankingEntry[] = rows.map((r) => ({
    usuario: r.usuario,
    nombre: r.nombre,
    pais: r.pais,
    puntos: r.puntos,
    ranking: 0,
    stickerCard: r.stickerCard ?? null,
    aciertos: r.aciertos,
    totalPronosticos: r.totalPronosticos,
    totalPredicted: r.totalPredicted,
    totalPartidos: Number(r.totalPartidos),
    totalMatches: Number(r.totalMatches),
    accuracy: r.accuracy,
    coverage: r.coverage,
  }));

  let currentRank = 1;
  for (let i = 0; i < rankings.length; i++) {
    if (i > 0 && rankings[i].puntos === rankings[i - 1].puntos) {
      rankings[i].ranking = rankings[i - 1].ranking;
    } else {
      rankings[i].ranking = currentRank;
    }
    currentRank++;
  }

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

function getCachedRankingByPais(pais: string) {
  return unstable_cache(
    () => fetchRanking({ pais }),
    ["ranking", "pais", pais],
    { tags: ["ranking"], revalidate: 60 }
  )();
}

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
    return getCachedRankingByPais(filters.pais);
  }
  return _cachedGetAllRanking(filters?.size);
}

export async function getRankingForUsuario(
  usuarioId: number
): Promise<RankingEntry | null> {
  cacheRequests()?.add(1, { cache: "ranking-usuario" });
  return _cachedGetRankingForUsuario(usuarioId);
}
