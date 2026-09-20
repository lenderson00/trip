import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PhotoCornersProps = {
  children: ReactNode;
  /** Tamanho da cantoneira em px. */
  size?: number;
  color?: string;
  /** Quais cantos recebem cantoneira. */
  corners?: Array<"tl" | "tr" | "bl" | "br">;
  className?: string;
};

const ALL: Array<"tl" | "tr" | "bl" | "br"> = ["tl", "tr", "bl", "br"];

/* Cada canto e o mesmo triangulo, so girado. */
const ROTATION = { tl: 0, tr: 90, br: 180, bl: 270 } as const;
const PLACE = {
  tl: { top: 0, left: 0 },
  tr: { top: 0, right: 0 },
  br: { bottom: 0, right: 0 },
  bl: { bottom: 0, left: 0 },
} as const;

/**
 * Cantoneiras de album, aquelas que prendem a foto sem colar nela.
 *
 * O corte diagonal interno e o que faz a cantoneira parecer um bolso de papel
 * com a foto enfiada dentro, em vez de um triangulo colado por cima.
 */
export function PhotoCorners({
  children,
  size = 26,
  color = "var(--ink-soft)",
  corners = ALL,
  className,
}: PhotoCornersProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      {children}
      {corners.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            ...PLACE[corner],
            width: size,
            height: size,
            transform: `rotate(${ROTATION[corner]}deg)`,
          }}
        >
          <svg
            viewBox="0 0 26 26"
            width={size}
            height={size}
            style={{ display: "block" }}
          >
            <title>Cantoneira</title>
            {/* Triangulo externo com a boca do bolso recortada. */}
            <path d="M0 0 H26 L0 26 Z" fill={color} opacity={0.92} />
            <path
              d="M4.5 4.5 H17 L4.5 17 Z"
              fill="var(--paper-cream)"
              opacity={0.35}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
