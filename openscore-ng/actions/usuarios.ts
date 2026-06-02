"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { recordAction } from "@/lib/withMetrics";
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
  return recordAction("getMiUsuario", async () => {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    return prisma.usuario.findUnique({
      where: { id: parseInt(session.user.id) },
      include: { pais: true, roles: true },
    });
  });
}

export async function updateUsuario(formData: FormData) {
  return recordAction("updateUsuario", async () => {
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
  });
}

export async function updatePassword(formData: FormData) {
  return recordAction("updatePassword", async () => {
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
  });
}

export async function deleteStickerCard() {
  return recordAction("deleteStickerCard", async () => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    await prisma.usuario.update({
      where: { id: parseInt(session.user.id) },
      data: { stickerCard: null },
    });

    revalidatePath("/profile");
    return {};
  });
}

export async function getPaises() {
  return recordAction("getPaises", async () => {
    return prisma.pais.findMany({
      where: { deleted: false },
      orderBy: { nombre: "asc" },
    });
  });
}

export async function getAllUsuarios() {
  return recordAction("getAllUsuarios", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) throw new Error("Forbidden");

    return prisma.usuario.findMany({
      where: { deleted: false },
      omit: { stickerCard: true },
      include: { pais: true, roles: true },
      orderBy: [{ blocked: "desc" }, { createdAt: "desc" }],
    });
  });
}

export async function getUserStickerCard(usuarioId: number) {
  return recordAction("getUserStickerCard", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) return { error: "Forbidden" };

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { stickerCard: true },
    });

    return { stickerCard: usuario?.stickerCard ?? null };
  });
}

export async function toggleAdminRole(usuarioId: number) {
  return recordAction("toggleAdminRole", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) return { error: "Forbidden" };

    if (parseInt(session!.user!.id!) === usuarioId) {
      return { error: "You cannot modify your own admin role" };
    }

    const existing = await prisma.usuarioRol.findUnique({
      where: { usuarioId_rol: { usuarioId, rol: "ADMIN" } },
    });

    if (existing) {
      await prisma.usuarioRol.delete({
        where: { usuarioId_rol: { usuarioId, rol: "ADMIN" } },
      });
    } else {
      await prisma.usuarioRol.create({
        data: { usuarioId, rol: "ADMIN" },
      });
    }

    revalidatePath("/admin/usuarios");
    return { isAdmin: !existing };
  });
}

export async function toggleBlockUsuario(usuarioId: number) {
  return recordAction("toggleBlockUsuario", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) return { error: "Forbidden" };

    if (parseInt(session!.user!.id!) === usuarioId) {
      return { error: "You cannot block yourself" };
    }

    const usuario = await prisma.usuario.findUniqueOrThrow({
      where: { id: usuarioId },
    });

    const blocked = !usuario.blocked;
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { blocked },
    });

    revalidatePath("/admin/usuarios");
    return { blocked };
  });
}

export async function deleteUsuario(usuarioId: number) {
  return recordAction("deleteUsuario", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) return { error: "Forbidden" };

    if (parseInt(session!.user!.id!) === usuarioId) {
      return { error: "You cannot delete yourself" };
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { deleted: true, deletedAt: new Date() },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  });
}

export async function adminResetPassword(formData: FormData) {
  return recordAction("adminResetPassword", async () => {
    const session = await auth();
    const roles = (session?.user as any)?.roles ?? [];
    if (!roles.includes("ADMIN")) return { error: "Forbidden" };

    const usuarioId = parseInt(formData.get("usuarioId") as string);
    const newPassword = formData.get("newPassword") as string | null;

    if (!newPassword || newPassword.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { password: await hashPassword(newPassword) },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  });
}
