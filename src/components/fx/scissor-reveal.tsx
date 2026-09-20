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
import { GL_PRELUDE, type GlSpec } from "./gl-effect";
import { GlSurface, useGlEffect } from "./gl-surface";

type ScissorConfig = {
  /** Canvas 2D onde o traco do corte e acumulado. */
  mask: HTMLCanvasElement | null;
  /** Sobe quando o traco muda, pra disparar o upload da textura. */
  version: number;
  paper: [number, number, number];
  seed: number;
  active: number;
};

type ScissorState = { tex: WebGLTexture | null; uploaded: number };

const FRAG = `${GL_PRELUDE}
uniform sampler2D uMask;
uniform vec3 uPaper;
uniform float uSeed;
uniform float uActive;

vec4 sheet (vec2 s) {
  return vec4(paperAt(s / uDpr, uPaper, uSeed), 1.0);
}

void main () {
  if (uActive < 0.5) { outColor = vec4(0.0); return; }

  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;

  if (any(greaterThan(abs(rel), uRectHalf))) { outColor = vec4(0.0); return; }

  vec2 uv = (rel + uRectHalf) / (2.0 * uRectHalf);
  float m = texture(uMask, vec2(uv.x, 1.0 - uv.y)).a;

  /* O limiar e ruidoso: tesoura nao corta numa linha lisa, ela avanca em
   * dentes e deixa fibra pra fora. */
  float fib = fibers(rel * 0.06 / uDpr + uSeed * 2.0);
  float th = 0.5 + (fib - 0.5) * 0.55;

  float cut = S(th - 0.06, th + 0.06, m);
  if (cut >= 0.999) { outColor = vec4(0.0); return; }

  vec4 c = sheet(rel);

  /* Fibra branca do miolo do papel na beirada do corte. */
  float lip = S(th - 0.30, th - 0.02, m) * (1.0 - cut);
  c.rgb = mix(c.rgb, mix(uPaper, vec3(1.0), 0.6), lip * 0.8);
  c.rgb = mix(c.rgb, c.rgb * 0.86, S(th - 0.45, th - 0.24, m) * 0.7);

  float a = c.a * (1.0 - cut);
  outColor = vec4(c.rgb * a, a);
}`;

const SPEC: GlSpec<ScissorConfig, ScissorState> = {
  frag: FRAG,
  defaults: {
    mask: null,
    version: -1,
    paper: [0.97, 0.956, 0.937],
    seed: 5,
    active: 0,
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
    if (loc.uPaper)
      gl.uniform3f(loc.uPaper, c.paper[0], c.paper[1], c.paper[2]);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
    if (loc.uActive) gl.uniform1f(loc.uActive, c.active);

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

const SCISSORS =
  "M6 4 L15 14 M6 20 L15 10 M13.2 12 L20 12 M4.2 4 a2 2 0 1 0 0 -0.1 M4.2 20 a2 2 0 1 0 0 -0.1";

export type ScissorRevealProps = {
  children: ReactNode;
  /** Camada revelada por onde a tesoura passa. */
  under: ReactNode;
  /** Largura do corte em px. */
  cut?: number;
  /** Mostra a tesoura seguindo o ponteiro. */
  cursor?: boolean;
  /** Cor do papel quando nao ha captura do conteudo. */
  paperColor?: [number, number, number];
  seed?: number | string;
  className?: string;
};

/**
 * Tesoura que corta a folha de cima e revela a de baixo.
 *
 * O traco e acumulado num canvas 2D e entra no shader como mascara. O corte
 * nao segue o traco liso: um limiar ruidoso deixa a beirada em dentes, com a
 * fibra branca do miolo do papel aparecendo. Roda com WebGL2 em qualquer
 * browser.
 */
export function ScissorReveal({
  children,
  under,
  cut = 30,
  cursor = true,
  paperColor,
  seed,
  className,
}: ScissorRevealProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [version, setVersion] = useState(0);
  const [cutting, setCutting] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const seedValue = useMemo(() => (toSeed(seed, 5) % 89) / 6, [seed]);

  const options = useMemo<Partial<ScissorConfig>>(
    () => ({
      mask: maskRef.current,
      version,
      seed: seedValue,
      active: cutting ? 1 : 0,
      ...(paperColor ? { paper: paperColor } : {}),
    }),
    [version, seedValue, cutting, paperColor],
  );

  const gl = useGlEffect(SPEC, options, false);

  /** Cria (ou redimensiona) o canvas de mascara na resolucao do elemento. */
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

  const carve = useCallback(
    (x: number, y: number) => {
      const made = ensureMask();
      if (!made) return;
      const { canvas, dpr } = made;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#fff";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = cut;

      const last = lastRef.current;
      ctx.beginPath();
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
    },
    [cut, ensureMask, gl],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    ensureMask();
    setCutting(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    lastRef.current = null;
    carve(e.clientX - r.left, e.clientY - r.top);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (cursor) setTip({ x, y });
    if (e.buttons === 1) carve(x, y);
  };

  const stop = () => {
    lastRef.current = null;
  };

  return (
    <div
      ref={hostRef}
      className={cn("relative select-none", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerLeave={() => {
        stop();
        setTip(null);
      }}
      style={{ touchAction: "none", cursor: cursor ? "none" : undefined }}
    >
      <GlSurface gl={gl} under={under} hideContent={cutting}>
        {children}
      </GlSurface>

      {tip ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute z-20"
          width={30}
          height={30}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.7}
          strokeLinecap="round"
          style={{
            left: tip.x - 4,
            top: tip.y - 15,
            transform: "rotate(-12deg)",
          }}
        >
          <title>Tesoura</title>
          <path d={SCISSORS} />
        </svg>
      ) : null}
    </div>
  );
}
