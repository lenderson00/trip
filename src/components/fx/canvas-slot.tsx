"use client";

import type { ReactNode } from "react";
import { useCanvasFx } from "./canvas-fx";

export type CanvasSlotProps = {
  /** A versao com efeito. */
  effect: ReactNode;
  /** A mesma coisa sem efeito nenhum. */
  plain: ReactNode;
};

/**
 * Slot de teste do showcase.
 *
 * Ele obedece APENAS ao "forcar fallback". Nao consulta suporte: os efeitos do
 * Canvas UI sao WebGL e fazem a propria deteccao de html-in-canvas por dentro
 * -- gatear a montagem deles na API impediria o WebGL de rodar, que foi o bug
 * que este comentario existe pra impedir de voltar.
 */
export function CanvasSlot({ effect, plain }: CanvasSlotProps) {
  const { forcedOff } = useCanvasFx();
  return <>{forcedOff ? plain : effect}</>;
}
