"use client";

import { useSyncExternalStore } from "react";
import { useCanvasFx } from "@/components/fx/canvas-fx";
import { supportsWebGL2 } from "@/lib/canvas-support";

const emptySubscribe = () => () => {};

/**
 * Diz se os efeitos estao rodando e deixa desligar tudo.
 *
 * Uma capacidade so: WebGL2. Nenhum efeito do sistema depende de flag de
 * browser nem de origin trial.
 */
export function CanvasBanner() {
  const { forcedOff, enabled, setForcedOff } = useCanvasFx();
  const webgl = useSyncExternalStore(
    emptySubscribe,
    supportsWebGL2,
    () => false,
  );
  const on = webgl && enabled;

  return (
    <div className="rounded-lg border border-ink/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-chunky text-xs"
          style={{
            backgroundColor: on ? "var(--sage)" : "var(--blush)",
            color: "var(--ink)",
          }}
        >
          <span
            className="size-2 rounded-full"
            style={{
              backgroundColor: on ? "var(--forest)" : "var(--terracotta)",
            }}
          />
          {on ? "efeitos ligados" : "efeitos desligados"}
        </span>

        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
          <input
            type="checkbox"
            checked={forcedOff}
            onChange={(e) => setForcedOff(e.target.checked)}
            className="size-4 accent-[var(--forest)]"
          />
          desligar efeitos
        </label>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        {webgl ? (
          <>
            Tudo aqui roda em WebGL2 — nenhum efeito depende de flag de browser
            ou origin trial. Desligue no checkbox pra ver como a pagina fica sem
            eles: o conteudo continua igual, so perde a tinta por cima.
          </>
        ) : (
          <>
            Sem WebGL2 os efeitos nao rodam e cada componente mostra so o
            conteudo HTML, intacto e interativo.
          </>
        )}
      </p>
    </div>
  );
}
