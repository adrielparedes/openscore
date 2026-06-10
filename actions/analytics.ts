"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calcularGanador } from "@/lib/utils";
import { recordAction } from "@/lib/withMetrics";
import { unstable_cache } from "next/cache";

const activeUserWhere = {
  deleted: false,
  blocked: false,
  email: { not: "admin@openscore.com" },
} as const;

export type HomeStats = {
  activeUsers: number;
  predictionsMade: number;
};

const _cachedGetHomeStats = unstable_cache(
  async (): Promise<HomeStats> => {
    const [activeUsers, predictionsMade] = await Promise.all([
      prisma.usuario.count({ where: activeUserWhere }),
      prisma.pronostico.count({ where: { deleted: false } }),
    ]);
    return { activeUsers, predictionsMade };
  },
  ["homeStats"],
  { tags: ["ranking"], revalidate: false }
);

export async function getHomeStats(): Promise<HomeStats> {
  return recordAction("getHomeStats", () => _cachedGetHomeStats());
}

function calcularPuntosUsuario(
  pronosticos: Array<{
    ganador: string;
    partido: {
      resultadoLocal: number | null;
      resultadoVisitante: number | null;
      resultadoPenales: boolean;
      resultadoPenalesLocal: number | null;
      resultadoPenalesVisitante: number | null;
      fase: { puntos: number };
    };
  }>
): number {
  return pronosticos.reduce((total, p) => {
    const partido = p.partido;
    if (partido.resultadoLocal === null) return total;
    const ganador = calcularGanador(
      partido.resultadoLocal,
      partido.resultadoVisitante!,
      partido.resultadoPenales,
      partido.resultadoPenalesLocal,
      partido.resultadoPenalesVisitante
    );
    const acertado = p.ganador === ganador;
    return total + (acertado ? partido.fase.puntos : 0);
  }, 0);
}

export type DailyRegistration = {
  date: string;
  total: number;
  byCountry: Record<string, number>;
};

export type AnalyticsData = {
  users: {
    total: number;
    active: number;
    blocked: number;
    deleted: number;
  };
  registrationsByCountry: Array<{
    countryName: string;
    countryCode: string;
    count: number;
  }>;
  dailyRegistrations: {
    days: DailyRegistration[];
    countries: Array<{ code: string; name: string }>;
  };
  predictions: {
    total: number;
    totalPossible: number;
    coveragePercent: number;
  };
  matchesProgress: {
    total: number;
    withResults: number;
    percent: number;
  };
  pointsDistribution: {
    average: number;
    median: number;
    max: number;
  };
  predictionsPerMatch: Array<{
    partidoId: number;
    label: string;
    fase: string;
    count: number;
    percentOfUsers: number;
  }>;
};

export async function getAnalytics(): Promise<AnalyticsData> {
  return recordAction("getAnalytics", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) throw new Error("Unauthorized");

    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      deletedUsers,
      totalPredictions,
      totalMatches,
      matchesWithResults,
      countryGroups,
      partidos,
      pronosticoCounts,
      usuariosConPronosticos,
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({ where: activeUserWhere }),
      prisma.usuario.count({ where: { deleted: false, blocked: true } }),
      prisma.usuario.count({ where: { deleted: true } }),
      prisma.pronostico.count({ where: { deleted: false } }),
      prisma.partido.count({ where: { deleted: false } }),
      prisma.partido.count({
        where: { deleted: false, resultadoLocal: { not: null } },
      }),
      prisma.usuario.groupBy({
        by: ["paisId"],
        where: { deleted: false },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.partido.findMany({
        where: { deleted: false },
        include: { local: true, visitante: true, fase: true },
        orderBy: { dia: "asc" },
      }),
      prisma.pronostico.groupBy({
        by: ["partidoId"],
        where: { deleted: false },
        _count: { id: true },
      }),
      prisma.usuario.findMany({
        where: activeUserWhere,
        include: {
          pronosticos: {
            where: { deleted: false },
            include: {
              partido: { include: { fase: true } },
            },
          },
        },
      }),
    ]);

    const paisIds = countryGroups.map((g) => g.paisId);
    const paises = await prisma.pais.findMany({
      where: { id: { in: paisIds } },
    });
    const paisMap = new Map(paises.map((p) => [p.id, p]));

    const registrationsByCountry = countryGroups.map((g) => {
      const pais = paisMap.get(g.paisId);
      return {
        countryName: pais?.nombre ?? "Unknown",
        countryCode: pais?.codigo ?? "—",
        count: g._count.id,
      };
    });

    const allUsers = await prisma.usuario.findMany({
      where: { deleted: false },
      select: { createdAt: true, paisId: true },
      orderBy: { createdAt: "asc" },
    });

    const dailyMap = new Map<string, Map<number, number>>();
    for (const u of allUsers) {
      const day = u.createdAt.toISOString().slice(0, 10);
      if (!dailyMap.has(day)) dailyMap.set(day, new Map());
      const countryMap = dailyMap.get(day)!;
      countryMap.set(u.paisId, (countryMap.get(u.paisId) ?? 0) + 1);
    }

    const dailyRegistrations = {
      days: Array.from(dailyMap.entries()).map(([date, countryMap]) => {
        const byCountry: Record<string, number> = {};
        let total = 0;
        for (const [paisId, count] of countryMap) {
          const pais = paisMap.get(paisId);
          const code = pais?.codigo ?? "OTHER";
          byCountry[code] = (byCountry[code] ?? 0) + count;
          total += count;
        }
        return { date, total, byCountry };
      }),
      countries: registrationsByCountry.map((r) => ({
        code: r.countryCode,
        name: r.countryName,
      })),
    };

    const totalPossible = activeUsers * totalMatches;
    const coveragePercent =
      totalPossible > 0
        ? Math.round((totalPredictions / totalPossible) * 1000) / 10
        : 0;

    const countMap = new Map(
      pronosticoCounts.map((p) => [p.partidoId, p._count.id])
    );

    const predictionsPerMatch = partidos.map((p) => {
      const count = countMap.get(p.id) ?? 0;
      const percentOfUsers =
        activeUsers > 0 ? Math.round((count / activeUsers) * 1000) / 10 : 0;
      return {
        partidoId: p.id,
        label: `${p.local.nombre} vs ${p.visitante.nombre}`,
        fase: p.fase.nombre,
        count,
        percentOfUsers,
      };
    });

    const points = usuariosConPronosticos.map((u) =>
      calcularPuntosUsuario(u.pronosticos)
    );
    const sorted = [...points].sort((a, b) => a - b);
    const average =
      points.length > 0
        ? Math.round(
            (points.reduce((sum, p) => sum + p, 0) / points.length) * 10
          ) / 10
        : 0;
    const median =
      sorted.length > 0
        ? sorted.length % 2 === 0
          ? Math.round(
              ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) /
                2) *
                10
            ) / 10
          : sorted[Math.floor(sorted.length / 2)]
        : 0;
    const max = sorted.length > 0 ? sorted[sorted.length - 1] : 0;

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
        deleted: deletedUsers,
      },
      registrationsByCountry,
      dailyRegistrations,
      predictions: {
        total: totalPredictions,
        totalPossible,
        coveragePercent,
      },
      matchesProgress: {
        total: totalMatches,
        withResults: matchesWithResults,
        percent:
          totalMatches > 0
            ? Math.round((matchesWithResults / totalMatches) * 1000) / 10
            : 0,
      },
      pointsDistribution: { average, median, max },
      predictionsPerMatch,
    };
  });
}
