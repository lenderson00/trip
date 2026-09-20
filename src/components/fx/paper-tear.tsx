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
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type TearConfig = {
  progress: number;
  at: number;
  jag: number;
  paper: [number, number, number];
  seed: number;
};

const FRAG = `${GL_PRELUDE}
uniform float uProgress;
uniform float uAt;
uniform float uJag;
uniform vec3 uPaper;
uniform float uSeed;

/* Altura da linha de rasgo em x, no espaco da folha (origem no centro). */
float tearLine (float x) {
  float n = fbm(vec2(x / uRectHalf.x * 2.6 + uSeed, uSeed * 0.7));
  float fine = snoise(vec2(x / uRectHalf.x * 11.0 + uSeed, uSeed)) * 0.28;
  float base = uRectHalf.y * (1.0 - 2.0 * uAt);
  return base + ((n - 0.5) * 2.0 + fine) * uJag;
}

/* Desfaz a transformacao de um pedaco pra achar de onde o pixel veio. */
vec2 unmap (vec2 p, vec2 offset, float angle) {
  vec2 q = p - offset;
  float c = cos(-angle);
  float s = sin(-angle);
  return vec2(q.x * c - q.y * s, q.x * s + q.y * c);
}

/* Cor da folha: papel com fibra. */
vec4 sheet (vec2 s) {
  return vec4(paperAt(s / uDpr, uPaper, uSeed), 1.0);
}

/* Borda rasgada: nucleo claro (miolo da fibra) e sombra do lado de dentro. */
vec3 tornEdge (vec3 col, vec2 s, float dist) {
  float fib = fibers(vec2(s.x * 0.05, s.y * 0.2) + uSeed * 3.0);
  float w = (2.0 + 5.0 * fib) * uDpr;
  float core = 1.0 - S(0.0, w, abs(dist));
  float inner = 1.0 - S(w, w * 4.5, abs(dist));
  col = mix(col, col * 0.82, inner * 0.5);
  col = mix(col, mix(uPaper, vec3(1.0), 0.55), core * 0.85);
  return col;
}

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;

  if (uProgress <= 0.0005) {
    outColor = vec4(0.0);
    return;
  }

  float p = uProgress;
  float ease = p * p * (3.0 - 2.0 * p);

  /* A parte de cima so levanta um pouco; a de baixo cai e gira. */
  vec2 topOff = vec2(0.0, 10.0 * ease * uDpr);
  float topRot = -0.012 * ease;
  vec2 botOff = vec2(
    18.0 * ease * uDpr,
    -(uRectHalf.y * 1.5 + 80.0 * uDpr) * ease * ease
  );
  float botRot = 0.32 * ease * ease;

  vec2 sTop = unmap(rel, topOff, topRot);
  vec2 sBot = unmap(rel, botOff, botRot);

  float lineTop = tearLine(sTop.x);
  float lineBot = tearLine(sBot.x);

  bool inTop = all(lessThanEqual(abs(sTop), uRectHalf)) && sTop.y >= lineTop;
  bool inBot = all(lessThanEqual(abs(sBot), uRectHalf)) && sBot.y < lineBot;

  vec4 col = vec4(0.0);

  /* Pedaco de baixo primeiro: some conforme cai. */
  if (inBot) {
    vec4 c = sheet(sBot);
    c.rgb = tornEdge(c.rgb, sBot, sBot.y - lineBot);
    c.rgb *= 1.0 - 0.25 * ease;
    c.a *= 1.0 - S(0.55, 1.0, p);
    col = c;
  }

  /* Sombra que o pedaco de cima joga no que ficou atras.
   * Ela mede a distancia ABAIXO da linha de rasgo e so existe abaixo dela e
   * dentro da largura da folha -- medir a distancia acima faria exp(0)=1 e
   * pintaria a area inteira de sombra. */
  float below = max(lineTop - sTop.y, 0.0);
  float shadow = exp(-below / (22.0 * uDpr))
    * step(sTop.y, lineTop)
    * S(uRectHalf.x + 12.0 * uDpr, uRectHalf.x, abs(sTop.x))
    * S(0.0, 0.12, p) * 0.45;
  if (!inTop && !inBot) {
    col = vec4(vec3(0.17, 0.15, 0.13), shadow);
  }

  if (inTop) {
    vec4 c = sheet(sTop);
    c.rgb = tornEdge(c.rgb, sTop, sTop.y - lineTop);
    col = vec4(c.rgb * c.a + col.rgb * col.a * (1.0 - c.a), 1.0);
  }

  outColor = vec4(col.rgb * col.a, col.a);
}`;

const SPEC: GlSpec<TearConfig> = {
  frag: FRAG,
  defaults: {
    progress: 0,
    at: 0.5,
    jag: 9,
    paper: [0.97, 0.956, 0.937],
    seed: 3,
  },
  uniforms: (gl, loc, c, frame) => {
    if (loc.uProgress) gl.uniform1f(loc.uProgress, c.progress);
    if (loc.uAt) gl.uniform1f(loc.uAt, c.at);
    if (loc.uJag) gl.uniform1f(loc.uJag, c.jag * frame.dpr);
    if (loc.uPaper)
      gl.uniform3f(loc.uPaper, c.paper[0], c.paper[1], c.paper[2]);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
  },
};

export type PaperTearProps = {
  children: ReactNode;
  /** O que aparece atras quando o papel rasga. */
  under?: ReactNode;
  /** Altura do rasgo, de 0 (topo) a 1 (base). */
  at?: number;
  /** Irregularidade do rasgo em px. */
  jaggedness?: number;
  /** Fracao do arraste que conclui o rasgo. */
  threshold?: number;
  /** Cor do papel quando nao ha captura do conteudo. */
  paperColor?: [number, number, number];
  onTear?: () => void;
  seed?: number | string;
  className?: string;
};

/**
 * Rasga a folha pra revelar o que esta atras.
 *
 * O rasgo e um shader WebGL2: a linha vem de ruido fbm, a borda ganha fibra e
 * nucleo claro, e o pedaco de baixo cai girando com sombra propria. Roda em
 * qualquer browser com WebGL2.
 *
 * Os dois pedacos sao papel desenhado pelo shader, nao o conteudo: durante o
 * rasgo o que estava impresso da lugar a folha limpa, e volta ao fim se o
 * arraste nao passar do limiar.
 */
export function PaperTear({
  children,
  under,
  at = 0.5,
  jaggedness = 9,
  threshold = 0.45,
  paperColor,
  onTear,
  seed,
  className,
}: PaperTearProps) {
  const [progress, setProgress] = useState(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: number; y0: number; h: number } | null>(null);
  const tweenRef = useRef(0);

  const seedValue = useMemo(() => (toSeed(seed, 3) % 97) / 7, [seed]);

  const options = useMemo<Partial<TearConfig>>(
    () => ({
      progress,
      at,
      jag: jaggedness,
      seed: seedValue,
      ...(paperColor ? { paper: paperColor } : {}),
    }),
    [progress, at, jaggedness, seedValue, paperColor],
  );

  const gl = useGlEffect(SPEC, options, progress > 0 && progress < 1);

  /* Tween de solta: completa o rasgo ou devolve a folha ao lugar. */
  const tween = useCallback(
    (to: number, done?: () => void) => {
      cancelAnimationFrame(tweenRef.current);
      const from = progress;
      const start = performance.now();
      const dur = 420;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const e = 1 - (1 - t) ** 3;
        setProgress(from + (to - from) * e);
        if (t < 1) tweenRef.current = requestAnimationFrame(step);
        else done?.();
      };
      tweenRef.current = requestAnimationFrame(step);
    },
    [progress],
  );

  useEffect(() => () => cancelAnimationFrame(tweenRef.current), []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const host = hostRef.current;
    if (!host || progress >= 1) return;
    cancelAnimationFrame(tweenRef.current);
    dragRef.current = {
      id: e.pointerId,
      y0: e.clientY,
      h: host.getBoundingClientRect().height || 1,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const raw = (e.clientY - drag.y0) / (drag.h * 0.7);
    setProgress(Math.max(0, Math.min(1, raw)));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    if (progress >= threshold) tween(1, () => onTear?.());
    else tween(0);
  };

  return (
    <div
      ref={hostRef}
      className={cn("relative select-none", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: "none" }}
    >
      <GlSurface
        gl={gl}
        under={under}
        hideContent={progress > 0}
        bleed={{ bottom: 220, left: 60, right: 60, top: 30 }}
      >
        {children}
      </GlSurface>
    </div>
  );
}
