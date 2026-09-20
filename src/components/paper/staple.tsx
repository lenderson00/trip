import { cn } from "@/lib/utils";

export type StapleProps = {
  size?: number;
  color?: string;
  rotate?: number;
  className?: string;
};

/**
 * Grampo de grampeador, visto de cima.
 */
export function Staple({
  size = 30,
  color = "var(--ink-faint)",
  rotate = -20,
  className,
}: StapleProps) {
  return (
    <svg
      viewBox="0 0 32 16"
      width={size}
      height={size / 2}
      className={cn("shrink-0 overflow-visible", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 1.5px 1.5px rgb(43 38 34 / 0.3))",
      }}
      role="presentation"
      aria-hidden
    >
      <title>Grampo</title>
      <path
        d="M4 13 V5 H28 V13"
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="square"
      />
      <path
        d="M4 11.5 V4 H28"
        fill="none"
        stroke="#fff"
        strokeOpacity={0.5}
        strokeWidth={1.2}
      />
    </svg>
  );
}
