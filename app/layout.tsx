import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
  title: "Red Hat Openscore - World Cup prediction game",
  description: "Predict match results and compete with your friends",
  openGraph: {
    title: "Red Hat Openscore - World Cup prediction game",
    description: "Predict match results and compete with your friends",
    images: [
      {
        url: "/RH_OpenScore_web.png",
        width: 1024,
        height: 1024,
        alt: "Red Hat Openscore",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
