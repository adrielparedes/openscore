"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPosts(onlyPublished = true) {
  return prisma.post.findMany({
    where: {
      deleted: false,
      ...(onlyPublished ? { status: "PUBLISHED" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPost(formData: FormData) {
  const session = await auth();
  const roles = (session?.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) return { error: "Unauthorized" };

  await prisma.post.create({
    data: {
      titulo: formData.get("titulo") as string,
      contenido: formData.get("contenido") as string,
      autor: session!.user!.name ?? "Admin",
      status: "PUBLISHED",
    },
  });

  revalidatePath("/");
  return {};
}
