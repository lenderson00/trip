import { cn } from "@/lib/utils";

export type DoodleKind =
  | "arrow"
  | "star"
  | "circle"
  | "underline"
  | "spark"
  | "heart"
  | "swirl"
  | "check";

export type DoodleProps = {
  kind?: DoodleKind;
  color?: string;
  size?: number;
  rotate?: number;
  /** Espessura do traco. */
  stroke?: number;
  className?: string;
  label?: string;
};

/* Tracos desenhados a mao: nenhuma curva e simetrica, e as pontas passam um
 * pouco do ponto de encontro, como caneta de verdade. */
const PATHS: Record<DoodleKind, { d: string; fill?: boolean }> = {
  arrow: { d: "M6 34 C 20 30, 34 22, 52 10 M 42 8 L 54 9 L 50 21" },
  star: {
    d: "M30 6 L36 23 L54 24 L39 34 L45 52 L30 41 L15 52 L21 34 L6 24 L24 23 Z",
  },
  circle: {
    d: "M30 7 C 47 6, 55 17, 54 29 C 53 43, 42 53, 28 53 C 14 52, 6 42, 7 28 C 8 16, 17 8, 31 8",
  },
  underline: { d: "M5 20 C 20 12, 42 12, 57 17 M 8 27 C 22 21, 40 20, 54 24" },
  spark: {
    d: "M30 8 L33 27 L52 30 L33 33 L30 52 L27 33 L8 30 L27 27 Z",
    fill: true,
  },
  heart: {
    d: "M30 51 C 8 36, 6 22, 15 15 C 22 10, 29 14, 30 20 C 31 14, 38 10, 45 15 C 54 22, 52 36, 30 51 Z",
    fill: true,
  },
  swirl: {
    d: "M8 40 C 14 24, 30 18, 38 26 C 45 33, 38 44, 30 41 C 23 38, 25 28, 34 25 C 45 21, 54 30, 54 38",
  },
  check: { d: "M10 31 C 16 36, 21 42, 25 47 C 32 32, 42 19, 53 11" },
};

/**
 * Rabisco a mao: seta, estrela, circulo, sublinhado, brilho, coracao,
 * espiral, check.
 */
export function Doodle({
  kind = "arrow",
  color = "var(--ink)",
  size = 60,
  rotate = 0,
  stroke = 3,
  className,
  label,
}: DoodleProps) {
  const shape = PATHS[kind];

  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      className={cn("shrink-0 overflow-visible", className)}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label ? <title>{label}</title> : null}
      <path
        d={shape.d}
        fill={shape.fill ? color : "none"}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
