import type { Metadata } from "next";
import { Caveat, DM_Sans, Fraunces, Fredoka } from "next/font/google";
import "./globals.css";

/* Voz principal: serifa de alto contraste com os eixos SOFT e WONK, que sao
 * o que tira o Fraunces do lugar-comum editorial. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

/* Voz fofa: so pra badge, adesivo e manchete arqueada. */
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

/* Anotacao de marcador. */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Papel — sistema de componentes de viagem",
  description:
    "Biblioteca de componentes com estetica de papel recortado para planejamento de viagem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fraunces.variable} ${fredoka.variable} ${caveat.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col items-center bg-paper-cream text-ink">
        {children}
      </body>
    </html>
  );
}
