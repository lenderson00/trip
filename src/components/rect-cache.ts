/**
 * Cache do bounding rect de um elemento.
 *
 * Os componentes do Canvas UI importam `../rect-cache`, mas o registry nao
 * entrega o arquivo junto (o item so traz o .tsx do efeito e nao declara essa
 * dependencia), entao ele vive aqui.
 *
 * Existe pra que os handlers de ponteiro nao chamem getBoundingClientRect a
 * cada movimento: essa leitura forca sincronizacao de layout e, num handler
 * que dispara dezenas de vezes por segundo sobre um canvas animado, e
 * exatamente o que derruba o frame rate. O valor e relido so quando o
 * elemento muda de tamanho ou a pagina rola.
 */

export type RectCache = {
  /** Ultimo rect conhecido do elemento. */
  readonly current: DOMRect;
  /** Forca releitura imediata. */
  refresh: () => void;
  destroy: () => void;
};

const EMPTY: DOMRect = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  toJSON: () => ({}),
};

export function createRectCache(element: Element | null): RectCache {
  let rect: DOMRect = EMPTY;
  let frame = 0;

  if (!element || typeof window === "undefined") {
    return {
      get current() {
        return rect;
      },
      refresh: () => {},
      destroy: () => {},
    };
  }

  const read = () => {
    rect = element.getBoundingClientRect();
  };

  /* Agrupa rajadas de eventos numa leitura por frame. */
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      read();
    });
  };

  read();

  const observer = new ResizeObserver(schedule);
  observer.observe(element);

  /* Scroll muda left/top sem mudar o tamanho, entao o ResizeObserver sozinho
   * nao basta. Passive + capture pega rolagem de qualquer ancestral. */
  window.addEventListener("scroll", schedule, { passive: true, capture: true });
  window.addEventListener("resize", schedule, { passive: true });

  return {
    get current() {
      return rect;
    },
    refresh: read,
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    },
  };
}
