import { filterId } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type ArcTextProps = {
  children: string;
  /** Curvatura. Positivo arqueia pra cima, negativo pra baixo, 0 e reto. */
  curve?: number;
  width?: number;
  height?: number;
  color?: string;
  /** Familia tipografica. O padrao e a gordinha da ref. 1. */
  font?: "chunky" | "display" | "hand";
  weight?: number;
  size?: number;
  letterSpacing?: number;
  className?: string;
};

const FONT_VAR: Record<NonNullable<ArcTextProps["font"]>, string> = {
  chunky: "var(--font-fredoka), sans-serif",
  display: "var(--font-fraunces), serif",
  hand: "var(--font-caveat), cursive",
};

/**
 * Manchete arqueada -- o "TRAVEL" da ref. 1.
 *
 * E um textPath de verdade sobre uma curva quadratica, entao o texto continua
 * selecionavel e legivel por leitor de tela; nada de imagem ou letra a letra.
 */
export function ArcText({
  children,
  curve = 26,
  width = 620,
  height = 190,
  color = "var(--sage)",
  font = "chunky",
  weight = 600,
  size = 96,
  letterSpacing = -1,
  className,
}: ArcTextProps) {
  const id = filterId("arc", children, curve, width, height);

  /* Baseline: comeca e termina nas pontas, o ponto de controle puxa o meio.
   * O fator 2 compensa a curva quadratica passar na metade da altura. */
  const baseY = height - size * 0.32;
  const d = `M 0,${baseY} Q ${width / 2},${baseY - curve * 2} ${width},${baseY}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block w-full", className)}
      role="img"
      aria-label={children}
    >
      <title>{children}</title>
      <path id={id} d={d} fill="none" />
      <text
        fill={color}
        fontFamily={FONT_VAR[font]}
        fontSize={size}
        fontWeight={weight}
        letterSpacing={letterSpacing}
      >
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {children}
        </textPath>
      </text>
    </svg>
  );
}
