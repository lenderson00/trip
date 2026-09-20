import type { Metadata } from "next";
import { CanvasFxProvider } from "@/components/fx/canvas-fx";
import { PerforatedDivider } from "@/components/paper/perforated-divider";
import { Dicas } from "./_parts/dicas";
import { Hero } from "./_parts/hero";
import { Preparo } from "./_parts/preparo";
import { Roteiro } from "./_parts/roteiro";
import { Voos } from "./_parts/voos";

export const metadata: Metadata = {
  title: "Orlando · outubro de 2026",
  description:
    "O caderno de viagem da familia para Orlando: roteiro dia a dia, voos, bagagem, orcamento e anotacoes.",
};

export default async function OrlandoPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string }>;
}) {
  const { dia } = await searchParams;

  return (
    <CanvasFxProvider>
      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-8 sm:px-8">
        <Hero />

        <div className="space-y-20">
          <Voos />
          <Roteiro selectedDate={dia} />
          <Preparo />
          <Dicas />
        </div>

        <footer className="mt-24">
          <PerforatedDivider label="fim do caderno" />
          <p className="mt-6 text-center font-hand text-2xl text-caramel">
            bom, agora e so esperar outubro — decolagem 07OUT 06h05
          </p>
          <p className="mt-2 text-center text-xs text-ink-soft">
            Chega MCO 16h30 · volta 15OUT 22h00 · pouso GRU 16OUT 10h40.
          </p>
        </footer>
      </main>
    </CanvasFxProvider>
  );
}
