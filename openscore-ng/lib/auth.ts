import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { authConfig } from "@/lib/auth.config";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const usuario = await prisma.usuario.findFirst({
          where: { email: email.trim(), deleted: false },
          include: { pais: true, roles: true },
        });

        if (!usuario) return null;
        if (usuario.blocked) return null;
        if (usuario.password !== await hashPassword(password)) return null;

        return {
          id: String(usuario.id),
          email: usuario.email,
          name: `${usuario.nombre} ${usuario.apellido}`,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          pais: usuario.pais.codigo,
          roles: usuario.roles.map((r) => r.rol),
        };
      },
    }),
  ],
});
