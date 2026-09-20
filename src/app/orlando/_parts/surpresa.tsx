"use client";

import { useState } from "react";
import { PaperScraps } from "@/components/fx/paper-scraps";
import { ScratchOff } from "@/components/fx/scratch-off";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PillLabel } from "@/components/paper/pill-label";
import { Sticker } from "@/components/paper/sticker";
import { Secao } from "./shell";

/**
 * O fechamento da pagina.
 *
 * A raspadinha esconde a surpresa que os pais prepararam; quando ela passa do
 * limiar, o papel picado cai. O confete so monta depois do reveal -- deixar o
 * efeito rodando desde o inicio gastaria um contexto WebGL a toa.
 */
export function Surpresa() {
  const [revelado, setRevelado] = useState(false);

  const cartao = (
    <PaperSheet
      variant="cream"
      className="flex flex-col items-center justify-center gap-3 rounded-sm px-8 py-12 text-center"
    >
      <p className="font-hand text-2xl text-caramel">a surpresa do dia 06</p>
      <p className="font-display text-4xl leading-tight text-ink">
        cafe da manha
        <br />
        com os personagens
      </p>
      <PillLabel color="var(--sage)" size="lg" className="mt-2">
        07h45 · Cinderella{"'"}s Royal Table
      </PillLabel>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-soft">
        Reservado ha seis meses, no minuto em que abriu. Nao conta pra ela.
      </p>
    </PaperSheet>
  );

  return (
    <Secao id="surpresa" kicker="nao conta pra ninguem" titulo="Surpresa">
      <div className="flex flex-col items-center gap-5">
        <div className="w-full max-w-md">
          {revelado ? (
            <PaperScraps seed="festa" density={1.2} fall={1.1}>
              {cartao}
            </PaperScraps>
          ) : (
            <ScratchOff
              seed="surpresa-orlando"
              brush={44}
              threshold={0.45}
              onReveal={() => setRevelado(true)}
              className="overflow-hidden rounded-sm"
            >
              {cartao}
            </ScratchOff>
          )}
        </div>

        {revelado ? (
          <Sticker shape="pill" color="var(--mustard)" rotate={-3}>
            revelado!
          </Sticker>
        ) : (
          <p className="font-body text-sm text-ink-soft">
            arraste o dedo pra raspar
          </p>
        )}
      </div>
    </Secao>
  );
}
