import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PaperSheet, type PaperVariant } from "./paper-sheet";

export type SpiralNotebookProps = {
  children: ReactNode;
  /** Numero de argolas. */
  rings?: number;
  variant?: PaperVariant;
  ringColor?: string;
  rotate?: number;
  className?: string;
};

/**
 * Caderno de espiral. As argolas ficam por cima da borda da folha, com o
 * furo visivel atras -- e o que da profundidade.
 */
export function SpiralNotebook({
  children,
  rings = 9,
  variant = "lined",
  ringColor = "var(--ink-faint)",
  rotate = 0,
  className,
}: SpiralNotebookProps) {
  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <PaperSheet
        variant={variant}
        className="rounded-sm pl-10 pr-5 py-6 shadow-[var(--shadow-cut)]"
      >
        {children}
      </PaperSheet>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-5 left-[18px] flex flex-col justify-between"
      >
        {Array.from({ length: rings }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: argolas identicas, lista de tamanho fixo que nunca reordena
          <span key={i} className="relative block">
            {/* Furo */}
            <span className="block size-2 rounded-full bg-ink/20" />
            {/* Argola passando por cima da borda */}
            <span
              className="absolute -left-2 -top-[5px] block h-[18px] w-7 rounded-full border-[3px] border-b-transparent border-l-transparent"
              style={{
                borderColor: ringColor,
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                transform: "rotate(-24deg)",
              }}
            />
          </span>
        ))}
      </span>
    </div>
  );
}
