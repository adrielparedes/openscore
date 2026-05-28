import type { NextAuthConfig } from "next-auth";

/** Edge-safe auth config — no Node.js / Prisma imports.
 *  Used by middleware for session checking only. */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nombre = (user as any).nombre;
        token.apellido = (user as any).apellido;
        token.pais = (user as any).pais;
        token.roles = (user as any).roles;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).nombre = token.nombre;
        (session.user as any).apellido = token.apellido;
        (session.user as any).pais = token.pais;
        (session.user as any).roles = token.roles;
      }
      return session;
    },
  },
  providers: [],
};
