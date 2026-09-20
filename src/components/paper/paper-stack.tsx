import type { ReactNode } from "react";
import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type PaperStackProps = {
  /** Quantas folhas aparecem atras da de cima. */
  layers?: number;
  color?: string;
  /** Quao espalhadas ficam as folhas de baixo. */
  spread?: number;
  seed?: number | string;
  children: ReactNode;
  className?: string;
};

/**
 * Pilha de folhas: da peso a um card sem precisar de sombra pesada.
 */
export function PaperStack({
  layers = 2,
  color = "var(--paper-white)",
  spread = 6,
  seed,
  children,
  className,
}: PaperStackProps) {
  const rng = createRng(toSeed(seed, 17));
  const sheets = Array.from({ length: layers }, (_, i) => ({
    key: i,
    x: between(rng, -spread, spread),
    y: between(rng, 1, spread),
    r: between(rng, -2.6, 2.6),
  }));

  return (
    <div className={cn("relative isolate", className)}>
      {sheets.map((sheet, i) => (
        <span
          key={sheet.key}
          aria-hidden
          className="absolute inset-0 rounded-[3px]"
          style={{
            background: color,
            transform: `translate(${sheet.x}px, ${sheet.y}px) rotate(${sheet.r}deg)`,
            zIndex: -1 - i,
            boxShadow: "var(--shadow-lift)",
          }}
        />
      ))}
      <div className="relative">{children}</div>
    </div>
  );
}
