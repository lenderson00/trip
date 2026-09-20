import { cn } from "@/lib/utils";

export type PushPinProps = {
  size?: number;
  color?: string;
  rotate?: number;
  className?: string;
};

/**
 * Tachinha vista de frente.
 *
 * A sombra cai pra baixo e pro lado, nao em volta: a tachinha esta na frente
 * do papel, entao ela projeta, nao flutua.
 */
export function PushPin({
  size = 30,
  color = "var(--poppy)",
  rotate = 0,
  className,
}: PushPinProps) {
  return (
    <svg
      viewBox="0 0 30 30"
      width={size}
      height={size}
      className={cn("shrink-0 overflow-visible", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(2px 4px 3px rgb(43 38 34 / 0.34))",
      }}
      role="presentation"
      aria-hidden
    >
      <title>Tachinha</title>
      <circle cx={15} cy={15} r={11} fill={color} />
      {/* Anel interno rebaixado. */}
      <circle cx={15} cy={15} r={6.5} fill="rgb(43 38 34 / 0.18)" />
      <circle cx={15} cy={15} r={3.2} fill="rgb(43 38 34 / 0.35)" />
      {/* Brilho no alto a esquerda, coerente com a sombra. */}
      <ellipse cx={11} cy={10.5} rx={4.4} ry={3} fill="#fff" opacity={0.45} />
    </svg>
  );
}
