import { hashString } from "./seed";

/**
 * ID estavel para filtro SVG, derivado dos proprios parametros do filtro.
 *
 * Por que nao `useId()`: hooks nao rodam em Server Component, e quase todo
 * componente de papel e server. Derivando do parametro, dois filtros iguais
 * compartilham o mesmo ID (inofensivo -- sao identicos) e dois filtros
 * diferentes nunca colidem, que e a unica colisao que importa.
 */
export function filterId(
  prefix: string,
  ...parts: Array<string | number>
): string {
  return `${prefix}-${hashString(parts.join(":")).toString(36)}`;
}

/** Sombra de contorno branco de adesivo die-cut (o recorte da ref. 1). */
export function stickerOutline(width = 3, color = "#fff"): string {
  const ring = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const x = (Math.cos(angle) * width).toFixed(2);
    const y = (Math.sin(angle) * width).toFixed(2);
    return `drop-shadow(${x}px ${y}px 0 ${color})`;
  }).join(" ");
  return `${ring} drop-shadow(0 6px 10px rgb(43 38 34 / 0.22))`;
}
