"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function isAdmin(roles: string[]): boolean {
  return roles.includes("ADMIN");
}

export async function getBanners() {
  return prisma.banner.findMany({
    where: { deleted: false },
    orderBy: { orden: "asc" },
  });
}

export async function getActiveBanners() {
  return prisma.banner.findMany({
    where: { deleted: false, activo: true },
    orderBy: { orden: "asc" },
  });
}

export async function createBanner(formData: FormData) {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!isAdmin(roles)) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  const titulo = formData.get("titulo") as string | null;
  const linkUrl = formData.get("linkUrl") as string | null;

  if (!file) return { error: "No file provided" };

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." };
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { error: "File too large. Maximum size is 5 MB." };
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const maxOrden = await prisma.banner.aggregate({
    _max: { orden: true },
    where: { deleted: false },
  });

  await prisma.banner.create({
    data: {
      titulo: titulo || null,
      imagen: dataUrl,
      linkUrl: linkUrl || null,
      orden: (maxOrden._max.orden ?? 0) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return {};
}

export async function updateBanner(id: number, data: { titulo?: string; linkUrl?: string; activo?: boolean; orden?: number }) {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!isAdmin(roles)) return { error: "Unauthorized" };

  await prisma.banner.update({
    where: { id },
    data: {
      ...(data.titulo !== undefined && { titulo: data.titulo || null }),
      ...(data.linkUrl !== undefined && { linkUrl: data.linkUrl || null }),
      ...(data.activo !== undefined && { activo: data.activo }),
      ...(data.orden !== undefined && { orden: data.orden }),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return {};
}

export async function deleteBanner(id: number) {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!isAdmin(roles)) return { error: "Unauthorized" };

  await prisma.banner.update({
    where: { id },
    data: { deleted: true },
  });

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return {};
}

export async function reorderBanners(orderedIds: number[]) {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!isAdmin(roles)) return { error: "Unauthorized" };

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.banner.update({ where: { id }, data: { orden: index } })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return {};
}
