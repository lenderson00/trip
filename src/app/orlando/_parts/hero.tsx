"use client";

import { DustMotes } from "@/components/fx/dust-motes";
import { LightLeak } from "@/components/fx/light-leak";
import { ArcText } from "@/components/paper/arc-text";
import { DashedPath } from "@/components/paper/dashed-path";
import { Doodle } from "@/components/paper/doodle";
import { PhotoFrame } from "@/components/paper/photo-frame";
import { PillLabel } from "@/components/paper/pill-label";
import { Sticker } from "@/components/paper/sticker";
import { TornCircle } from "@/components/paper/torn-circle";
import { WashiTape } from "@/components/paper/washi-tape";
import { Cronometro } from "./cronometro";
import { VIAGEM } from "./dados";

/**
 * Capa da viagem.
 *
 * A colagem e montada com posicionamento absoluto sobre uma caixa de altura
 * fixa no desktop; no mobile tudo vira fluxo normal, porque colagem rotacionada
 * em 375px estoura layout na hora.
 */
export function Hero() {
  return (
    <header className="relative mb-16 pt-6">
      <DashedPath
        width={300}
        height={120}
        curve={64}
        color="var(--ink-soft)"
        className="pointer-events-none absolute -left-6 top-0 hidden w-64 opacity-70 lg:block"
        label="Rota de Sao Paulo ate Orlando"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="font-hand text-2xl text-caramel">
          o caderno da viagem de
        </p>
        <ArcText curve={30} size={104} color="var(--sage)" className="-mt-1">
          ORLANDO
        </ArcText>
        <p className="-mt-3 font-display text-xl text-ink-soft">
          {VIAGEM.entrada} a {VIAGEM.saida}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <PillLabel color="var(--blush)">{VIAGEM.noites} noites</PillLabel>
          <PillLabel color="var(--sage)">{VIAGEM.viajantes}</PillLabel>
          <PillLabel size="sm" color="var(--paper-white)" font="body">
            {VIAGEM.pais}
          </PillLabel>
        </div>
      </div>

      <DustMotes
        seed="capa-poeira"
        density={0.8}
        beam={0.65}
        className="relative mt-10 lg:mt-4"
      >
        <div className="relative flex flex-wrap items-center justify-center gap-6 lg:block lg:h-[420px]">
          <LightLeak
            seed="capa"
            intensity={0.7}
            behind={false}
            className="inline-block lg:absolute lg:left-1/2 lg:top-10 lg:-translate-x-1/2"
          >
            <PhotoFrame
              src="/photos/castelo-disney.jpg"
              alt="Castelo da Cinderela no Magic Kingdom"
              width={330}
              ratio={1.34}
              rotate={-2}
            >
              <WashiTape
                variant="airmail"
                width={100}
                height={26}
                rotate={-16}
                className="absolute -left-6 -top-3"
              />
              <p className="mt-3 text-center font-hand text-xl text-ink-soft">
                14OUT · o castelo
              </p>
            </PhotoFrame>
          </LightLeak>

          <TornCircle
            src="/photos/montanha-russa.jpg"
            alt="Montanha-russa contra o por do sol"
            size={150}
            seed="c1"
            rotate={-7}
            className="lg:absolute lg:left-[6%] lg:top-16"
          />

          <TornCircle
            src="/photos/hogwarts.jpg"
            alt="Castelo de Hogwarts a noite"
            size={124}
            seed="c2"
            rotate={9}
            className="lg:absolute lg:right-[8%] lg:top-8"
          />

          <Sticker
            shape="seal"
            color="var(--mustard)"
            rotate={-12}
            className="lg:absolute lg:right-[16%] lg:top-56"
          >
            8 noites
          </Sticker>

          <Doodle
            kind="star"
            size={46}
            color="var(--terracotta)"
            rotate={-14}
            className="hidden lg:absolute lg:left-[22%] lg:top-4 lg:block"
          />
          <Doodle
            kind="swirl"
            size={58}
            color="var(--caramel)"
            rotate={12}
            className="hidden lg:absolute lg:right-[4%] lg:top-60 lg:block"
          />
        </div>
      </DustMotes>

      <div className="mx-auto mt-10 flex justify-center lg:mt-6">
        <Cronometro />
      </div>
    </header>
  );
}
