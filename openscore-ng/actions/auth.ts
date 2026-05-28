"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { AuthError } from "next-auth";
import { z } from "zod";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  pais: z.string().min(2),
});

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    email: formData.get("email"),
    password: formData.get("password"),
    pais: formData.get("pais"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { nombre, apellido, email, password, pais } = parsed.data;

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const paisRecord = await prisma.pais.findUnique({ where: { codigo: pais } });
  if (!paisRecord) {
    return { error: "Country not found" };
  }

  await prisma.usuario.create({
    data: {
      nombre,
      apellido,
      email,
      password: await hashPassword(password),
      paisId: paisRecord.id,
      roles: { create: [{ rol: "USUARIO" }] },
    },
  });

  redirect("/login");
}
