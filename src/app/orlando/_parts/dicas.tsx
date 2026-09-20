"use client";

import { InkBleed } from "@/components/fx/ink-bleed";
import { CoffeeStain } from "@/components/paper/coffee-stain";
import { DogEar } from "@/components/paper/dog-ear";
import { Doodle } from "@/components/paper/doodle";
import { Highlighter } from "@/components/paper/highlighter";
import { NewsprintStrip } from "@/components/paper/newsprint-strip";
import { PullQuote } from "@/components/paper/pull-quote";
import { SpiralNotebook } from "@/components/paper/spiral-notebook";
import { DICAS } from "./dados";
import { Secao } from "./shell";

export function Dicas() {
  return (
    <Secao id="dicas" kicker="o que aprendemos" titulo="Anotacoes">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* O caderno inteiro aceita manchas de tinta ao clicar. */}
        <InkBleed seed="caderno" spread={54} opacity={0.6}>
          <SpiralNotebook rotate={-0.6} className="block w-full">
            <div className="space-y-6 pr-2">
              {DICAS.map((dica, i) => (
                <article key={dica.titulo}>
                  <h3 className="font-display text-xl leading-snug text-ink">
                    {i === 0 ? (
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
        </InkBleed>

        <aside className="space-y-8">
          <div className="relative">
            <DogEar corner="br" size={34} back="var(--blush)">
              <PullQuote
                author="caderno de bordo"
                highlight
                seed="pq"
                className="bg-paper-white px-7 pb-5 pt-10"
              >
                Parque bom nao e o que tem mais brinquedo, e o que a crianca
                aguenta ate o fim.
              </PullQuote>
            </DogEar>
            {/* No mobile a mancha fica dentro da caixa: escapando 24px pra
                direita ela criava scroll horizontal na pagina inteira. */}
            <CoffeeStain
              seed="cafe-orlando"
              size={92}
              className="absolute -top-6 right-0 sm:-right-6 sm:-top-8"
            />
          </div>

          <NewsprintStrip
            seed="jornal"
            headline="Fevereiro tem as menores filas do ano"
            lines={7}
            width={250}
            rotate={-2}
          />
        </aside>
      </div>
    </Secao>
  );
}
