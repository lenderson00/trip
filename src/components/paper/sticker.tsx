import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StickerProps = {
  shape?: "rounded" | "pill" | "circle" | "seal";
  color?: string;
  textColor?: string;
  rotate?: number;
  /** Cantinho descolando, como adesivo comecando a soltar. */
  peel?: boolean;
  children: ReactNode;
  className?: string;
};

const SHAPE: Record<NonNullable<StickerProps["shape"]>, string> = {
  rounded: "rounded-xl",
  pill: "rounded-full",
  circle: "rounded-full aspect-square",
  seal: "rounded-[38%_62%_55%_45%/50%_42%_58%_50%]",
};

/**
 * Adesivo die-cut: borda branca grossa, sombra curta e, se quiser, um
 * cantinho ja descolando.
 */
export function Sticker({
  shape = "rounded",
  color = "var(--mustard)",
  textColor = "var(--ink)",
  rotate = -3,
  peel = false,
  children,
  className,
}: StickerProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center",
        "border-[3px] border-white px-4 py-2",
        "font-chunky text-sm leading-none",
        SHAPE[shape],
        className,
      )}
      style={{
        backgroundColor: color,
        color: textColor,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "var(--shadow-cut)",
      }}
    >
      {children}
      {peel ? (
        <span
          aria-hidden
          className="absolute -bottom-px -right-px size-4"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgb(255 255 255 / 0.95) 50%)",
            filter: "drop-shadow(-2px -2px 2px rgb(43 38 34 / 0.25))",
            borderBottomRightRadius: "inherit",
          }}
        />
      ) : null}
    </span>
  );
}
