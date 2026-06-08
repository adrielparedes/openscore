"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export interface FaseDTO {
  id: number;
  codigo: string;
  nombre: string;
  puntos: number;
}

export async function getFases(): Promise<FaseDTO[]> {
  const fases = await prisma.fase.findMany({
    where: { deleted: false },
    orderBy: { puntos: "asc" },
    select: { id: true, codigo: true, nombre: true, puntos: true },
  });
  return fases;
}

export async function updateFasePuntos(
  faseId: number,
  puntos: number
): Promise<FaseDTO> {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) throw new Error("Unauthorized");

  if (!Number.isInteger(puntos) || puntos < 0 || puntos > 100) {
    throw new Error("Points must be an integer between 0 and 100");
  }

  const fase = await prisma.fase.update({
    where: { id: faseId },
    data: { puntos },
    select: { id: true, codigo: true, nombre: true, puntos: true },
  });

  revalidateTag("ranking", "max");

  return fase;
}
