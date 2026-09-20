import type { Metadata } from "next";
import Link from "next/link";
import { CanvasFxProvider } from "@/components/fx/canvas-fx";
import { PerforatedDivider } from "@/components/paper/perforated-divider";
import { Dicas } from "./_parts/dicas";
import { Hero } from "./_parts/hero";
import { Lembrancas } from "./_parts/lembrancas";
import { Preparo } from "./_parts/preparo";
import { Roteiro } from "./_parts/roteiro";
import { Surpresa } from "./_parts/surpresa";
import { Voos } from "./_parts/voos";

export const metadata: Metadata = {
  title: "Orlando · fevereiro de 2027",
  description:
    "O caderno de viagem da familia para Orlando: roteiro dia a dia, voos, bagagem, orcamento e anotacoes.",
};

const NAV = [
  { id: "voos", label: "Voos" },
  { id: "roteiro", label: "Roteiro" },
  { id: "bagagem", label: "Bagagem" },
  { id: "orcamento", label: "Orcamento" },
  { id: "dicas", label: "Anotacoes" },
  { id: "lembrancas", label: "Lembrancas" },
  { id: "surpresa", label: "Surpresa" },
];

export default function OrlandoPage() {
  return (
    <CanvasFxProvider>
      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-8 sm:px-8">
        <nav className="mb-2 flex flex-wrap items-center gap-2">
          <Link
            href="/ui"
            className="rounded-full border border-ink/15 px-4 py-1.5 text-xs text-ink-soft transition-colors hover:bg-white/70 hover:text-ink"
          >
            ← catalogo
          </Link>
          <span className="mx-1 h-4 w-px bg-ink/15" />
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-ink/15 px-4 py-1.5 text-xs text-ink-soft transition-colors hover:bg-white/70 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Hero />

        <div className="space-y-20">
          <Voos />
          <Roteiro />
          <Preparo />
          <Dicas />
          <Lembrancas />
          <Surpresa />
        </div>

        <footer className="mt-24">
          <PerforatedDivider label="fim do caderno" />
          <p className="mt-6 text-center font-hand text-2xl text-caramel">
            bom, agora e so esperar fevereiro
          </p>
          <p className="mt-2 text-center text-xs text-ink-faint">
            Pagina de demonstracao do sistema Papel. Datas, precos e horarios
            sao ficticios.
          </p>
        </footer>
      </main>
    </CanvasFxProvider>
  );
}
