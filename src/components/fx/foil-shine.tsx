"use client";

import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { useCanvasFx } from "./canvas-fx";
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type FoilConfig = {
  /** Ponteiro em -1..1 dentro da caixa. */
  px: number;
  py: number;
  intensity: number;
  radius: number;
  grain: number;
  seed: number;
};

const FRAG = `${GL_PRELUDE}
uniform vec2 uPointer;
uniform float uIntensity;
uniform float uRadius;
uniform float uGrain;
uniform float uSeed;

/* Arco-iris de foil: nao e um degrade linear, e a mesma fase lida com
 * defasagem em cada canal -- e o que produz a separacao de cor do holografico. */
vec3 spectrum (float t) {
  return 0.5 + 0.5 * cos(TAU * (vec3(0.0, 0.33, 0.67) + t));
}

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;
  vec2 p = rel / uDpr;
  vec2 half_ = uRectHalf / uDpr;
  vec2 uv = p / half_;

  /* Microrelevo do foil prensado: risquinhos finos na diagonal. */
  float grooves = fbm(vec2(p.x * 0.06 + p.y * 0.02, p.y * 0.5) + uSeed);
  float ripple = snoise(p * 0.012 + vec2(uTime * 0.18, uSeed)) * 0.5;

  /* A fase segue a distancia ao ponteiro: inclinar o "cartao" muda a cor. */
  vec2 toP = uv - uPointer;
  float phase = length(toP) * 1.15 + grooves * 0.9 + ripple + uTime * 0.05;
  vec3 col = spectrum(phase);

  /* Brilho especular concentrado onde o ponteiro esta. */
  float spec = exp(-dot(toP, toP) / (uRadius * uRadius));
  /* Faixa de luz varrendo, pro foil nao ficar parado quando ninguem mexe. */
  float sweep = exp(-pow((uv.x + uv.y * 0.35) - sin(uTime * 0.35) * 1.2, 2.0) / 0.10);

  float lum = spec * 0.85 + sweep * 0.45 + 0.10;
  lum *= 0.75 + 0.5 * grooves;

  float g = (hash1(floor(frag) + floor(uTime * 20.0)) - 0.5) * uGrain;
  lum += g;

  float inside = 1.0 - S(0.98, 1.0, max(abs(uv.x), abs(uv.y)));
  float a = clamp(lum * uIntensity, 0.0, 1.0) * inside;

  outColor = vec4(col * a, a);
}`;

const SPEC: GlSpec<FoilConfig> = {
  frag: FRAG,
  defaults: {
    px: 0,
    py: 0,
    intensity: 0.9,
    radius: 0.55,
    grain: 0.05,
    seed: 11,
  },
  uniforms: (gl, loc, c) => {
    if (loc.uPointer) gl.uniform2f(loc.uPointer, c.px, c.py);
    if (loc.uIntensity) gl.uniform1f(loc.uIntensity, c.intensity);
    if (loc.uRadius) gl.uniform1f(loc.uRadius, c.radius);
    if (loc.uGrain) gl.uniform1f(loc.uGrain, c.grain);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
  },
};

export type FoilShineProps = {
  children: ReactNode;
  intensity?: number;
  /** Tamanho do brilho que segue o ponteiro. */
  radius?: number;
  grain?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Brilho holografico de foil, pra adesivo e selo.
 *
 * O arco-iris nao e um degrade: e uma fase unica lida com defasagem por canal,
 * que e o que cria a separacao de cor do holografico de verdade. A fase segue
 * o ponteiro, entao mover o mouse "inclina" o cartao e troca a cor.
 */
export function FoilShine({
  children,
  intensity = 0.9,
  radius = 0.55,
  grain = 0.05,
  seed,
  className,
}: FoilShineProps) {
  const { enabled } = useCanvasFx();
  const hostRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const seedValue = useMemo(() => (toSeed(seed, 11) % 59) / 4, [seed]);

  const options = useMemo<Partial<FoilConfig>>(
    () => ({
      px: pointer.x,
      py: pointer.y,
      intensity: enabled ? intensity : 0,
      radius,
      grain,
      seed: seedValue,
    }),
    [enabled, pointer, intensity, radius, grain, seedValue],
  );

  const gl = useGlEffect(SPEC, options, enabled);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      /* Y pra cima, igual ao espaco do shader. */
      y: 1 - ((e.clientY - r.top) / r.height) * 2,
    });
  };

  return (
    <div
      ref={hostRef}
      className={cn("relative", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <GlSurface gl={gl} blend="screen">
        {children}
      </GlSurface>
    </div>
  );
}
