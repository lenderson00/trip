import { between, createRng, toSeed } from "@/lib/seed";
import { filterId } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type CoffeeStainProps = {
  size?: number;
  color?: string;
  /** Opacidade da mancha. Cafe seco e translucido. */
  opacity?: number;
  rotate?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Anel de xicara esquecida em cima do papel.
 *
 * O miolo e mais claro que a borda: o liquido evapora no centro e deposita o
 * pigmento na beirada. Sem esse contraste a mancha parece um circulo pintado.
 */
export function CoffeeStain({
  size = 110,
  color = "var(--caramel)",
  opacity = 0.3,
  rotate = 0,
  seed,
  className,
}: CoffeeStainProps) {
  const rng = createRng(toSeed(seed, 19));
  const seedValue = toSeed(seed, 19) % 900;
  const id = filterId("stain", seedValue, size);

  /* Anel irregular: raio varia ao longo da volta. */
  const ring = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r = between(rng, 40, 46);
    return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("pointer-events-none shrink-0", className)}
      style={{ transform: `rotate(${rotate}deg)`, opacity }}
      role="presentation"
      aria-hidden
    >
      <title>Mancha de cafe</title>
      <defs>
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.04}
            numOctaves={3}
            seed={seedValue}
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={7}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter={`url(#${id})`}>
        {/* Borda grossa: o pigmento se acumula aqui. */}
        <polygon
          points={ring}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        {/* Miolo lavado. */}
        <polygon points={ring} fill={color} opacity={0.28} />
      </g>
    </svg>
  );
}
