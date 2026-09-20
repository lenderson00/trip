"use client";

import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { useCanvasFx } from "./canvas-fx";
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type ScratchConfig = {
  mask: HTMLCanvasElement | null;
  version: number;
  tint: [number, number, number];
  seed: number;
  shine: number;
};

type ScratchState = { tex: WebGLTexture | null; uploaded: number };

const FRAG = `${GL_PRELUDE}
uniform sampler2D uMask;
uniform vec3 uTint;
uniform float uSeed;
uniform float uShine;

vec3 spectrum (float t) {
  return 0.5 + 0.5 * cos(TAU * (vec3(0.0, 0.33, 0.67) + t));
}

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;
  if (any(greaterThan(abs(rel), uRectHalf))) { outColor = vec4(0.0); return; }

  vec2 uv = (rel + uRectHalf) / (2.0 * uRectHalf);
  float m = texture(uMask, vec2(uv.x, 1.0 - uv.y)).a;
  vec2 p = rel / uDpr;

  /* Limiar granulado: a tinta de raspadinha sai em floquinhos, nao numa
   * linha lisa. */
  float grit = fbm(p * 0.35 + uSeed);
  float th = 0.42 + (grit - 0.5) * 0.5;
  float gone = S(th - 0.05, th + 0.05, m);
  if (gone >= 0.999) { outColor = vec4(0.0); return; }

  /* Cobertura metalica com relevo e brilho varrendo. */
  float grooves = fbm(vec2(p.x * 0.05 + p.y * 0.02, p.y * 0.4) + uSeed * 2.0);
  float sweep = exp(-pow(uv.x + uv.y * 0.3 - (0.5 + 0.45 * sin(uTime * 0.5)), 2.0) / 0.03);
  /* A tinta manda; o arco-iris e so um verniz por cima. Invertendo essa
   * proporcao o componente vira holograma e deixa de parecer raspadinha. */
  vec3 col = uTint * (0.80 + 0.34 * grooves);
  col = mix(col, spectrum(grooves * 0.8 + uTime * 0.04), uShine * 0.14);
  col += sweep * uShine * 0.22;

  /* Beirada raspada: floquinhos claros soltos na fronteira. */
  float lip = S(th - 0.22, th, m) * (1.0 - gone);
  col = mix(col, col * 1.35 + 0.1, lip);

  float a = 1.0 - gone;
  outColor = vec4(col * a, a);
}`;

const SPEC: GlSpec<ScratchConfig, ScratchState> = {
  frag: FRAG,
  defaults: {
    mask: null,
    version: -1,
    tint: [0.72, 0.68, 0.62],
    seed: 17,
    shine: 1,
  },
  init: (gl) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0]),
    );
    return { tex, uploaded: -1 };
  },
  uniforms: (gl, loc, c, _frame, state) => {
    if (loc.uTint) gl.uniform3f(loc.uTint, c.tint[0], c.tint[1], c.tint[2]);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
    if (loc.uShine) gl.uniform1f(loc.uShine, c.shine);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, state.tex);
    if (c.mask && state.uploaded !== c.version && c.mask.width > 0) {
      state.uploaded = c.version;
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        c.mask,
      );
    }
    if (loc.uMask) gl.uniform1i(loc.uMask, 1);
    gl.activeTexture(gl.TEXTURE0);
  },
  dispose: (gl, state) => {
    if (state.tex) gl.deleteTexture(state.tex);
  },
};

export type ScratchOffProps = {
  /** O que esta escondido sob a cobertura. */
  children: ReactNode;
  /** Largura do raspao em px. */
  brush?: number;
  tint?: [number, number, number];
  /** Brilho metalico, 0 a 1. */
  shine?: number;
  /** Fracao raspada que dispara onReveal. */
  threshold?: number;
  onReveal?: () => void;
  seed?: number | string;
  className?: string;
};

/**
 * Raspadinha: uma cobertura metalica some onde o dedo passa.
 *
 * Para revelar destino, desconto ou surpresa do roteiro. A cobertura e um
 * shader com relevo e brilho varrendo; o traco vira mascara, e um limiar
 * granulado faz a tinta sair em floquinhos em vez de numa linha lisa.
 *
 * `onReveal` dispara uma unica vez quando a area raspada passa do limiar, pra
 * quem usa poder abrir o conteudo sem obrigar a raspar tudo.
 */
export function ScratchOff({
  children,
  brush = 34,
  tint,
  shine = 1,
  threshold = 0.5,
  onReveal,
  seed,
  className,
}: ScratchOffProps) {
  const { enabled } = useCanvasFx();
  const hostRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const revealedRef = useRef(false);
  const [version, setVersion] = useState(0);
  const seedValue = useMemo(() => (toSeed(seed, 17) % 61) / 4, [seed]);

  const options = useMemo<Partial<ScratchConfig>>(
    () => ({
      mask: maskRef.current,
      version,
      seed: seedValue,
      shine: enabled ? shine : 0,
      ...(tint ? { tint } : {}),
    }),
    [version, seedValue, shine, enabled, tint],
  );

  /* Ativo sempre: o brilho varre mesmo parado. */
  const gl = useGlEffect(SPEC, options, enabled);

  const ensureMask = useCallback(() => {
    const host = hostRef.current;
    if (!host) return null;
    const { width, height } = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(width * dpr));
    const h = Math.max(1, Math.round(height * dpr));

    let canvas = maskRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      maskRef.current = canvas;
    }
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return { canvas, dpr };
  }, []);

  /** Mede quanto ja foi raspado amostrando a mascara num grid esparso. */
  const checkReveal = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (revealedRef.current || !onReveal) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const step = 8;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let hit = 0;
      let total = 0;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          total++;
          if (data[(y * canvas.width + x) * 4 + 3] > 128) hit++;
        }
      }
      if (total > 0 && hit / total >= threshold) {
        revealedRef.current = true;
        onReveal();
      }
    },
    [onReveal, threshold],
  );

  const scratch = useCallback(
    (x: number, y: number) => {
      const made = ensureMask();
      if (!made) return;
      const { canvas, dpr } = made;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#fff";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brush;
      ctx.beginPath();
      const last = lastRef.current;
      if (last) {
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.01, y);
      }
      ctx.stroke();
      ctx.restore();

      lastRef.current = { x, y };
      setVersion((v) => v + 1);
      gl.instance.current?.wake();
      checkReveal(canvas);
    },
    [brush, ensureMask, gl, checkReveal],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    lastRef.current = null;
    scratch(e.clientX - r.left, e.clientY - r.top);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || !enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    scratch(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <div
      ref={hostRef}
      className={cn("relative select-none", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => {
        lastRef.current = null;
      }}
      style={{ touchAction: "none", cursor: enabled ? "grab" : undefined }}
    >
      <GlSurface gl={gl}>{children}</GlSurface>
    </div>
  );
}
