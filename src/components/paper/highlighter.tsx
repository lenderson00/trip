import type { ReactNode } from "react";
import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type HighlighterProps = {
  children: ReactNode;
  color?: string;
  /** Altura do traco em relacao a linha, 0 a 1. */
  thickness?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Traco de marca-texto atras do texto.
 *
 * O traco e um SVG com ponta irregular e multiply por cima, nao um retangulo
 * de fundo: marcador de verdade escapa da linha e escurece onde passa duas
 * vezes.
 */
export function Highlighter({
  children,
  color = "var(--mustard)",
  thickness = 0.62,
  seed,
  className,
}: HighlighterProps) {
  const rng = createRng(toSeed(seed, 29));
  const a = between(rng, 1.5, 4).toFixed(1);
  const b = between(rng, 94, 99).toFixed(1);
  const c = between(rng, 1, 3.5).toFixed(1);
  const d = between(rng, 2, 5).toFixed(1);

  return (
    <span className={cn("relative inline", className)}>
      <svg
        aria-hidden
        className="absolute inset-x-0 -z-10"
        style={{
          bottom: "-0.08em",
          height: `${thickness}em`,
          mixBlendMode: "multiply",
        }}
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        focusable="false"
      >
        <title>Marca-texto</title>
        <path
          d={`M ${a},${d} L ${b},1.5 L 99,${18 - Number(c)} L 1,19 Z`}
          fill={color}
          opacity={0.85}
        />
      </svg>
      {children}
    </span>
  );
}
