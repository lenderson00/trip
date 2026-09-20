import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PostageStampProps = {
  /** Imagem do selo. Se faltar, o miolo fica com a cor de fundo. */
  src?: string;
  alt?: string;
  /** Texto pequeno no rodape do selo. */
  label?: string;
  /** Valor no canto, tipo "80c". */
  value?: string;
  width?: number;
  background?: string;
  rotate?: number;
  children?: ReactNode;
  className?: string;
};

/**
 * Selo postal com borda perfurada.
 *
 * A perfuracao e feita com radial-gradient repetido nas quatro bordas, nao com
 * clip-path: assim o selo mantem sombra propria e o miolo continua sendo uma
 * caixa normal onde a foto se encaixa.
 */
export function PostageStamp({
  src,
  alt = "",
  label,
  value,
  width = 128,
  background = "var(--paper-white)",
  rotate = -3,
  children,
  className,
}: PostageStampProps) {
  const height = Math.round(width * 1.22);
  const teeth = 9;

  /* Os dentes sao furos da cor do fundo da pagina comendo a borda. */
  const perforation = `
    radial-gradient(circle at center, var(--paper-cream) 48%, transparent 49%) 0 0 / ${teeth}px ${teeth}px repeat-x,
    radial-gradient(circle at center, var(--paper-cream) 48%, transparent 49%) 0 100% / ${teeth}px ${teeth}px repeat-x,
    radial-gradient(circle at center, var(--paper-cream) 48%, transparent 49%) 0 0 / ${teeth}px ${teeth}px repeat-y,
    radial-gradient(circle at center, var(--paper-cream) 48%, transparent 49%) 100% 0 / ${teeth}px ${teeth}px repeat-y`;

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        width,
        height,
        background,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "var(--shadow-cut)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundImage: perforation }}
      />

      <div className="absolute inset-[9px] flex flex-col">
        <div className="relative flex-1 overflow-hidden border border-ink/15">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={`${width}px`}
              className="photo-graded object-cover"
            />
          ) : null}
          {children}
        </div>
        <div className="flex items-baseline justify-between px-0.5 pt-1">
          {label ? (
            <span className="font-body text-[7px] uppercase tracking-[0.12em] text-ink-soft">
              {label}
            </span>
          ) : null}
          {value ? (
            <span className="font-display text-[10px] leading-none text-ink">
              {value}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
