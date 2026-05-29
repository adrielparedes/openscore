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
  email: z.string().email().endsWith("@redhat.com", { message: "Only @redhat.com emails are allowed" }),
  password: z.string().min(6),
  pais: z.string().min(2),
  preguntaSecretaId: z.coerce.number().int().positive(),
  respuestaSecreta: z.string().min(1),
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
    preguntaSecretaId: formData.get("preguntaSecretaId"),
    respuestaSecreta: formData.get("respuestaSecreta"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { nombre, apellido, email, password, pais, preguntaSecretaId, respuestaSecreta } = parsed.data;

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
      preguntaSecretaId,
      respuestaSecreta: respuestaSecreta.trim().toLowerCase(),
      roles: { create: [{ rol: "USUARIO" }] },
    },
  });

  redirect("/login");
}

export async function getPreguntasSecretas() {
  return prisma.preguntaSecreta.findMany({
    where: { deleted: false },
    orderBy: { id: "asc" },
  });
}

export async function getForgotPasswordQuestion(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim();
  if (!email) return { error: "Email is required" };

  const usuario = await prisma.usuario.findFirst({
    where: { email, deleted: false },
    include: { preguntaSecreta: true },
  });

  if (!usuario || !usuario.preguntaSecreta) {
    return { error: "No account found with that email or no security question set" };
  }

  return { pregunta: usuario.preguntaSecreta.pregunta, email };
}

export async function resetPasswordAction(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim();
  const respuesta = (formData.get("respuesta") as string | null)?.trim().toLowerCase();
  const newPassword = formData.get("newPassword") as string | null;

  if (!email || !respuesta || !newPassword) {
    return { error: "All fields are required" };
  }
  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const usuario = await prisma.usuario.findFirst({
    where: { email, deleted: false },
  });

  if (!usuario) return { error: "Account not found" };

  if (!usuario.respuestaSecreta || usuario.respuestaSecreta !== respuesta) {
    return { error: "Incorrect answer to security question" };
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { password: await hashPassword(newPassword) },
  });

  return { success: true };
}
