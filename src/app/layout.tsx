import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";

import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComandaGo · POS para meseros",
  description:
    "POS táctil premium para tablets. Toma pedidos rápido, gestiona la comanda y envía a cocina en un toque.",
  openGraph: {
    title: "ComandaGo · POS para meseros",
    description: "POS táctil premium para restaurantes. Rápido, oscuro, sin fricción.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-[100dvh] antialiased">
        <NextTopLoader color="#F97316" showSpinner={false} height={3} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
