"use client";

import { DustMotes } from "@/components/fx/dust-motes";
import { InkBleed } from "@/components/fx/ink-bleed";
import { LightLeak } from "@/components/fx/light-leak";
import { CoffeeStain } from "@/components/paper/coffee-stain";
import { DogEar } from "@/components/paper/dog-ear";
import { Doodle } from "@/components/paper/doodle";
import { Highlighter } from "@/components/paper/highlighter";
import { InkSplatter } from "@/components/paper/ink-splatter";
import { NewsprintStrip } from "@/components/paper/newsprint-strip";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PullQuote } from "@/components/paper/pull-quote";
import { SpiralNotebook } from "@/components/paper/spiral-notebook";
import { Staple } from "@/components/paper/staple";
import { Sticker } from "@/components/paper/sticker";
import { WashiTape } from "@/components/paper/washi-tape";
import { DICAS } from "./dados";
import { Secao } from "./shell";

export function Dicas() {
  return (
    <Secao id="dicas" kicker="o que aprendemos" titulo="Anotacoes">
      <DustMotes
        seed="anotacoes"
        density={0.75}
        beam={0.55}
        className="relative"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="relative">
            <WashiTape
              variant="airmail"
              width={110}
              height={24}
              rotate={-12}
              className="absolute -left-3 -top-4 z-20"
            />
            <InkBleed seed="caderno" spread={54} opacity={0.6}>
              <LightLeak seed="caderno-luz" intensity={0.4}>
                <SpiralNotebook rotate={-0.6} className="block w-full">
                  <div className="space-y-6 pr-2">
                    {DICAS.map((dica, i) => (
                      <article key={dica.titulo}>
                        <h3 className="font-display text-xl leading-snug text-ink">
                          {i < 2 ? (
                            <Highlighter seed={dica.titulo}>
                              {dica.titulo}
                            </Highlighter>
                          ) : (
                            dica.titulo
                          )}
                        </h3>
                        <p className="mt-1.5 max-w-prose text-sm leading-[28px] text-ink-soft">
                          {dica.texto}
                        </p>
                      </article>
                    ))}
                    <p className="flex items-center gap-2 font-hand text-xl text-caramel">
                      <Doodle
                        kind="arrow"
                        size={34}
                        color="var(--caramel)"
                        rotate={-8}
                      />
                      clique no papel pra sujar de tinta
                    </p>
                  </div>
                </SpiralNotebook>
              </LightLeak>
            </InkBleed>
            <InkSplatter
              seed="nota-tinta"
              size={56}
              color="var(--dusk)"
              className="absolute -bottom-4 right-6 opacity-50"
            />
          </div>

          <aside className="relative space-y-8">
            <div className="relative">
              <Staple className="absolute -top-3 left-1/2 z-10 -translate-x-1/2" />
              <DogEar corner="br" size={34} back="var(--blush)">
                <PullQuote
                  author="caderno de bordo"
                  highlight
                  seed="pq"
                  className="bg-paper-white px-7 pb-5 pt-10"
                >
                  Parque bom nao e o que tem mais brinquedo, e o que a
                  crianca aguenta ate o fim.
                </PullQuote>
              </DogEar>
              <CoffeeStain
                seed="cafe-orlando"
                size={92}
                className="absolute -top-6 right-0 sm:-right-6 sm:-top-8"
              />
            </div>

            <div
              className="relative"
              style={{ transform: "rotate(2deg)" }}
            >
              <PaperSheet
                variant="kraft"
                className="rounded-sm p-4 shadow-[var(--shadow-cut)]"
              >
                <p className="font-hand text-xl leading-snug text-ink">
                  tip do dia: water bottle no Walmart no primeiro dia —
                  economiza o parque inteiro.
                </p>
                <Sticker
                  shape="pill"
                  color="var(--sage)"
                  rotate={-6}
                  className="mt-3"
                >
                  anotado
                </Sticker>
              </PaperSheet>
            </div>

            <NewsprintStrip
              seed="jornal"
              headline="Outubro em Orlando pede capa de chuva"
              lines={7}
              width={250}
              rotate={-2}
            />
          </aside>
        </div>
      </DustMotes>
    </Secao>
  );
}
