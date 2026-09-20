"use client";

import { useState } from "react";
import { Crumple } from "@/components/fx/crumple";
import { PaperTear } from "@/components/fx/paper-tear";
import { ScissorReveal } from "@/components/fx/scissor-reveal";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PassportStamp } from "@/components/paper/passport-stamp";
import { PillLabel } from "@/components/paper/pill-label";
import { Sticker } from "@/components/paper/sticker";
import { Demo, Section } from "../_showcase/shell";

function Card({ title, body }: { title: string; body: string }) {
  return (
    <PaperSheet variant="white" className="h-44 rounded-sm p-5">
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </PaperSheet>
  );
}

function CrumpleDemo() {
  const [gone, setGone] = useState(false);
  const [crumpled, setCrumpled] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {gone ? (
        <button
          type="button"
          onClick={() => {
            setGone(false);
            setCrumpled(false);
          }}
          className="rounded-full bg-sage px-5 py-2 font-chunky text-sm text-ink"
        >
          trazer de volta
        </button>
      ) : (
        <>
          <Crumple
            crumpled={crumpled}
            seed="lixo"
            onDone={() => setGone(true)}
            className="w-full max-w-xs"
          >
            <Card
              title="Plano B"
              body="ir de trem ate Porto e voltar no mesmo dia"
            />
          </Crumple>
          <button
            type="button"
            onClick={() => setCrumpled(true)}
            className="rounded-full bg-poppy px-5 py-2 font-chunky text-sm text-white"
          >
            amassar e jogar fora
          </button>
        </>
      )}
    </div>
  );
}

export function FxSection() {
  return (
    <Section
      id="fx"
      kicker="html-in-canvas autoral"
      title="Efeitos de papel"
      description="Tres gestos proprios do tema, escritos como shaders WebGL2. Eles rodam em qualquer browser com WebGL2 — nao precisam de flag. Onde html-in-canvas existe, o papel rasgado e cortado carrega a interface viva; onde nao existe, o gesto e o mesmo sobre papel liso."
    >
      <Demo
        name="<PaperTear under />"
        note="Arraste pra baixo. A linha de rasgo vem de fbm, a borda ganha fibra e o pedaco de baixo cai girando com sombra propria."
      >
        <PaperTear
          seed="rasgo"
          className="w-full max-w-xs cursor-grab"
          under={
            <PaperSheet
              variant="kraft"
              className="flex h-44 items-center justify-center rounded-sm"
            >
              <PillLabel color="var(--mustard)">novo roteiro</PillLabel>
            </PaperSheet>
          }
        >
          <Card
            title="Roteiro antigo"
            body="arraste pra baixo pra rasgar e ver o que tem atras"
          />
        </PaperTear>
      </Demo>

      <Demo
        name="<ScissorReveal cut />"
        note="Segure e arraste. O traco vira mascara no shader e um limiar ruidoso deixa a beirada em dentes, com a fibra do miolo aparecendo."
      >
        <ScissorReveal
          className="h-44 w-full max-w-xs overflow-hidden rounded-sm"
          under={
            <PaperSheet
              variant="news"
              className="flex h-44 items-center justify-center rounded-sm"
            >
              <PassportStamp place="Sintra" date="18.03" size={110} seed="sc" />
            </PaperSheet>
          }
        >
          <PaperSheet
            variant="white"
            className="flex h-44 items-center justify-center rounded-sm"
          >
            <Sticker shape="pill" color="var(--blush)" rotate={-4}>
              recorte aqui
            </Sticker>
          </PaperSheet>
        </ScissorReveal>
      </Demo>

      <Demo
        name="<Crumple crumpled onDone />"
        note="Domain warp: o espaco da folha e dobrado sobre si mesmo e o gradiente da dobra vira luz de faceta. Encolher pareceria zoom."
      >
        <CrumpleDemo />
      </Demo>
    </Section>
  );
}
