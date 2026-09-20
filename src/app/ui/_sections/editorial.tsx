import { ArcText } from "@/components/paper/arc-text";
import { DashedPath } from "@/components/paper/dashed-path";
import { Doodle, type DoodleKind } from "@/components/paper/doodle";
import { Highlighter } from "@/components/paper/highlighter";
import { NewsprintStrip } from "@/components/paper/newsprint-strip";
import { PillLabel } from "@/components/paper/pill-label";
import { PullQuote } from "@/components/paper/pull-quote";
import { RansomHeadline } from "@/components/paper/ransom-headline";
import { Demo, Section } from "../_showcase/shell";

const KINDS: DoodleKind[] = [
  "arrow",
  "star",
  "circle",
  "underline",
  "spark",
  "heart",
  "swirl",
  "check",
];

export function EditorialSection() {
  return (
    <Section
      id="editorial"
      kicker="voz de revista"
      title="Editorial"
      description="Manchete, citacao, rabisco e recorte de jornal: o que da o tom de publicacao impressa."
    >
      <Demo
        name="<ArcText curve />"
        wide
        note="textPath sobre curva quadratica de verdade — o texto continua selecionavel e legivel por leitor de tela."
      >
        <div className="w-full max-w-xl">
          <ArcText curve={30}>TRAVEL</ArcText>
          <ArcText
            curve={-18}
            font="display"
            color="var(--terracotta)"
            size={62}
          >
            roteiro
          </ArcText>
        </div>
      </Demo>

      <Demo
        name="<RansomHeadline />"
        note="Papel, fonte e inclinacao de cada letra saem da mesma seed."
      >
        <RansomHeadline seed="viagem" size={38}>
          FERIAS
        </RansomHeadline>
      </Demo>

      <Demo
        name="<Highlighter />"
        note="Traco irregular em multiply, nao retangulo de fundo."
      >
        <p className="max-w-xs text-center font-display text-xl leading-relaxed text-ink">
          o voo sai <Highlighter seed="a">as seis da manha</Highlighter>, entao
          nada de{" "}
          <Highlighter color="var(--sage)" seed="b">
            dormir tarde
          </Highlighter>
          .
        </p>
      </Demo>

      <Demo
        name="<PullQuote />"
        note="Aspas grandes, serifa e marca-texto opcional."
      >
        <PullQuote author="caderno de bordo" highlight seed="q">
          A melhor parte da viagem foi a que ninguem planejou.
        </PullQuote>
      </Demo>

      <Demo
        name="<Doodle kind />"
        note="Oito rabiscos. Nenhuma curva e simetrica."
      >
        <div className="grid grid-cols-4 gap-3">
          {KINDS.map((k, i) => (
            <Doodle
              key={k}
              kind={k}
              size={52}
              color="var(--terracotta)"
              rotate={i * 7 - 20}
            />
          ))}
        </div>
      </Demo>

      <Demo
        name="<DashedPath tip />"
        note="O aviao gira pela tangente real da curva, entao sempre aponta pra frente."
      >
        <div className="w-full space-y-2">
          <DashedPath color="var(--ink)" />
          <DashedPath tip="pin" curve={-40} color="var(--poppy)" height={90} />
        </div>
      </Demo>

      <Demo
        name="<NewsprintStrip />"
        note="Linhas falsas, nao texto: ninguem le, e nao polui o leitor de tela."
      >
        <div className="flex items-start gap-3">
          <NewsprintStrip seed="n1" headline="Partida" />
          <NewsprintStrip seed="n2" rotate={4} lines={8} width={150} />
        </div>
      </Demo>

      <Demo
        name="<PillLabel size />"
        note="O cabecalho de dia da ref. 1 e o badge de ano da ref. 2 sao o mesmo componente."
      >
        <div className="flex flex-col items-center gap-3">
          <PillLabel size="lg">Dia 01 — Lisboa</PillLabel>
          <PillLabel color="var(--sage)">Dia 02 — Sintra</PillLabel>
          <PillLabel size="sm" color="var(--paper-cream)" font="body">
            2026
          </PillLabel>
        </div>
      </Demo>
    </Section>
  );
}
