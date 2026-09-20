"use client";

import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { useCanvasFx } from "./canvas-fx";
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

const MAX_BLOTS = 8;
/** Depois disso a mancha parou de crescer e o loop pode dormir. */
const GROW_MS = 1400;

type Blot = { x: number; y: number; born: number; seed: number };

type InkConfig = {
  /** Array mutavel, compartilhado com o componente. */
  blots: Blot[];
  color: [number, number, number];
  spread: number;
  opacity: number;
};

const FRAG = `${GL_PRELUDE}
uniform vec4 uBlots[${MAX_BLOTS}];
uniform int uCount;
uniform vec3 uColor;
uniform float uSpread;
uniform float uOpacity;

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;
  vec2 p = rel / uDpr;

  float ink = 0.0;

  for (int i = 0; i < ${MAX_BLOTS}; i++) {
    if (i >= uCount) break;
    vec4 b = uBlots[i];
    vec2 d = p - b.xy;
    float age = b.z;
    float seed = b.w;

    /* Raiz do tempo: a mancha abre rapido e desacelera, como liquido que
     * encontra resistencia na fibra. */
    float r = uSpread * sqrt(age) * 0.85;
    if (r < 0.01) continue;

    float dist = length(d) / r;
    float ang = atan(d.y, d.x);

    /* Contorno irregular: lobos grandes + fibrilacao fina na beirada. */
    float lobes = fbm(vec2(cos(ang), sin(ang)) * 1.6 + seed) - 0.5;
    float fine = fbm(vec2(cos(ang), sin(ang)) * 7.0 + seed * 2.0) - 0.5;
    float edge = 1.0 + lobes * 0.55 + fine * 0.22;

    float body = 1.0 - S(edge * 0.72, edge, dist);

    /* Tendrilhos: a tinta corre pela fibra alem da borda principal. */
    float tend = fbm(d * 0.09 + seed * 3.0);
    float reach = 1.0 - S(edge, edge * (1.25 + 0.5 * tend), dist);
    ink += body + reach * tend * 0.45;
  }

  ink = clamp(ink, 0.0, 1.0);
  /* Nucleo mais escuro, beirada mais clara: tinta acumula no centro. */
  float depth = 0.65 + 0.35 * ink;
  float a = ink * uOpacity;
  outColor = vec4(uColor * depth * a, a);
}`;

const SPEC: GlSpec<InkConfig> = {
  frag: FRAG,
  defaults: {
    blots: [],
    color: [0.17, 0.15, 0.13],
    spread: 90,
    opacity: 0.85,
  },
  uniforms: (gl, loc, c) => {
    if (loc.uColor)
      gl.uniform3f(loc.uColor, c.color[0], c.color[1], c.color[2]);
    if (loc.uSpread) gl.uniform1f(loc.uSpread, c.spread);
    if (loc.uOpacity) gl.uniform1f(loc.uOpacity, c.opacity);

    const now = performance.now();
    const data = new Float32Array(MAX_BLOTS * 4);
    const count = Math.min(c.blots.length, MAX_BLOTS);
    for (let i = 0; i < count; i++) {
      const b = c.blots[i];
      data[i * 4] = b.x;
      data[i * 4 + 1] = b.y;
      /* Idade normalizada e saturada: depois de GROW_MS a mancha fica. */
      data[i * 4 + 2] = Math.min(1, (now - b.born) / GROW_MS);
      data[i * 4 + 3] = b.seed;
    }
    if (loc.uBlots) gl.uniform4fv(loc.uBlots, data);
    if (loc.uCount) gl.uniform1i(loc.uCount, count);
  },
};

export type InkBleedProps = {
  children: ReactNode;
  color?: [number, number, number];
  /** Tamanho final da mancha em px. */
  spread?: number;
  opacity?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Manchas de tinta que abrem na fibra do papel a cada clique.
 *
 * O raio cresce com a raiz do tempo, nao linear: liquido em papel abre rapido
 * e desacelera conforme a fibra resiste. A borda leva lobos largos, fibrilacao
 * fina e tendrilhos que correm alem do contorno -- as tres escalas que fazem
 * a mancha parecer tinta e nao um circulo borrado.
 *
 * As manchas ficam: e um caderno de viagem, tinta nao sai.
 */
export function InkBleed({
  children,
  color,
  spread = 90,
  opacity = 0.85,
  seed,
  className,
}: InkBleedProps) {
  const { enabled } = useCanvasFx();
  const blotsRef = useRef<Blot[]>([]);
  const [, bump] = useState(0);
  const seedValue = useMemo(() => (toSeed(seed, 13) % 53) / 3, [seed]);

  /* Ativo so enquanto alguma mancha ainda cresce. */
  const [growing, setGrowing] = useState(false);
  const stopRef = useRef(0);

  const options = useMemo<Partial<InkConfig>>(
    () => ({
      blots: blotsRef.current,
      spread,
      opacity: enabled ? opacity : 0,
      ...(color ? { color } : {}),
    }),
    [enabled, spread, opacity, color],
  );

  const gl = useGlEffect(SPEC, options, enabled && growing);

  const drop = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const r = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      /* Y pra cima, igual ao espaco do shader. */
      const y = r.height / 2 - (e.clientY - r.top);

      /* Mutar NO LUGAR e obrigatorio: `options` e memoizado sem depender das
       * manchas, entao trocar a referencia do array deixaria o shader lendo a
       * lista antiga pra sempre. */
      const arr = blotsRef.current;
      arr.push({
        x,
        y,
        born: performance.now(),
        seed: seedValue + arr.length * 1.7,
      });
      while (arr.length > MAX_BLOTS) arr.shift();

      setGrowing(true);
      window.clearTimeout(stopRef.current);
      stopRef.current = window.setTimeout(
        () => setGrowing(false),
        GROW_MS + 120,
      );
      bump((v) => v + 1);
    },
    [enabled, seedValue],
  );

  useEffect(() => () => window.clearTimeout(stopRef.current), []);

  return (
    <div className={cn("relative", className)} onPointerDown={drop}>
      <GlSurface gl={gl} blend="multiply">
        {children}
      </GlSurface>
    </div>
  );
}
