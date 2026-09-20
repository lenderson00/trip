import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PaperVariant =
  | "cream"
  | "white"
  | "kraft"
  | "news"
  | "grid"
  | "lined";

const SURFACE: Record<PaperVariant, string> = {
  cream: "bg-paper-cream",
  white: "bg-paper-white",
  kraft: "bg-paper-kraft",
  news: "bg-paper-news",
  grid: "bg-paper-white",
  lined: "bg-paper-white",
};

/* Pauta e quadriculado sao gradiente, nao imagem: acompanham a cor do papel
 * e nao pesam nada no bundle. */
const RULING: Partial<Record<PaperVariant, string>> = {
  grid: `repeating-linear-gradient(to right, rgb(91 110 140 / 0.16) 0 1px, transparent 1px 22px),
         repeating-linear-gradient(to bottom, rgb(91 110 140 / 0.16) 0 1px, transparent 1px 22px)`,
  lined: `repeating-linear-gradient(to bottom, transparent 0 27px, rgb(91 110 140 / 0.22) 27px 28px)`,
};

export type PaperSheetProps = {
  variant?: PaperVariant;
  /** Textura: grao fino, fibra grossa de reciclado, ou nenhuma. */
  texture?: "grain" | "fibers" | "none";
  children?: ReactNode;
  className?: string;
  as?: ElementType;
};

/**
 * Superficie base de todo o sistema. Tudo que parece papel comeca aqui.
 */
export function PaperSheet({
  variant = "cream",
  texture = "grain",
  children,
  className,
  as: Tag = "div",
}: PaperSheetProps) {
  const ruling = RULING[variant];

  return (
    <Tag
      className={cn(
        "relative isolate overflow-hidden",
        SURFACE[variant],
        texture === "grain" && "paper-grain",
        texture === "fibers" && "paper-fibers",
        className,
      )}
    >
      {ruling ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: ruling }}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
