import type { ReactNode } from "react";
import { toSeed } from "@/lib/seed";
import { filterId } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type CrumpledSurfaceProps = {
  /** Cor do papel sob os vincos. */
  color?: string;
  /** Tamanho dos vincos. Menor = amassado mais fino. */
  scale?: number;
  /** Profundidade do relevo. */
  relief?: number;
  /** Forca do amassado, 0 a 1. */
  intensity?: number;
  octaves?: number;
  seed?: number | string;
  children?: ReactNode;
  className?: string;
};

/**
 * Papel amassado com vincos de verdade (o fundo da ref. 3).
 *
 * O relevo sai de feTurbulence passado por feDiffuseLighting: a luz direcional
 * transforma o ruido em facetas com sombra propria. E o que separa "papel
 * amassado" de "textura cinza borrada".
 */
export function CrumpledSurface({
  color = "var(--paper-white)",
  scale = 0.008,
  relief = 2.8,
  intensity = 0.5,
  octaves = 5,
  seed,
  children,
  className,
}: CrumpledSurfaceProps) {
  const seedValue = toSeed(seed, 11) % 1000;
  const id = filterId("crumple", scale, relief, octaves, seedValue);

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ background: color }}
    >
      <svg aria-hidden className="absolute size-0" focusable="false">
        <title>Vincos de papel amassado</title>
        <filter id={id}>
          <feTurbulence
            type="turbulence"
            baseFrequency={scale}
            numOctaves={octaves}
            seed={seedValue}
            result="crinkle"
          />
          <feDiffuseLighting
            in="crinkle"
            lightingColor="#ffffff"
            surfaceScale={relief}
          >
            <feDistantLight azimuth={50} elevation={62} />
          </feDiffuseLighting>
        </filter>
      </svg>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{ filter: `url(#${id})`, opacity: intensity }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
