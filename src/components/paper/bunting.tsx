import { between, createRng, pick, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type BuntingProps = {
  /** Quantas bandeirinhas. */
  count?: number;
  colors?: string[];
  /** Quanto o barbante cede no meio, em px. */
  sag?: number;
  width?: number;
  /** Bandeira triangular ou retangular de ponta chanfrada. */
  shape?: "triangle" | "notched";
  seed?: number | string;
  className?: string;
};

const DEFAULT_COLORS = [
  "var(--blush)",
  "var(--sage)",
  "var(--mustard)",
  "var(--dusk)",
  "var(--terracotta)",
];

/**
 * Bandeirinhas de papel penduradas num barbante.
 *
 * O barbante e uma curva quadratica e cada bandeira e posicionada sobre ela,
 * girada pela tangente daquele ponto -- por isso as das pontas pendem
 * inclinadas e as do meio ficam retas, como varal de verdade.
 */
export function Bunting({
  count = 7,
  colors = DEFAULT_COLORS,
  sag = 26,
  width = 320,
  shape = "triangle",
  seed,
  className,
}: BuntingProps) {
  const rng = createRng(toSeed(seed, 29));
  const h = 74;
  const y0 = 8;

  /* Curva do barbante: y(t) = quadratica com o meio caido em `sag`. */
  const yAt = (t: number) => y0 + 4 * sag * t * (1 - t);
  const slopeAt = (t: number) => 4 * sag * (1 - 2 * t);

  const flags = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    const x = t * width;
    const y = yAt(t);
    const angle = (Math.atan2(slopeAt(t) / width, 1) * 180) / Math.PI;
    const size = between(rng, 0.88, 1.08);
    return { key: i, x, y, angle, size, color: pick(rng, colors) };
  });

  const path = `M 0 ${y0} Q ${width / 2} ${y0 + 2 * sag} ${width} ${y0}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${h}`}
      className={cn("w-full overflow-visible", className)}
      role="presentation"
      aria-hidden
    >
      <title>Bandeirinhas</title>
      <path
        d={path}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {flags.map((f) => (
        <g
          key={f.key}
          transform={`translate(${f.x} ${f.y}) rotate(${f.angle}) scale(${f.size})`}
        >
          {shape === "triangle" ? (
            <path d="M-15 0 L15 0 L0 36 Z" fill={f.color} />
          ) : (
            <path d="M-14 0 L14 0 L14 28 L0 36 L-14 28 Z" fill={f.color} />
          )}
          {/* Dobra onde a bandeira passa por cima do barbante. */}
          <path d="M-15 0 L15 0 L15 5 L-15 5 Z" fill="rgb(43 38 34 / 0.16)" />
        </g>
      ))}
    </svg>
  );
}
