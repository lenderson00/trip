import type { ReactNode } from "react";
import { stickerOutline } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type CutOutProps = {
  /** Espessura do contorno branco, em px. */
  outline?: number;
  outlineColor?: string;
  rotate?: number;
  children: ReactNode;
  className?: string;
};

/**
 * Recorte de tesoura com contorno branco de adesivo -- o carro, a bicicleta e
 * o barquinho da ref. 1.
 *
 * Funciona em cima da transparencia: passe um PNG/SVG sem fundo e o anel de
 * drop-shadows acompanha a silhueta real, por mais irregular que seja.
 */
export function CutOut({
  outline = 3,
  outlineColor = "#fff",
  rotate = 0,
  children,
  className,
}: CutOutProps) {
  return (
    <span
      className={cn("inline-block", className)}
      style={{
        filter: stickerOutline(outline, outlineColor),
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      {children}
    </span>
  );
}
