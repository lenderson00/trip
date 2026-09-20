import { Clouds } from "@/components/canvasui/Clouds";
import { Droplets } from "@/components/canvasui/Droplets";
import { Glass } from "@/components/canvasui/Glass";
import { Ripple } from "@/components/canvasui/Ripple";
import { CanvasSlot } from "@/components/fx/canvas-slot";
import { FoldedMap } from "@/components/paper/folded-map";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PullQuote } from "@/components/paper/pull-quote";
import { Demo, Section } from "../_showcase/shell";

function Panel({ title, note }: { title: string; note: string }) {
  return (
    <PaperSheet
      variant="white"
      className="flex h-44 flex-col justify-center rounded-sm p-5"
    >
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{note}</p>
    </PaperSheet>
  );
}

export function CanvasSection() {
  const dropletsContent = (
    <Panel
      title="Chuva na janela"
      note="as gotas escorrem e refratam a pagina"
    />
  );
  const cloudsContent = (
    <Panel title="Neblina" note="o cursor abre caminho no vapor" />
  );
  const rippleContent = (
    <Panel title="Mancha de tinta" note="clique pra soltar a gota" />
  );

  return (
    <Section
      id="canvas"
      kicker="vendorizado do canvasui.dev"
      title="Canvas UI"
      description="Quatro efeitos do registry, todos overlay de GPU em WebGL. O codigo vive em components/canvasui/ e nao deve ser editado a mao — pra atualizar, rode o comando de install de novo."
    >
      <Demo
        name="<Droplets />"
        note="Gotas de chuva escorrendo e refratando a pagina."
      >
        <CanvasSlot
          plain={dropletsContent}
          effect={
            <Droplets className="w-full max-w-xs">{dropletsContent}</Droplets>
          }
        />
      </Demo>

      <Demo
        name="<Glass />"
        note="Lente que segue o cursor — uma lupa de verdade sobre o mapa."
      >
        <CanvasSlot
          plain={
            <FoldedMap
              height={176}
              pins={[{ x: 34, y: 48, label: "Alfama" }]}
            />
          }
          effect={
            <Glass className="w-full max-w-xs">
              <FoldedMap
                height={176}
                pins={[{ x: 34, y: 48, label: "Alfama" }]}
              />
            </Glass>
          }
        />
      </Demo>

      <Demo
        name="<Clouds />"
        note="Neblina que borra e refrata, partida pelo cursor."
      >
        <CanvasSlot
          plain={cloudsContent}
          effect={<Clouds className="w-full max-w-xs">{cloudsContent}</Clouds>}
        />
      </Demo>

      <Demo name="<Ripple />" note="Ondas de tinta a cada clique.">
        <CanvasSlot
          plain={rippleContent}
          effect={<Ripple className="w-full max-w-xs">{rippleContent}</Ripple>}
        />
      </Demo>

      <Demo
        name="Composicao"
        wide
        note="Os efeitos do registry recebem componentes de papel como conteudo — e essa a ideia do sistema."
      >
        <CanvasSlot
          plain={
            <PaperSheet variant="cream" className="w-full rounded-sm p-10">
              <PullQuote author="caderno de bordo" highlight seed="comp">
                O papel aguenta qualquer plano. O canvas faz ele se mexer.
              </PullQuote>
            </PaperSheet>
          }
          effect={
            <Droplets className="w-full">
              <PaperSheet variant="cream" className="w-full rounded-sm p-10">
                <PullQuote author="caderno de bordo" highlight seed="comp">
                  O papel aguenta qualquer plano. O canvas faz ele se mexer.
                </PullQuote>
              </PaperSheet>
            </Droplets>
          }
        />
      </Demo>
    </Section>
  );
}
