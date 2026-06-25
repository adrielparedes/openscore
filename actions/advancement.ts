"use server";

import { prisma } from "@/lib/prisma";
import { calcularGanador } from "@/lib/utils";
import { recordAction } from "@/lib/withMetrics";
import { auth } from "@/lib/auth";
import { revalidatePath, updateTag } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) throw new Error("Unauthorized");
}

export interface AdvancementResult {
  updated: number;
  details: string[];
}

/**
 * Replaces placeholder teams (1A, 2A, etc.) in Round of 32 matches
 * with the actual 1st and 2nd placed teams from group standings.
 * 3rd-placed team slots (3T*) are intentionally skipped.
 */
export async function advanceGroupWinners(): Promise<AdvancementResult> {
  return recordAction("advanceGroupWinners", async () => {
    await requireAdmin();

    const groupMatches = await prisma.partido.findMany({
      where: { deleted: false, fase: { codigo: "GRUPO" }, grupoId: { not: null } },
      include: { grupo: true },
    });

    const matchCountByGroup = new Map<string, { total: number; finished: number }>();
    for (const m of groupMatches) {
      if (!m.grupo) continue;
      const key = m.grupo.codigo;
      if (!matchCountByGroup.has(key)) matchCountByGroup.set(key, { total: 0, finished: 0 });
      const entry = matchCountByGroup.get(key)!;
      entry.total++;
      if (m.resultadoLocal !== null) entry.finished++;
    }

    const completeGroups = new Set<string>();
    const skippedGroups: string[] = [];
    for (const [codigo, counts] of matchCountByGroup) {
      if (counts.total > 0 && counts.finished === counts.total) {
        completeGroups.add(codigo);
      } else {
        skippedGroups.push(`${codigo.replace("GRUPO_", "")} (${counts.finished}/${counts.total})`);
      }
    }

    const standings = await prisma.standing.findMany({
      include: { equipo: true, grupo: true },
    });

    const standingsByGroup = new Map<string, typeof standings>();
    for (const s of standings) {
      if (!s.grupo?.codigo || s.grupo.codigo === "NONE") continue;
      if (!completeGroups.has(s.grupo.codigo)) continue;
      const key = s.grupo.codigo;
      if (!standingsByGroup.has(key)) standingsByGroup.set(key, []);
      standingsByGroup.get(key)!.push(s);
    }

    const groupPositions = new Map<string, number>();
    for (const [grupoCodigo, groupStandings] of standingsByGroup) {
      const sorted = [...groupStandings].sort(
        (a, b) =>
          b.puntos - a.puntos ||
          b.diferenciaGol - a.diferenciaGol ||
          b.golesAFavor - a.golesAFavor ||
          b.ganados - a.ganados
      );
      const letter = grupoCodigo.replace("GRUPO_", "");
      if (sorted.length >= 1) groupPositions.set(`1${letter}`, sorted[0].equipo.id);
      if (sorted.length >= 2) groupPositions.set(`2${letter}`, sorted[1].equipo.id);
    }

    const r32Matches = await prisma.partido.findMany({
      where: { deleted: false, fase: { codigo: "TREINTAIDOSAVOS" } },
      include: { local: true, visitante: true },
    });

    const details: string[] = [];
    let updated = 0;

    for (const match of r32Matches) {
      const updates: { localId?: number; visitanteId?: number } = {};

      const localCode = match.local.codigo;
      if (groupPositions.has(localCode)) {
        const realTeamId = groupPositions.get(localCode)!;
        if (realTeamId !== match.localId) {
          updates.localId = realTeamId;
        }
      }

      const visitanteCode = match.visitante.codigo;
      if (groupPositions.has(visitanteCode)) {
        const realTeamId = groupPositions.get(visitanteCode)!;
        if (realTeamId !== match.visitanteId) {
          updates.visitanteId = realTeamId;
        }
      }

      if (updates.localId || updates.visitanteId) {
        await prisma.partido.update({ where: { id: match.id }, data: updates });
        updated++;

        const localName = updates.localId
          ? (await prisma.equipo.findUnique({ where: { id: updates.localId } }))?.nombre
          : null;
        const visitanteName = updates.visitanteId
          ? (await prisma.equipo.findUnique({ where: { id: updates.visitanteId } }))?.nombre
          : null;

        const parts: string[] = [];
        if (localName) parts.push(`${localCode} → ${localName}`);
        if (visitanteName) parts.push(`${visitanteCode} → ${visitanteName}`);
        details.push(`Match ${match.id}: ${parts.join(", ")}`);
      }
    }

    if (skippedGroups.length > 0) {
      details.push(`Skipped incomplete groups: ${skippedGroups.join(", ")}`);
    }

    updateTag("matches");
    revalidatePath("/");
    revalidatePath("/forecast");
    revalidatePath("/admin/results");

    return { updated, details };
  });
}

/**
 * Propagates winners (and losers for semi-finals) from completed knockout
 * matches into subsequent rounds by replacing W{N} / L{N} placeholder teams.
 */
export async function advanceKnockoutWinners(): Promise<AdvancementResult> {
  return recordAction("advanceKnockoutWinners", async () => {
    await requireAdmin();

    const allMatches = await prisma.partido.findMany({
      where: { deleted: false },
      include: { local: true, visitante: true, fase: true },
    });

    const matchById = new Map<number, (typeof allMatches)[number]>();
    for (const m of allMatches) {
      matchById.set(m.id, m);
    }

    const KNOCKOUT_PHASES = new Set([
      "TREINTAIDOSAVOS",
      "OCTAVOS",
      "CUARTOS",
      "SEMI",
      "TERCER",
      "FINAL",
    ]);

    const winnerById = new Map<number, number>();
    const loserById = new Map<number, number>();

    for (const [id, match] of matchById) {
      if (!KNOCKOUT_PHASES.has(match.fase.codigo)) continue;
      if (match.resultadoLocal === null) continue;

      const ganador = calcularGanador(
        match.resultadoLocal,
        match.resultadoVisitante!,
        match.resultadoPenales,
        match.resultadoPenalesLocal,
        match.resultadoPenalesVisitante
      );

      if (ganador === "LOCAL") {
        winnerById.set(id, match.localId);
        loserById.set(id, match.visitanteId);
      } else if (ganador === "VISITANTE") {
        winnerById.set(id, match.visitanteId);
        loserById.set(id, match.localId);
      }
    }

    const knockoutMatches = allMatches.filter((m) =>
      KNOCKOUT_PHASES.has(m.fase.codigo)
    );

    const details: string[] = [];
    let updated = 0;

    for (const match of knockoutMatches) {
      const updates: { localId?: number; visitanteId?: number } = {};

      const localCode = match.local.codigo;
      const visitanteCode = match.visitante.codigo;

      const localWMatch = localCode.match(/^W(\d+)$/);
      const localLMatch = localCode.match(/^L(\d+)$/);
      const visitanteWMatch = visitanteCode.match(/^W(\d+)$/);
      const visitanteLMatch = visitanteCode.match(/^L(\d+)$/);

      if (localWMatch) {
        const refId = parseInt(localWMatch[1]);
        if (winnerById.has(refId)) {
          const realId = winnerById.get(refId)!;
          if (realId !== match.localId) updates.localId = realId;
        }
      } else if (localLMatch) {
        const refId = parseInt(localLMatch[1]);
        if (loserById.has(refId)) {
          const realId = loserById.get(refId)!;
          if (realId !== match.localId) updates.localId = realId;
        }
      }

      if (visitanteWMatch) {
        const refId = parseInt(visitanteWMatch[1]);
        if (winnerById.has(refId)) {
          const realId = winnerById.get(refId)!;
          if (realId !== match.visitanteId) updates.visitanteId = realId;
        }
      } else if (visitanteLMatch) {
        const refId = parseInt(visitanteLMatch[1]);
        if (loserById.has(refId)) {
          const realId = loserById.get(refId)!;
          if (realId !== match.visitanteId) updates.visitanteId = realId;
        }
      }

      if (updates.localId || updates.visitanteId) {
        await prisma.partido.update({ where: { id: match.id }, data: updates });
        updated++;

        const localName = updates.localId
          ? (await prisma.equipo.findUnique({ where: { id: updates.localId } }))?.nombre
          : null;
        const visitanteName = updates.visitanteId
          ? (await prisma.equipo.findUnique({ where: { id: updates.visitanteId } }))?.nombre
          : null;

        const parts: string[] = [];
        if (localName) parts.push(`${localCode} → ${localName}`);
        if (visitanteName) parts.push(`${visitanteCode} → ${visitanteName}`);
        details.push(`Match ${match.id}: ${parts.join(", ")}`);
      }
    }

    updateTag("matches");
    revalidatePath("/");
    revalidatePath("/forecast");
    revalidatePath("/admin/results");

    return { updated, details };
  });
}
