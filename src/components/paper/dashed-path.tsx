import { cn } from "@/lib/utils";

export type DashedPathProps = {
  width?: number;
  height?: number;
  /** Altura do arco. Negativo inverte a barriga da curva. */
  curve?: number;
  color?: string;
  /** Icone na ponta: aviao, pino ou nada. */
  tip?: "plane" | "pin" | "none";
  dash?: string;
  stroke?: number;
  className?: string;
  label?: string;
};

/* Aviaozinho apontando pra direita, desenhado na origem pra poder ser
 * rotacionado junto com a tangente da curva. */
const PLANE = "M0,-9 L22,-1 L22,1 L0,9 L4,1 L-18,7 L-14,0 L-18,-7 L4,-1 Z";

/**
 * Rota tracejada com aviao na ponta -- o rastro do voo da ref. 1.
 *
 * O aviao e rotacionado pela tangente real da curva no ponto final, entao ele
 * sempre aponta pra onde a linha estava indo.
 */
export function DashedPath({
  width = 300,
  height = 120,
  curve = 70,
  color = "var(--ink)",
  tip = "plane",
  dash = "9 9",
  stroke = 2.5,
  className,
  label = "Rota de viagem",
}: DashedPathProps) {
  const x0 = 6;
  const y0 = height - 10;
  const x1 = width - 34;
  const y1 = 22;
  const cx = width * 0.34;
  const cy = y0 - curve;

  /* Tangente de uma curva quadratica no fim (t=1) e P1 -> P2. */
  const angle = (Math.atan2(y1 - cy, x1 - cx) * 180) / Math.PI;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={label}
      focusable="false"
    >
      <title>{label}</title>
      <path
        d={`M ${x0},${y0} Q ${cx},${cy} ${x1},${y1}`}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
      {tip === "plane" ? (
        <path
          d={PLANE}
          fill={color}
          transform={`translate(${x1} ${y1}) rotate(${angle}) scale(0.78)`}
        />
      ) : null}
      {tip === "pin" ? (
        <g transform={`translate(${x1} ${y1})`}>
          <path d="M0,6 C -9,-4 -7,-15 0,-15 C 7,-15 9,-4 0,6 Z" fill={color} />
          <circle cy={-10} r={3} fill="var(--paper-cream)" />
        </g>
      ) : null}
    </svg>
  );
}
