"use client";

import { type ReactNode, useMemo } from "react";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { useCanvasFx } from "./canvas-fx";
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type DustConfig = {
  color: [number, number, number];
  density: number;
  size: number;
  drift: number;
  beam: number;
  seed: number;
};

const FRAG = `${GL_PRELUDE}
uniform vec3 uColor;
uniform float uDensity;
uniform float uSize;
uniform float uDrift;
uniform float uBeam;
uniform float uSeed;

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;
  vec2 p = rel / uDpr;
  vec2 half_ = uRectHalf / uDpr;

  /* Feixe diagonal de luz: as particulas so acendem dentro dele, como poeira
   * que voce so enxerga quando o sol entra pela janela. */
  vec2 dir = normalize(vec2(0.55, -1.0));
  float across = abs(dot(p - vec2(-half_.x * 0.3, 0.0), vec2(dir.y, -dir.x)));
  float beam = exp(-across * across / (half_.x * half_.x * 0.30)) * uBeam;

  float total = 0.0;
  /* Tres camadas com velocidades diferentes dao profundidade. */
  for (float L = 0.0; L < 3.0; L++) {
    float depth = 0.55 + 0.45 * L;
    float cells = (3.2 + L * 2.1) * uDensity;
    vec2 gridP = p / max(half_.y, 1.0) * cells;
    gridP += vec2(uTime * uDrift * (0.10 + 0.05 * L), -uTime * uDrift * 0.16 * depth);

    vec2 cell = floor(gridP);
    vec2 f = fract(gridP);

    /* Vizinhanca 3x3 pra particula nao sumir ao cruzar a borda da celula. */
    for (float oy = -1.0; oy <= 1.0; oy++) {
      for (float ox = -1.0; ox <= 1.0; ox++) {
        vec2 nb = vec2(ox, oy);
        vec2 id = cell + nb + L * 37.0 + uSeed;
        vec2 rnd = hash2(id);
        if (rnd.x > 0.62) continue;

        vec2 pos = nb + vec2(0.25 + 0.5 * rnd.x, 0.25 + 0.5 * rnd.y);
        pos.x += 0.22 * sin(uTime * (0.4 + rnd.y) + rnd.x * TAU);
        pos.y += 0.16 * cos(uTime * (0.3 + rnd.x) + rnd.y * TAU);

        float d = length(f - pos);
        float r = (0.018 + 0.045 * rnd.y) * uSize / depth;
        float twinkle = 0.55 + 0.45 * sin(uTime * (1.4 + rnd.x * 2.6) + rnd.y * TAU);
        total += exp(-d * d / (r * r)) * twinkle / depth;
      }
    }
  }

  float a = clamp(total * beam, 0.0, 1.0);
  /* Vela as bordas pra poeira nao terminar num corte reto. */
  a *= 1.0 - S(0.85, 1.25, length(p / half_));

  outColor = vec4(uColor * a, a);
}`;

const SPEC: GlSpec<DustConfig> = {
  frag: FRAG,
  defaults: {
    color: [1.0, 0.94, 0.82],
    density: 1,
    size: 1,
    drift: 1,
    beam: 1,
    seed: 5,
  },
  uniforms: (gl, loc, c) => {
    if (loc.uColor)
      gl.uniform3f(loc.uColor, c.color[0], c.color[1], c.color[2]);
    if (loc.uDensity) gl.uniform1f(loc.uDensity, c.density);
    if (loc.uSize) gl.uniform1f(loc.uSize, c.size);
    if (loc.uDrift) gl.uniform1f(loc.uDrift, c.drift);
    if (loc.uBeam) gl.uniform1f(loc.uBeam, c.beam);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
  },
};

export type DustMotesProps = {
  children: ReactNode;
  color?: [number, number, number];
  /** Quantas particulas por area. */
  density?: number;
  size?: number;
  /** Velocidade da deriva. */
  drift?: number;
  /** Forca do feixe de luz que revela a poeira. 0 espalha por tudo. */
  beam?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Poeira flutuando num feixe de sol.
 *
 * Tres camadas em velocidades diferentes dao profundidade, e cada particula e
 * amostrada na vizinhanca 3x3 da celula pra nao piscar ao cruzar a divisa. O
 * feixe e o que torna a poeira crivel: poeira so aparece onde a luz entra.
 */
export function DustMotes({
  children,
  color,
  density = 1,
  size = 1,
  drift = 1,
  beam = 1,
  seed,
  className,
}: DustMotesProps) {
  const { enabled } = useCanvasFx();
  const seedValue = useMemo(() => (toSeed(seed, 5) % 71) / 4, [seed]);

  const options = useMemo<Partial<DustConfig>>(
    () => ({
      density,
      size,
      drift,
      beam: enabled ? beam : 0,
      seed: seedValue,
      ...(color ? { color } : {}),
    }),
    [enabled, density, size, drift, beam, seedValue, color],
  );

  const gl = useGlEffect(SPEC, options, enabled);

  return (
    <GlSurface gl={gl} blend="screen" className={cn("relative", className)}>
      {children}
    </GlSurface>
  );
}
