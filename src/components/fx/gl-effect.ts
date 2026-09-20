/**
 * Runtime WebGL2 compartilhado pelos efeitos de papel.
 *
 * Tudo que todo efeito repetiria (compilar, uniforms, loop, observers,
 * limpeza) mora aqui, pra que cada efeito seja so um fragment shader e seus
 * uniforms.
 *
 * Nao ha captura de conteudo: os efeitos desenham papel, tinta e luz por
 * conta propria, entao rodam igual em Chrome, Safari e Firefox, sem flag.
 */

export type GlRect = { cx: number; cy: number; hx: number; hy: number };

export type GlFrame = {
  /** Segundos acumulados, ja multiplicados pela velocidade do efeito. */
  time: number;
  dpr: number;
  /** Caixa do conteudo em pixels de device, com Y pra cima. */
  rect: GlRect;
};

export type GlSpec<C extends object, S = void> = {
  frag: string;
  defaults: C;
  /**
   * Recursos de GPU proprios do efeito, criados uma vez por instancia. E como
   * os efeitos de mascara guardam a textura do traco sem que o runtime
   * precise conhecer o assunto.
   */
  init?: (gl: WebGL2RenderingContext) => S;
  /** Empurra os uniforms proprios do efeito. */
  uniforms: (
    gl: WebGL2RenderingContext,
    loc: Record<string, WebGLUniformLocation>,
    config: C,
    frame: GlFrame,
    state: S,
  ) => void;
  dispose?: (gl: WebGL2RenderingContext, state: S) => void;
  /** Multiplicador de tempo. Default 1. */
  speed?: (config: C) => number;
};

export type GlElements = {
  /** Elemento medido: define a caixa que o shader recebe em uRect*. */
  content: HTMLElement;
  /** Canvas onde o WebGL desenha. */
  output: HTMLCanvasElement;
};

export type GlInstance<C extends object> = {
  setOptions: (next: Partial<C>) => void;
  /**
   * Liga/desliga o loop. Desligado, desenha um ultimo quadro e para -- e o
   * que evita queimar GPU em efeito parado.
   */
  setActive: (active: boolean) => void;
  /** Desenha um quadro agora. */
  wake: () => void;
  resize: () => void;
  destroy: () => void;
};

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main () {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/**
 * Prelude de todo fragment shader: uniforms comuns, ruido simplex, fbm, fibra
 * de papel, hash e SDF de retangulo.
 *
 * Coordenadas: `rel` = pixel menos uRectCenter, com Y crescendo pra cima.
 */
export const GL_PRELUDE = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uRectCenter;
uniform vec2 uRectHalf;
uniform float uDpr;

#define S(a, b, t) smoothstep(a, b, t)
#define TAU 6.28318530718

vec3 permute (vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise (vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm (vec2 p) {
  mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
  float v = 0.5 * snoise(p);
  p = m * p * 2.03 + vec2(11.3, 7.1);
  v += 0.27 * snoise(p);
  p = m * p * 1.97 + vec2(3.7, 19.1);
  v += 0.15 * snoise(p);
  return v * 0.5 + 0.5;
}

/** Fibra de papel: ruido esticado numa direcao, como polpa prensada. */
float fibers (vec2 p) {
  return fbm(vec2(p.x * 0.35, p.y * 5.0)) * 0.6 + fbm(p * 2.3) * 0.4;
}

vec2 hash2 (vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)),
    dot(p, vec2(419.2, 371.9)));
  return fract(sin(q.xy) * 43758.5453);
}

float hash1 (vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float sdRoundRect (vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

/** Cor de papel com fibra, usada por todo efeito que desenha folha. */
vec3 paperAt (vec2 s, vec3 base, float seed) {
  float f = fibers(s * 0.04 + seed);
  return base * (0.94 + 0.1 * f);
}
`;

export function createGlEffect<C extends object, S = void>(
  elements: GlElements,
  spec: GlSpec<C, S>,
  options: Partial<C> = {},
): GlInstance<C> | null {
  const { content, output } = elements;
  const config = { ...spec.defaults, ...options } as C;

  const gl = output.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl || gl.isContextLost()) return null;

  function compile(type: number, text: string): WebGLShader | null {
    const shader = gl?.createShader(type);
    if (!gl || !shader) return null;
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("gl-effect shader:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, spec.frag);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("gl-effect link:", gl.getProgramInfoLog(program));
    return null;
  }

  const loc: Record<string, WebGLUniformLocation> = {};
  const total = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < total; i++) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    const l = gl.getUniformLocation(program, info.name);
    if (!l) continue;
    loc[info.name] = l;
    /* Array uniform vem nomeado "uFoo[0]". Registrar tambem como "uFoo" evita
     * que o efeito procure por um nome que nunca existe -- falha silenciosa:
     * o uniform fica zerado e o shader simplesmente nao desenha nada. */
    if (info.name.endsWith("[0]")) loc[info.name.slice(0, -3)] = l;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const state = spec.init ? spec.init(gl) : (undefined as S);

  const rect: GlRect = { cx: 0, cy: 0, hx: 1, hy: 1 };
  let dpr = 1;

  function syncSize() {
    if (!gl) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(output.clientWidth * dpr));
    const h = Math.max(1, Math.round(output.clientHeight * dpr));
    if (output.width !== w || output.height !== h) {
      output.width = w;
      output.height = h;
    }

    const outRect = output.getBoundingClientRect();
    const boxRect = content.getBoundingClientRect();
    if (outRect.width > 0 && boxRect.width > 0) {
      rect.cx = (boxRect.left + boxRect.right) / 2 - outRect.left;
      /* Y invertido: o shader trabalha com a origem embaixo. */
      rect.cy = outRect.bottom - (boxRect.top + boxRect.bottom) / 2;
      rect.hx = boxRect.width / 2;
      rect.hy = boxRect.height / 2;
    }
  }

  syncSize();

  let time = 0;

  function render() {
    if (!gl || !program) return;
    /* gl.useProgram e a API do WebGL, nao um React hook: o lint so reage ao
     * prefixo "use" no nome. */
    // biome-ignore lint/correctness/useHookAtTopLevel: ver nota acima
    gl.useProgram(program);

    if (loc.uResolution)
      gl.uniform2f(loc.uResolution, output.width, output.height);
    if (loc.uTime) gl.uniform1f(loc.uTime, time);
    if (loc.uRectCenter)
      gl.uniform2f(loc.uRectCenter, rect.cx * dpr, rect.cy * dpr);
    if (loc.uRectHalf)
      gl.uniform2f(
        loc.uRectHalf,
        Math.max(rect.hx * dpr, 1),
        Math.max(rect.hy * dpr, 1),
      );
    if (loc.uDpr) gl.uniform1f(loc.uDpr, dpr);

    spec.uniforms(gl, loc, config, { time, dpr, rect }, state);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, output.width, output.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  let raf = 0;
  let last = performance.now();
  let destroyed = false;
  let running = false;
  let active = false;
  let visible = true;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motion.matches;

  function frame(now: number) {
    if (destroyed) return;
    if (!visible || !active) {
      running = false;
      return;
    }
    const delta = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (!reduced) time += delta * (spec.speed?.(config) ?? 1);
    render();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (destroyed || running || !visible || !active) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function wakeFn() {
    if (destroyed) return;
    if (active) start();
    else render();
  }

  function onMotion() {
    reduced = motion.matches;
    start();
  }
  motion.addEventListener("change", onMotion);

  const resizeObs = new ResizeObserver(() => {
    syncSize();
    wakeFn();
  });
  resizeObs.observe(output);
  resizeObs.observe(content);

  const interObs = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1]?.isIntersecting ?? true;
    if (visible) start();
  });
  interObs.observe(output);

  render();

  return {
    setOptions(next) {
      Object.assign(config as object, next);
      wakeFn();
    },
    setActive(value) {
      if (active === value) return;
      active = value;
      if (value) start();
      else render();
    },
    wake: wakeFn,
    resize() {
      syncSize();
      wakeFn();
    },
    destroy() {
      destroyed = true;
      active = false;
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
      interObs.disconnect();
      motion.removeEventListener("change", onMotion);
      if (gl) {
        spec.dispose?.(gl, state);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(quad);
      }
    },
  };
}
