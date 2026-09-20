import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PassportStamp } from "./passport-stamp";

export type PostcardFlipProps = {
  src: string;
  alt: string;
  /** Mensagem manuscrita no verso. */
  message: ReactNode;
  /** Destinatario, nas linhas do lado direito do verso. */
  to?: string;
  place?: string;
  width?: number;
  className?: string;
};

/**
 * Postal que vira e mostra o verso.
 *
 * A virada e CSS puro disparada por hover E focus, dentro de um <button> --
 * assim funciona no teclado, continua Server Component e respeita
 * prefers-reduced-motion (a transicao e neutralizada no globals.css).
 */
export function PostcardFlip({
  src,
  alt,
  message,
  to,
  place = "Lisboa",
  width = 300,
  className,
}: PostcardFlipProps) {
  const height = Math.round(width * 0.66);

  return (
    <button
      type="button"
      aria-label={`Postal de ${place}. Ative para ver o verso.`}
      className={cn("group block [perspective:1200px]", className)}
      style={{ width, height }}
    >
      <div
        className={cn(
          "relative size-full transition-transform duration-700 [transform-style:preserve-3d]",
          "group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]",
        )}
        style={{ transitionTimingFunction: "var(--ease-paper)" }}
      >
        {/* Frente */}
        <span
          className="absolute inset-0 overflow-hidden rounded-sm bg-white p-2 [backface-visibility:hidden]"
          style={{ boxShadow: "var(--shadow-cut)" }}
        >
          <span className="relative block size-full overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              sizes={`${width}px`}
              className="photo-graded object-cover"
            />
          </span>
        </span>

        {/* Verso */}
        <span
          className="absolute inset-0 flex gap-3 rounded-sm bg-paper-white p-4 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ boxShadow: "var(--shadow-cut)" }}
        >
          <span className="flex-1 font-hand text-lg leading-tight text-ink">
            {message}
          </span>

          <span className="w-px bg-ink/15" />

          <span className="flex w-2/5 flex-col justify-between">
            <PassportStamp
              place={place}
              size={62}
              rotate={8}
              color="var(--terracotta)"
              className="self-end"
            />
            <span className="space-y-2">
              {to ? (
                <span className="block font-hand text-base text-ink">{to}</span>
              ) : null}
              <span aria-hidden className="block space-y-2">
                <span className="block h-px bg-ink/25" />
                <span className="block h-px bg-ink/25" />
                <span className="block h-px w-2/3 bg-ink/25" />
              </span>
            </span>
          </span>
        </span>
      </div>
    </button>
  );
}
