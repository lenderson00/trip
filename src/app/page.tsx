import Link from "next/link";
import { Doodle } from "@/components/paper/doodle";
import { PerforatedDivider } from "@/components/paper/perforated-divider";

const LINKS = [
  {
    href: "/orlando",
    titulo: "Orlando",
    texto: "Uma viagem inteira montada com o sistema",
    cor: "var(--blush)",
  },
  {
    href: "/ui",
    titulo: "Catalogo",
    texto: "Os 52 componentes, em tamanho real",
    cor: "var(--sage)",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20">
      <div className="text-center">
        <p className="font-hand text-2xl text-caramel">um sistema de papel</p>
        <h1 className="font-display text-6xl leading-none text-ink">Viagem</h1>
      </div>

      <PerforatedDivider className="w-full max-w-xs" scissors={false} />

      <nav className="flex flex-col gap-4 sm:flex-row">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group w-64 rounded-lg border border-ink/10 bg-white/60 p-6 transition-colors hover:bg-white"
          >
            <span
              className="inline-flex size-10 items-center justify-center rounded-full"
              style={{ backgroundColor: link.cor }}
            >
              <Doodle kind="arrow" size={24} color="var(--ink)" />
            </span>
            <span className="mt-3 block font-display text-2xl text-ink">
              {link.titulo}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
              {link.texto}
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
