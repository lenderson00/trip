/**
 * Deteccao das duas capacidades, que sao independentes.
 *
 * WebGL2 faz o efeito rodar; html-in-canvas faz o efeito carregar a interface
 * viva. Tratar as duas como uma so deixaria os efeitos invisiveis em todo
 * browser sem a flag.
 *
 * A API html-in-canvas sao DOIS membros: `ctx.drawElementImage(el, x, y)` e
 * `canvas.requestPaint()`. Checar so um nome (ou o inexistente `drawElement`)
 * da falso-negativo num Chrome corretamente configurado.
 */

export const CANVAS_FLAG_URL = "chrome://flags/#canvas-draw-element";

type PaintableCanvas = HTMLCanvasElement & { requestPaint?: () => void };
type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => void;
};

/*
 * As sondagens sao memoizadas de proposito.
 *
 * `supportsWebGL2` cria um canvas e pede um contexto; chamada a cada render
 * (useSyncExternalStore faz exatamente isso), ela vaza um contexto por
 * chamada. O browser limita quantos contextos WebGL existem ao mesmo tempo --
 * por volta de 16 -- e, passado o limite, `getContext` comeca a devolver null
 * ate para quem tem GPU de sobra. O resultado nao muda durante a sessao,
 * entao sondar uma vez e o certo de qualquer forma.
 */
let webgl2Cache: boolean | null = null;
let htmlInCanvasCache: boolean | null = null;

export function supportsWebGL2(): boolean {
  if (webgl2Cache !== null) return webgl2Cache;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    webgl2Cache = Boolean(gl);
    /* Devolve o contexto ao browser em vez de esperar o GC. */
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return webgl2Cache;
  } catch {
    webgl2Cache = false;
    return false;
  }
}

export function supportsHtmlInCanvas(): boolean {
  if (htmlInCanvasCache !== null) return htmlInCanvasCache;
  if (typeof document === "undefined") return false;
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  htmlInCanvasCache = Boolean(
    ctx &&
      typeof ctx.drawElementImage === "function" &&
      typeof probe.requestPaint === "function",
  );
  return htmlInCanvasCache;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
