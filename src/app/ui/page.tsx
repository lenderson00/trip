import { CanvasFxProvider } from "@/components/fx/canvas-fx";
import { AmbienteSection } from "./_sections/ambiente";
import { CanvasSection } from "./_sections/canvas";
import { EditorialSection } from "./_sections/editorial";
import { EnfeitesSection } from "./_sections/enfeites";
import { FotoSection } from "./_sections/foto";
import { FxSection } from "./_sections/fx";
import { SubstratoSection } from "./_sections/substrato";
import { ViagemSection } from "./_sections/viagem";
import { CanvasBanner } from "./_showcase/canvas-banner";

const NAV = [
  { id: "substrato", label: "Substrato" },
  { id: "editorial", label: "Editorial" },
  { id: "foto", label: "Foto" },
  { id: "viagem", label: "Viagem" },
  { id: "enfeites", label: "Enfeites" },
  { id: "ambiente", label: "Ambiente" },
  { id: "fx", label: "Efeitos de papel" },
  { id: "canvas", label: "Canvas UI" },
];

export default function UiPage() {
  return (
    <CanvasFxProvider>
      <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <header className="mb-8">
          <p className="font-hand text-2xl text-caramel">catalogo vivo</p>
          <h1 className="font-display text-5xl text-ink">Papel</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Todos os componentes do sistema, em tamanho real. Cada demo e o
            componente de verdade, com as props que voce usaria.
          </p>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
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

        <div className="mb-12">
          <CanvasBanner />
        </div>

        <div className="space-y-14">
          <SubstratoSection />
          <EditorialSection />
          <FotoSection />
          <ViagemSection />
          <EnfeitesSection />
          <AmbienteSection />
          <FxSection />
          <CanvasSection />
        </div>
      </main>
    </CanvasFxProvider>
  );
}
