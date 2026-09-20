import { between, createRng, pick, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type RansomHeadlineProps = {
  children: string;
  /** Papeis sorteados pra cada letra. */
  palette?: string[];
  /** Grau maximo de inclinacao por letra. */
  jitter?: number;
  size?: number;
  seed?: number | string;
  className?: string;
};

const DEFAULT_PALETTE = [
  "var(--paper-white)",
  "var(--paper-kraft)",
  "var(--blush)",
  "var(--mustard)",
  "var(--sage)",
  "var(--paper-news)",
];

const FONTS = [
  "var(--font-fraunces), serif",
  "var(--font-fredoka), sans-serif",
  "var(--font-dm-sans), sans-serif",
];

/**
 * Manchete de letras recortadas de revista.
 *
 * Cada letra sai da mesma seed: papel, fonte, inclinacao e deslocamento
 * vertical proprios. A palavra inteira e exposta como uma so pro leitor de
 * tela -- letra a letra seria soletrado.
 */
export function RansomHeadline({
  children,
  palette = DEFAULT_PALETTE,
  jitter = 7,
  size = 44,
  seed,
  className,
}: RansomHeadlineProps) {
  const rng = createRng(toSeed(seed, 23));
  const letters = [...children];

  return (
    <span
      className={cn("inline-flex flex-wrap items-center gap-x-0.5", className)}
      aria-label={children}
      role="img"
    >
      {letters.map((char, i) => {
        if (char === " ") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: posicao e a identidade da letra
            <span key={i} aria-hidden style={{ width: size * 0.3 }} />
          );
        }
        const rotate = between(rng, -jitter, jitter);
        const shift = between(rng, -size * 0.07, size * 0.07);
        const pad = between(rng, 0.1, 0.2);
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: posicao e a identidade da letra
            key={i}
            aria-hidden
            className="inline-block leading-none"
            style={{
              background: pick(rng, palette),
              fontFamily: pick(rng, FONTS),
              fontSize: size,
              fontWeight: 700,
              color: "var(--ink)",
              padding: `${size * pad}px ${size * 0.13}px`,
              transform: `rotate(${rotate}deg) translateY(${shift}px)`,
              boxShadow: "var(--shadow-lift)",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
