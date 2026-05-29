"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  pais: z.string().min(2),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1),
  password: z.string().min(6),
});

export async function getMiUsuario() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.usuario.findUniqueOrThrow({
    where: { id: parseInt(session.user.id) },
    include: { pais: true, roles: true },
  });
}

export async function updateUsuario(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = updateSchema.safeParse({
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    pais: formData.get("pais"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const paisRecord = await prisma.pais.findUnique({
    where: { codigo: parsed.data.pais },
  });
  if (!paisRecord) return { error: "Country not found" };

  await prisma.usuario.update({
    where: { id: parseInt(session.user.id) },
    data: {
      nombre: parsed.data.nombre,
      apellido: parsed.data.apellido,
      paisId: paisRecord.id,
    },
  });

  revalidatePath("/");
  return {};
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = passwordSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: parseInt(session.user.id) },
  });

  if (usuario.password !== await hashPassword(parsed.data.oldPassword)) {
    return { error: "Old password does not match" };
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { password: await hashPassword(parsed.data.password) },
  });

  return {};
}

export async function deletePaniniCard() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: parseInt(session.user.id) },
  });

  if (usuario.paniniCard) {
    const { unlink } = await import("fs/promises");
    const { join } = await import("path");
    const filePath = join(process.cwd(), "public", usuario.paniniCard);
    await unlink(filePath).catch(() => {});
  }

  await prisma.usuario.update({
    where: { id: parseInt(session.user.id) },
    data: { paniniCard: null },
  });

  revalidatePath("/profile");
  return {};
}

export async function getPaises() {
  return prisma.pais.findMany({
    where: { deleted: false },
    orderBy: { nombre: "asc" },
  });
}
