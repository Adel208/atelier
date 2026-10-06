import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier — Maison de coiffure à Paris",
  description: "Une vision contemporaine de la coiffure pour elle et lui. Coupe, matière et mouvement.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
