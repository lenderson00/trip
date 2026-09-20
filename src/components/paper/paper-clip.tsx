import { cn } from "@/lib/utils";

export type PaperClipProps = {
  size?: number;
  color?: string;
  rotate?: number;
  className?: string;
};

/**
 * Clipe de papel.
 *
 * O traco tem duas passadas: uma escura por baixo e uma clara deslocada por
 * cima. E o minimo pra arame parecer metal redondo em vez de linha chapada.
 */
export function PaperClip({
  size = 44,
  color = "var(--ink-soft)",
  rotate = -12,
  className,
}: PaperClipProps) {
  const d = "M17 46 V15 a8 8 0 0 1 16 0 v30 a12 12 0 0 1 -24 0 V18";

  return (
    <svg
      viewBox="0 0 42 64"
      width={size}
      height={(size * 64) / 42}
      className={cn("shrink-0 overflow-visible", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 2px 2px rgb(43 38 34 / 0.28))",
      }}
      role="presentation"
      aria-hidden
    >
      <title>Clipe de papel</title>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.55}
        strokeWidth={1.6}
        strokeLinecap="round"
        transform="translate(-1.1 -1.1)"
      />
    </svg>
  );
}
