import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
  title: "Red Hat Openscore - World Cup prediction game",
  description: "Predict match results and compete with your friends",
  openGraph: {
    type: "website",
    siteName: "Red Hat Openscore",
    title: "Red Hat Openscore - World Cup prediction game",
    description: "Predict match results and compete with your friends",
    images: [
      {
        url: "/RH_OpenScore_web.png",
        width: 1080,
        height: 1080,
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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground antialiased">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
