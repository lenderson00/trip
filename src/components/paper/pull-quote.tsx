import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Highlighter } from "./highlighter";

export type PullQuoteProps = {
  children: ReactNode;
  /** Quem disse. Some se nao vier. */
  author?: string;
  /** Marca-texto atras da citacao. */
  highlight?: boolean;
  highlightColor?: string;
  align?: "left" | "center";
  seed?: number | string;
  className?: string;
};

/**
 * Citacao destacada de revista: aspas grandes, serifa, e um marca-texto
 * opcional por tras.
 */
export function PullQuote({
  children,
  author,
  highlight = false,
  highlightColor = "var(--mustard)",
  align = "left",
  seed,
  className,
}: PullQuoteProps) {
  const body = highlight ? (
    <Highlighter color={highlightColor} seed={seed}>
      {children}
    </Highlighter>
  ) : (
    children
  );

  return (
    <figure
      className={cn(
        "relative max-w-md",
        align === "center" && "text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-7 select-none font-display text-7xl leading-none text-terracotta/35"
      >
        &ldquo;
      </span>
      <blockquote className="relative font-display text-2xl leading-snug text-ink">
        {body}
      </blockquote>
      {author ? (
        <figcaption className="mt-3 font-hand text-xl text-caramel">
          — {author}
        </figcaption>
      ) : null}
    </figure>
  );
}
