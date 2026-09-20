import { CrumpledSurface } from "@/components/paper/crumpled-surface";
import { CutOut } from "@/components/paper/cut-out";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PaperStack } from "@/components/paper/paper-stack";
import { Sticker } from "@/components/paper/sticker";
import { TornEdge } from "@/components/paper/torn-edge";
import { WashiTape } from "@/components/paper/washi-tape";
import { Demo, Section } from "../_showcase/shell";

export function SubstratoSection() {
  return (
    <Section
      id="substrato"
      kicker="a base de tudo"
      title="Substrato"
      description="As superficies. Todo o resto do sistema e montado em cima destes sete."
    >
      <Demo
        name="<PaperSheet variant />"
        note="Seis superficies. Pauta e quadriculado sao gradiente, nao imagem."
      >
        <div className="grid w-full grid-cols-3 gap-2">
          {(["cream", "white", "kraft", "news", "grid", "lined"] as const).map(
            (v) => (
              <PaperSheet
                key={v}
                variant={v}
                className="flex h-20 items-end rounded-sm p-2 shadow-[var(--shadow-lift)]"
              >
                <span className="font-mono text-[10px] text-ink-soft">{v}</span>
              </PaperSheet>
            ),
          )}
        </div>
      </Demo>

      <Demo
        name="<TornEdge sides depth />"
        note="O filtro cai so na camada de fundo — o texto por cima continua nitido."
      >
        <div className="w-full space-y-3">
          <TornEdge sides={["top", "bottom"]} seed="lisboa">
            <p className="px-5 py-5 text-center font-display text-base text-ink">
              rasgado em cima e embaixo
            </p>
          </TornEdge>
          <TornEdge
            seed="porto"
            depth={20}
            roughness={0.02}
            color="var(--blush)"
          >
            <p className="px-5 py-5 text-center font-display text-base text-ink">
              rasgado nos quatro lados
            </p>
          </TornEdge>
        </div>
      </Demo>

      <Demo
        name="<CrumpledSurface />"
        note="Vincos via feDiffuseLighting sobre ruido turbulence: luz direcional vira relevo."
      >
        <CrumpledSurface seed="porto" className="w-full rounded-sm">
          <p className="px-5 py-12 text-center font-display text-lg text-ink">
            papel amassado
          </p>
        </CrumpledSurface>
      </Demo>

      <Demo
        name="<WashiTape variant />"
        note="Pontas serrilhadas com desvio proprio: fita cortada a mao nunca termina reta."
      >
        <div className="flex flex-col items-center gap-3">
          <WashiTape variant="plain" rotate={-5} />
          <WashiTape variant="stripe" color="var(--sage)" rotate={3} />
          <WashiTape variant="checker" color="var(--dusk)" rotate={-2} />
          <WashiTape variant="dots" color="var(--mustard)" rotate={4} />
          <WashiTape variant="airmail" rotate={-3} width={150} />
        </div>
      </Demo>

      <Demo
        name="<Sticker shape peel />"
        note="Borda branca grossa e, opcional, um cantinho ja descolando."
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Sticker shape="pill" color="var(--blush)">
            Lisboa
          </Sticker>
          <Sticker shape="rounded" color="var(--sage)" peel rotate={4}>
            7 dias
          </Sticker>
          <Sticker shape="seal" color="var(--mustard)" rotate={-6}>
            novo
          </Sticker>
        </div>
      </Demo>

      <Demo
        name="<PaperStack layers />"
        note="Da peso sem recorrer a sombra pesada."
      >
        <PaperStack layers={3} seed="roma" className="w-52">
          <PaperSheet
            variant="white"
            className="rounded-sm p-6 shadow-[var(--shadow-lift)]"
          >
            <p className="font-display text-lg text-ink">3 folhas</p>
            <p className="mt-1 text-xs text-ink-soft">
              cada uma com rotacao propria
            </p>
          </PaperSheet>
        </PaperStack>
      </Demo>

      <Demo
        name="<CutOut outline />"
        note="O anel de drop-shadows acompanha a silhueta real, inclusive de PNG sem fundo."
      >
        <CutOut outline={4} rotate={-5}>
          <span className="block bg-terracotta px-7 py-5 font-chunky text-white [clip-path:polygon(8%_0,100%_6%,94%_100%,0_92%)]">
            recorte
          </span>
        </CutOut>
      </Demo>
    </Section>
  );
}
