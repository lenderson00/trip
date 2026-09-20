"use client";

import { type ReactNode, useMemo } from "react";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { useCanvasFx } from "./canvas-fx";
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type LeakConfig = {
  warm: [number, number, number];
  cool: [number, number, number];
  intensity: number;
  grain: number;
  seed: number;
};

const FRAG = `${GL_PRELUDE}
uniform vec3 uWarm;
uniform vec3 uCool;
uniform float uIntensity;
uniform float uGrain;
uniform float uSeed;

/* Um vazamento: mancha alongada entrando por uma borda, com respiro proprio. */
float leak (vec2 p, vec2 origin, vec2 dir, float width, float phase) {
  vec2 d = p - origin;
  float along = dot(d, dir);
  float across = length(d - dir * along);
  float breathe = 0.75 + 0.25 * sin(uTime * 0.6 + phase);
  float body = exp(-across * across / (width * width * breathe));
  float falloff = exp(-max(along, 0.0) / (uRectHalf.x * 1.5));
  return body * falloff * step(-width, along);
}

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;
  vec2 p = rel / uDpr;
  vec2 half_ = uRectHalf / uDpr;

  /* Ruido que deforma a entrada da luz, pra faixa nao virar cone perfeito. */
  vec2 warp = vec2(
    snoise(p * 0.004 + uTime * 0.05 + uSeed),
    snoise(p * 0.004 + 31.0 + uSeed)
  ) * 40.0;
  vec2 q = p + warp;

  float a = leak(q, vec2(-half_.x, half_.y * 0.55), normalize(vec2(1.0, -0.25)),
    half_.y * 0.42, uSeed);
  float b = leak(q, vec2(half_.x, -half_.y * 0.2), normalize(vec2(-1.0, 0.18)),
    half_.y * 0.3, uSeed + 2.1);
  float c = leak(q, vec2(half_.x * 0.2, half_.y), normalize(vec2(-0.2, -1.0)),
    half_.x * 0.22, uSeed + 4.3);

  vec3 col = uWarm * (a * 1.0 + c * 0.7) + uCool * b * 0.8;

  /* Halo quente sempre presente nos cantos, como filme velado. */
  float corner = 1.0 - S(0.55, 1.15, length(p / half_));
  col += uWarm * (1.0 - corner) * 0.18;

  float lum = a + b * 0.8 + c * 0.7 + (1.0 - corner) * 0.25;

  /* Grao de filme: ruido por pixel, nao por ponto da folha. */
  float g = (hash1(floor(frag) + floor(uTime * 24.0)) - 0.5) * uGrain;
  col += g;
  lum += abs(g) * 0.5;

  float alpha = clamp(lum * uIntensity, 0.0, 1.0);
  outColor = vec4(max(col, vec3(0.0)) * alpha, alpha);
}`;

const SPEC: GlSpec<LeakConfig> = {
  frag: FRAG,
  defaults: {
    warm: [1.0, 0.66, 0.36],
    cool: [0.42, 0.55, 0.78],
    intensity: 0.85,
    grain: 0.05,
    seed: 3,
  },
  uniforms: (gl, loc, c) => {
    if (loc.uWarm) gl.uniform3f(loc.uWarm, c.warm[0], c.warm[1], c.warm[2]);
    if (loc.uCool) gl.uniform3f(loc.uCool, c.cool[0], c.cool[1], c.cool[2]);
    if (loc.uIntensity) gl.uniform1f(loc.uIntensity, c.intensity);
    if (loc.uGrain) gl.uniform1f(loc.uGrain, c.grain);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
  },
};

export type LightLeakProps = {
  children: ReactNode;
  /** Cor do vazamento principal. */
  warm?: [number, number, number];
  /** Cor do vazamento secundario, do lado oposto. */
  cool?: [number, number, number];
  intensity?: number;
  /** Grao de filme, 0 a 0.2. */
  grain?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Vazamento de luz de filme sobre o conteudo.
 *
 * Feito pra foto: e o que casa o material do site com a fotografia velada e
 * quente do moodboard, sem precisar tratar cada imagem na mao. As faixas
 * entram pelas bordas, respiram fora de fase e levam grao por cima.
 *
 * O canvas entra em `screen`, entao ele so soma luz -- nunca escurece nem
 * apaga o que esta embaixo.
 */
export function LightLeak({
  children,
  warm,
  cool,
  intensity = 0.85,
  grain = 0.05,
  seed,
  className,
}: LightLeakProps) {
  const { enabled } = useCanvasFx();
  const seedValue = useMemo(() => (toSeed(seed, 3) % 91) / 6, [seed]);

  const options = useMemo<Partial<LeakConfig>>(
    () => ({
      intensity: enabled ? intensity : 0,
      grain,
      seed: seedValue,
      ...(warm ? { warm } : {}),
      ...(cool ? { cool } : {}),
    }),
    [enabled, intensity, grain, seedValue, warm, cool],
  );

  const gl = useGlEffect(SPEC, options, enabled);

  return (
    <GlSurface gl={gl} blend="screen" className={cn("relative", className)}>
      {children}
    </GlSurface>
  );
}
