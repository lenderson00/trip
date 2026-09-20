"use client";

import { type ReactNode, useMemo } from "react";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { useCanvasFx } from "./canvas-fx";
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type ScrapsConfig = {
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
  density: number;
  size: number;
  fall: number;
  seed: number;
};

const FRAG = `${GL_PRELUDE}
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uDensity;
uniform float uSize;
uniform float uFall;
uniform float uSeed;

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;
  vec2 p = rel / uDpr;
  vec2 half_ = uRectHalf / uDpr;

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  for (float L = 0.0; L < 3.0; L++) {
    float depth = 0.6 + 0.4 * L;
    float cells = (2.4 + L * 1.3) * uDensity;
    vec2 g = p / max(half_.y, 1.0) * cells;
    /* Cair e balancar: o papel nao desce reto, ele vai e volta no ar. */
    g.y += uTime * uFall * (0.30 + 0.12 * L);
    g.x += sin(uTime * 0.5 + g.y * 0.8 + L) * 0.18;

    vec2 cell = floor(g);
    vec2 f = fract(g);

    for (float oy = -1.0; oy <= 1.0; oy++) {
      for (float ox = -1.0; ox <= 1.0; ox++) {
        vec2 nb = vec2(ox, oy);
        vec2 id = cell + nb + L * 53.0 + uSeed;
        vec2 r1 = hash2(id);
        if (r1.x > 0.40) continue;
        vec2 r2 = hash2(id + 11.7);

        vec2 pos = nb + vec2(0.2 + 0.6 * r1.x, 0.2 + 0.6 * r1.y);
        vec2 d = f - pos;

        /* Rotacao propria + achatamento periodico: o retalho gira no eixo e
         * some de perfil, como papel de verdade virando no ar. */
        float spin = uTime * (0.8 + r2.x * 2.2) + r2.y * TAU;
        float ca = cos(spin);
        float sa = sin(spin);
        vec2 q = vec2(d.x * ca - d.y * sa, d.x * sa + d.y * ca);
        /* Chamado de face, e nao do nome obvio: aquele e qualificador de
         * interpolacao reservado no GLSL ES 3.0 e o shader nao compila. */
        float face = abs(cos(spin * 0.7));

        vec2 box = vec2(0.030 + 0.030 * r2.x, 0.018 + 0.022 * r2.y)
          * uSize / depth;
        box.x *= 0.25 + 0.75 * face;

        float inside = 1.0 - S(0.0, 0.006, sdRoundRect(q, box, box.y * 0.3));
        if (inside <= 0.001) continue;

        vec3 tint = r2.x < 0.34 ? uA : (r2.x < 0.67 ? uB : uC);
        /* Face de sombra quando o retalho mostra o verso. */
        tint *= 0.62 + 0.38 * face;

        col = mix(col, tint, inside);
        alpha = max(alpha, inside / depth);
      }
    }
  }

  outColor = vec4(col * alpha, alpha);
}`;

const SPEC: GlSpec<ScrapsConfig> = {
  frag: FRAG,
  defaults: {
    a: [0.95, 0.78, 0.75],
    b: [0.56, 0.7, 0.58],
    c: [0.91, 0.7, 0.3],
    density: 1,
    size: 1,
    fall: 1,
    seed: 7,
  },
  uniforms: (gl, loc, c) => {
    if (loc.uA) gl.uniform3f(loc.uA, c.a[0], c.a[1], c.a[2]);
    if (loc.uB) gl.uniform3f(loc.uB, c.b[0], c.b[1], c.b[2]);
    if (loc.uC) gl.uniform3f(loc.uC, c.c[0], c.c[1], c.c[2]);
    if (loc.uDensity) gl.uniform1f(loc.uDensity, c.density);
    if (loc.uSize) gl.uniform1f(loc.uSize, c.size);
    if (loc.uFall) gl.uniform1f(loc.uFall, c.fall);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
  },
};

export type PaperScrapsProps = {
  children: ReactNode;
  /** As tres cores sorteadas entre os retalhos. */
  colors?: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ];
  density?: number;
  size?: number;
  /** Velocidade da queda. */
  fall?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Retalhos de papel picado caindo.
 *
 * Para o momento de comemorar -- viagem fechada, reserva confirmada. Cada
 * retalho gira no proprio eixo e achata periodicamente, que e o detalhe que
 * separa "papel girando no ar" de "quadradinho descendo".
 */
export function PaperScraps({
  children,
  colors,
  density = 1,
  size = 1,
  fall = 1,
  seed,
  className,
}: PaperScrapsProps) {
  const { enabled } = useCanvasFx();
  const seedValue = useMemo(() => (toSeed(seed, 7) % 67) / 3, [seed]);

  const options = useMemo<Partial<ScrapsConfig>>(
    () => ({
      density: enabled ? density : 0,
      size,
      fall,
      seed: seedValue,
      ...(colors ? { a: colors[0], b: colors[1], c: colors[2] } : {}),
    }),
    [enabled, density, size, fall, seedValue, colors],
  );

  const gl = useGlEffect(SPEC, options, enabled);

  return (
    <GlSurface
      gl={gl}
      className={cn("relative", className)}
      bleed={{ top: 40, bottom: 40 }}
    >
      {children}
    </GlSurface>
  );
}
