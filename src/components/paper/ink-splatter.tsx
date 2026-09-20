import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type InkSplatterProps = {
  size?: number;
  color?: string;
  /** Quantidade de respingos ao redor da gota principal. */
  drops?: number;
  rotate?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Respingo de caneta: uma gota grande e satelites em volta.
 *
 * Os satelites ficam mais esparsos e menores conforme se afastam, que e como
 * tinta espirra de verdade -- distribuicao uniforme entregaria o gerador.
 */
export function InkSplatter({
  size = 90,
  color = "var(--ink)",
  drops = 11,
  rotate = 0,
  seed,
  className,
}: InkSplatterProps) {
  const rng = createRng(toSeed(seed, 23));

  /* Gota central irregular. */
  const blob = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const r = between(rng, 12, 20);
    return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r * 0.86).toFixed(1)}`;
  }).join(" ");

  const satellites = Array.from({ length: drops }, (_, i) => {
    const a = between(rng, 0, Math.PI * 2);
    /* Distancia ao quadrado espalha mais longe com menos frequencia. */
    const t = rng();
    const dist = 22 + t * t * 28;
    return {
      key: i,
      cx: 50 + Math.cos(a) * dist,
      cy: 50 + Math.sin(a) * dist,
      r: between(rng, 0.8, 4.2) * (1 - t * 0.55),
    };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("pointer-events-none shrink-0", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      role="presentation"
      aria-hidden
    >
      <title>Respingo de tinta</title>
      <polygon points={blob} fill={color} />
      {satellites.map((s) => (
        <ellipse
          key={s.key}
          cx={s.cx}
          cy={s.cy}
          rx={s.r}
          ry={s.r * 0.82}
          fill={color}
        />
      ))}
    </svg>
  );
}
