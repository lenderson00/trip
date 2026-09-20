"use client";

import { useState } from "react";
import { DustMotes } from "@/components/fx/dust-motes";
import { FoilShine } from "@/components/fx/foil-shine";
import { InkBleed } from "@/components/fx/ink-bleed";
import { LightLeak } from "@/components/fx/light-leak";
import { PaperScraps } from "@/components/fx/paper-scraps";
import { ScratchOff } from "@/components/fx/scratch-off";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PassportStamp } from "@/components/paper/passport-stamp";
import { PhotoFrame } from "@/components/paper/photo-frame";
import { PillLabel } from "@/components/paper/pill-label";
import { Sticker } from "@/components/paper/sticker";
import { Demo, Section } from "../_showcase/shell";

function ScratchDemo() {
  const [found, setFound] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <ScratchOff
        seed="destino"
        brush={38}
        onReveal={() => setFound(true)}
        className="w-56 overflow-hidden rounded-sm"
      >
        <PaperSheet
          variant="kraft"
          className="flex h-40 flex-col items-center justify-center gap-2 rounded-sm"
        >
          <p className="font-hand text-xl text-caramel">seu destino e</p>
          <p className="font-display text-3xl text-ink">Lisboa</p>
        </PaperSheet>
      </ScratchOff>
      <p className="font-body text-xs text-ink-soft">
        {found ? "revelado!" : "arraste pra raspar"}
      </p>
    </div>
  );
}

export function AmbienteSection() {
  return (
    <Section
      id="ambiente"
      kicker="luz, tinta e ar"
      title="Ambiente"
      description="Seis camadas de WebGL pra dar atmosfera. Todas sao overlay: o conteudo embaixo continua HTML normal e interativo, e nenhuma depende de flag."
    >
      <Demo
        name="<LightLeak />"
        note="Feito pra foto: casa o site com a fotografia velada do moodboard sem tratar cada imagem na mao. Entra em screen, so soma luz."
      >
        <LightLeak seed="leak" className="inline-block">
          <PhotoFrame
            src="/photos/mar.jpg"
            alt="Barco ao entardecer"
            width={200}
            rotate={0}
          />
        </LightLeak>
      </Demo>

      <Demo
        name="<DustMotes beam />"
        note="Tres camadas em velocidades diferentes dao profundidade. O feixe e o que torna a poeira crivel — ela so aparece onde a luz entra."
        dark
      >
        <DustMotes seed="poeira" density={1.2} className="w-full">
          <div className="flex h-44 items-center justify-center rounded-sm bg-ink/80">
            <p className="font-display text-2xl text-paper-cream">
              tarde parada
            </p>
          </div>
        </DustMotes>
      </Demo>

      <Demo
        name="<InkBleed />"
        note="Clique. O raio cresce com a raiz do tempo — liquido em papel abre rapido e desacelera na fibra. As manchas ficam."
      >
        <InkBleed seed="tinta" spread={46} opacity={0.72} className="w-full">
          <PaperSheet
            variant="lined"
            className="flex h-44 items-center justify-center rounded-sm"
          >
            <p className="font-hand text-2xl text-caramel">clique no papel</p>
          </PaperSheet>
        </InkBleed>
      </Demo>

      <Demo
        name="<FoilShine />"
        note="O arco-iris e uma fase lida com defasagem por canal, nao um degrade. Mova o mouse: o cartao inclina e a cor troca."
      >
        <FoilShine seed="foil" className="inline-block">
          <div className="flex items-center gap-3 rounded-lg bg-ink/90 px-6 py-5">
            <Sticker shape="seal" color="var(--mustard)" rotate={-8}>
              VIP
            </Sticker>
            <PassportStamp
              place="Lisboa"
              date="12.03"
              size={84}
              color="var(--paper-cream)"
              seed="fs"
            />
          </div>
        </FoilShine>
      </Demo>

      <Demo
        name="<ScratchOff onReveal />"
        note="Limiar granulado: a tinta sai em floquinhos, nao numa linha lisa. onReveal dispara uma vez passado o limiar."
      >
        <ScratchDemo />
      </Demo>

      <Demo
        name="<PaperScraps />"
        note="Cada retalho gira no proprio eixo e achata periodicamente — e o que separa papel girando no ar de quadradinho descendo."
      >
        <PaperScraps seed="festa" density={1.1} className="w-full">
          <PaperSheet
            variant="cream"
            className="flex h-44 flex-col items-center justify-center gap-2 rounded-sm"
          >
            <PillLabel color="var(--sage)" size="lg">
              viagem fechada
            </PillLabel>
            <p className="font-hand text-xl text-caramel">12 a 19 de marco</p>
          </PaperSheet>
        </PaperScraps>
      </Demo>
    </Section>
  );
}
