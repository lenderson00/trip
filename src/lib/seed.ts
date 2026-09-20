/**
 * Aleatoriedade deterministica.
 *
 * Regra do projeto: NENHUM componente chama Math.random() durante o render.
 * Rotacao de fita, ruido de borda rasgada, jitter das letras recortadas --
 * tudo nasce daqui. Math.random() geraria HTML diferente no servidor e no
 * cliente, e o React derrubaria a pagina com erro de hidratacao.
 */

/** PRNG mulberry32: rapido, sem dependencia, distribuicao boa o bastante. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deixa uma string virar seed, pra `seed="lisboa"` funcionar como `seed={7}`. */
export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function toSeed(
  seed: number | string | undefined,
  fallback = 1,
): number {
  if (seed === undefined) return fallback;
  return typeof seed === "number" ? seed : hashString(seed);
}

/** Float em [min, max). */
export function between(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

/** Item estavel de uma lista. */
export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

/**
 * Sequencia de N numeros em [min, max). Util pra gerar uma borda rasgada
 * ou o jitter de cada letra de uma manchete de uma vez so.
 */
export function series(
  rng: () => number,
  count: number,
  min: number,
  max: number,
): number[] {
  return Array.from({ length: count }, () => between(rng, min, max));
}
