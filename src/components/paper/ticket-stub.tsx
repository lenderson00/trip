import type { ReactNode } from "react";
import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type TicketStubProps = {
  /** Corpo principal do bilhete. */
  children: ReactNode;
  /** Canhoto destacavel depois da picotagem. */
  stub?: ReactNode;
  color?: string;
  /** Codigo de barras no canhoto. */
  barcode?: boolean;
  rotate?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Bilhete com picotagem: dois entalhes laterais, linha pontilhada no meio e
 * um canhoto destacavel.
 *
 * Os entalhes sao radial-gradient da cor do fundo, nao clip-path: assim o
 * bilhete continua com sombra propria e cantos arredondados de verdade.
 */
export function TicketStub({
  children,
  stub,
  color = "var(--paper-white)",
  barcode = true,
  rotate = -1,
  seed,
  className,
}: TicketStubProps) {
  const rng = createRng(toSeed(seed, 43));
  const bars = Array.from({ length: 28 }, (_, i) => ({
    key: i,
    w: between(rng, 1, 4),
  }));

  return (
    <div
      className={cn("inline-flex overflow-hidden rounded-md", className)}
      style={{
        background: color,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "var(--shadow-cut)",
      }}
    >
      <div className="p-5">{children}</div>

      {stub || barcode ? (
        <>
          {/* Picotagem: entalhes em cima e embaixo + tracejado vertical. */}
          <div className="relative w-0">
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-paper-cream"
            />
            <span
              aria-hidden
              className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-paper-cream"
            />
            <span
              aria-hidden
              className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, var(--ink-faint) 0 5px, transparent 5px 10px)",
              }}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 p-5">
            {stub}
            {barcode ? (
              <span aria-hidden className="flex h-10 items-end gap-[2px]">
                {bars.map((bar) => (
                  <span
                    key={bar.key}
                    className="block h-full bg-ink"
                    style={{ width: bar.w }}
                  />
                ))}
              </span>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
