"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/canvas-support";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type CrumpleConfig = {
  progress: number;
  paper: [number, number, number];
  seed: number;
  fold: number;
};

const FRAG = `${GL_PRELUDE}
uniform float uProgress;
uniform vec3 uPaper;
uniform float uSeed;
uniform float uFold;

vec4 sheet (vec2 s) {
  return vec4(paperAt(s / uDpr, uPaper, uSeed), 1.0);
}

void main () {
  if (uProgress <= 0.0005) { outColor = vec4(0.0); return; }

  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;

  float p = uProgress;
  float crush = clamp(p / 0.62, 0.0, 1.0);
  float toss = clamp((p - 0.62) / 0.38, 0.0, 1.0);

  /* Desfaz encolhimento, giro e queda pra achar o ponto na folha original. */
  float scale = 1.0 - 0.5 * crush;
  float ang = 0.3 * crush + 1.4 * toss * toss;
  vec2 off = vec2(
    30.0 * toss * uDpr,
    -(uRectHalf.y * 1.8 + 150.0 * uDpr) * toss * toss
  );
  vec2 q = rel - off;
  float ca = cos(-ang);
  float sa = sin(-ang);
  vec2 s = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca) / scale;

  /* O amassado: o espaco e dobrado sobre si mesmo. E isso que diferencia
   * amassar de encolher -- a folha passa por cima dela mesma. */
  float k = crush * uFold * uDpr;
  vec2 w = vec2(
    snoise(s * 0.010 + uSeed),
    snoise(s * 0.010 + 41.0 + uSeed)
  );
  vec2 sw = s + w * k;

  /* Silhueta comida por ruido: vira bola irregular, nao retangulo menor. */
  float nEdge = fbm(s * 0.02 + uSeed * 3.0);
  vec2 lim = uRectHalf * (1.0 - 0.12 * crush);
  float d = max(abs(sw.x) - lim.x, abs(sw.y) - lim.y);
  float inside = 1.0 - S(
    -5.0 * uDpr,
    5.0 * uDpr,
    d + (nEdge - 0.5) * 26.0 * crush * uDpr
  );
  if (inside <= 0.002) { outColor = vec4(0.0); return; }

  vec4 col = sheet(sw);

  /* Facetas: o gradiente do campo de dobra vira normal, e a luz direcional
   * transforma isso em vinco com lado claro e lado escuro. */
  float e = 3.0 * uDpr;
  float hC = fbm(sw * 0.014 + uSeed);
  float hX = fbm((sw + vec2(e, 0.0)) * 0.014 + uSeed);
  float hY = fbm((sw + vec2(0.0, e)) * 0.014 + uSeed);
  vec3 nrm = normalize(vec3((hC - hX) * 38.0 * crush, (hC - hY) * 38.0 * crush, 1.0));
  float lit = clamp(dot(nrm, normalize(vec3(0.42, 0.58, 0.74))), 0.0, 1.0);
  /* Faixa estreita de brilho: papel amassado tem vinco marcado mas continua
   * papel -- contraste demais vira pedra cinza. */
  col.rgb *= mix(1.0, 0.68 + 0.62 * lit, crush);

  float a = col.a * inside * (1.0 - S(0.6, 1.0, toss));
  outColor = vec4(col.rgb * a, a);
}`;

const SPEC: GlSpec<CrumpleConfig> = {
  frag: FRAG,
  defaults: {
    progress: 0,
    paper: [0.97, 0.956, 0.937],
    seed: 7,
    fold: 30,
  },
  uniforms: (gl, loc, c) => {
    if (loc.uProgress) gl.uniform1f(loc.uProgress, c.progress);
    if (loc.uPaper)
      gl.uniform3f(loc.uPaper, c.paper[0], c.paper[1], c.paper[2]);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
    if (loc.uFold) gl.uniform1f(loc.uFold, c.fold);
  },
};

export type CrumpleProps = {
  children: ReactNode;
  /** Dispara o amassado. Controlado por quem usa. */
  crumpled?: boolean;
  /** Chamado quando a animacao termina e o elemento pode sair da arvore. */
  onDone?: () => void;
  duration?: number;
  /** Quanto o espaco e dobrado. Maior = amassado mais violento. */
  fold?: number;
  /** Cor do papel quando nao ha captura do conteudo. */
  paperColor?: [number, number, number];
  seed?: number | string;
  className?: string;
};

/**
 * Amassa a folha e joga fora -- o gesto de descartar um plano.
 *
 * O amassado e domain warp no shader: o espaco da folha e dobrado sobre si
 * mesmo e o gradiente dessa dobra vira iluminacao de faceta, com lado claro e
 * lado escuro em cada vinco. Encolher o retangulo pareceria zoom; dobrar o
 * espaco parece papel.
 */
export function Crumple({
  children,
  crumpled = false,
  onDone,
  duration = 950,
  fold = 30,
  paperColor,
  seed,
  className,
}: CrumpleProps) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const seedValue = useMemo(() => (toSeed(seed, 7) % 83) / 5, [seed]);

  const options = useMemo<Partial<CrumpleConfig>>(
    () => ({
      progress,
      seed: seedValue,
      fold,
      ...(paperColor ? { paper: paperColor } : {}),
    }),
    [progress, seedValue, fold, paperColor],
  );

  const gl = useGlEffect(SPEC, options, progress > 0 && progress < 1);

  useEffect(() => {
    if (!crumpled) {
      setProgress(0);
      return;
    }
    /* Com movimento reduzido nao ha animacao: o elemento simplesmente sai. */
    if (prefersReducedMotion()) {
      setProgress(1);
      doneRef.current?.();
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else doneRef.current?.();
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [crumpled, duration]);

  return (
    <div className={cn("relative", className)}>
      <GlSurface
        gl={gl}
        hideContent={progress > 0}
        bleed={{ top: 40, right: 90, bottom: 240, left: 90 }}
      >
        {children}
      </GlSurface>
    </div>
  );
}
