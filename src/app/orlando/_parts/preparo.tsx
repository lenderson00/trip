"use client";

import type { ReactNode } from "react";
import { DustMotes } from "@/components/fx/dust-motes";
import { LightLeak } from "@/components/fx/light-leak";
import { PaperScraps } from "@/components/fx/paper-scraps";
import { BudgetEnvelope } from "@/components/paper/budget-envelope";
import { CoffeeStain } from "@/components/paper/coffee-stain";
import { Doodle } from "@/components/paper/doodle";
import { InkSplatter } from "@/components/paper/ink-splatter";
import { LuggageTag } from "@/components/paper/luggage-tag";
import { PackingChecklist } from "@/components/paper/packing-checklist";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PostageStamp } from "@/components/paper/postage-stamp";
import { PushPin } from "@/components/paper/push-pin";
import { RansomHeadline } from "@/components/paper/ransom-headline";
import { Sticker } from "@/components/paper/sticker";
import { WashiTape } from "@/components/paper/washi-tape";
import { BAGAGEM, ORCAMENTO } from "./dados";
import { Secao } from "./shell";

function StickyNote({
  children,
  rotate = -3,
  color = "var(--mustard)",
  className,
}: {
  children: ReactNode;
  rotate?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        background: color,
        boxShadow: "var(--shadow-cut)",
      }}
    >
      <div className="relative z-10 px-4 py-3 font-hand text-xl leading-snug text-ink">
        {children}
      </div>
    </div>
  );
}

/**
 * Bagagem vira um tabuleiro: lista, etiquetas, post-its e retalhos WebGL.
 */
export function Preparo() {
  const brl = ORCAMENTO.filter((item) => item.amount.startsWith("R$")).reduce(
    (soma, item) => soma + Number(item.amount.replace(/\D/g, "")),
    0,
  );

  return (
    <>
      <Secao id="bagagem" kicker="antes de ir" titulo="Bagagem">
        <PaperScraps
          seed="mala-festa"
          density={0.45}
          size={0.8}
          fall={0.5}
          className="mx-auto max-w-4xl"
        >
          <DustMotes
            seed="mala-poeira"
            density={0.7}
            beam={0.55}
            className="relative min-h-[420px] px-2 py-8 sm:px-6"
          >
            <div className="relative z-10 flex flex-wrap items-start justify-center gap-8 lg:gap-12">
              <div className="relative">
                <PushPin
                  size={26}
                  className="absolute -top-3 left-1/2 z-20 -translate-x-1/2"
                />
                <WashiTape
                  variant="stripe"
                  width={88}
                  height={22}
                  rotate={-18}
                  className="absolute -left-4 -top-1 z-10"
                />
                <LightLeak seed="lista-mala" intensity={0.25}>
                  <PackingChecklist
                    title="Na mala"
                    items={BAGAGEM}
                    seed="mala-orlando"
                    className="w-72"
                  />
                </LightLeak>
                <StickyNote
                  rotate={8}
                  color="var(--blush)"
                  className="absolute -bottom-6 -right-10 z-10 w-36 sm:-right-14"
                >
                  nao esquecer a mala vazia
                </StickyNote>
              </div>

              <div className="relative flex w-full max-w-xs flex-col items-center gap-6 sm:w-auto">
                <StickyNote rotate={-4} color="var(--sage)" className="w-52">
                  poncho na mochila — chove todo dia
                </StickyNote>

                <LuggageTag
                  name="Lenderson & Lays"
                  destination="Orlando, FL"
                  code="GRU MCO"
                />

                <PostageStamp
                  src="/photos/foguete.jpg"
                  alt="Foguete"
                  label="checklist"
                  value="ok"
                  width={100}
                  rotate={6}
                />

                <Doodle
                  kind="arrow"
                  size={48}
                  color="var(--caramel)"
                  rotate={-20}
                  className="absolute -left-8 top-28 hidden sm:block"
                />
              </div>

              <div className="relative flex flex-col items-center gap-5">
                <div style={{ transform: "rotate(2.5deg)" }}>
                  <PaperSheet
                    variant="cream"
                    className="max-w-[220px] rounded-sm p-4 shadow-[var(--shadow-cut)]"
                  >
                    <p className="font-hand text-xl leading-snug text-caramel">
                      a mala vazia nao e exagero — ela volta cheia e ainda sobra
                      pra mao.
                    </p>
                  </PaperSheet>
                </div>

                <Sticker shape="seal" color="var(--mustard)" rotate={-10}>
                  peso ok?
                </Sticker>

                <StickyNote
                  rotate={5}
                  color="var(--paper-kraft)"
                  className="w-44"
                >
                  adaptador + power bank juntos
                </StickyNote>

                <CoffeeStain
                  seed="mala-cafe"
                  size={70}
                  className="pointer-events-none absolute -bottom-4 -left-6 opacity-60"
                />
              </div>
            </div>

            <div className="relative z-10 mt-14 flex justify-center">
              <div className="relative">
                <RansomHeadline seed="ferias-mala" size={44}>
                  FERIAS
                </RansomHeadline>
                <InkSplatter
                  seed="ferias-tinta"
                  size={64}
                  color="var(--terracotta)"
                  className="pointer-events-none absolute -bottom-6 -right-4 opacity-70"
                />
              </div>
            </div>
          </DustMotes>
        </PaperScraps>
      </Secao>

      <Secao id="orcamento" kicker="quanto custa" titulo="Orcamento">
        <p className="mx-auto mb-6 max-w-lg text-center text-sm leading-relaxed text-ink-soft">
          No Brasil:{" "}
          <strong className="font-display text-lg text-ink">
            R$ {brl.toLocaleString("pt-BR")}
          </strong>{" "}
          (passagens + ingressos). Hospedagem free, transporte nos pontos. La:
          ~US$ 400 comida + US$ 2.000 compras.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {ORCAMENTO.map((item, i) => (
            <BudgetEnvelope
              key={item.label}
              label={item.label}
              amount={item.amount}
              spent={item.spent}
              color={item.color}
              rotate={i % 2 === 0 ? -1.5 : 2}
            />
          ))}
        </div>
      </Secao>
    </>
  );
}
