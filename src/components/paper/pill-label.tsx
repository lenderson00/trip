import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PillLabelProps = {
  children: ReactNode;
  color?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  font?: "chunky" | "display" | "body";
  className?: string;
};

const SIZE = {
  sm: "px-3 py-1 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-lg",
} as const;

const FONT = {
  chunky: "font-chunky",
  display: "font-display",
  body: "font-body",
} as const;

/**
 * Pill arredondada: o cabecalho de dia em blush da ref. 1 e o badge de ano
 * em creme da ref. 2 sao o mesmo componente.
 */
export function PillLabel({
  children,
  color = "var(--blush)",
  textColor = "var(--ink)",
  size = "md",
  font = "chunky",
  className,
}: PillLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full leading-none",
        SIZE[size],
        FONT[font],
        className,
      )}
      style={{ backgroundColor: color, color: textColor }}
    >
      {children}
    </span>
  );
}
