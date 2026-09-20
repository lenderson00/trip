import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MapPin = {
  /** Posicao em porcentagem da area do mapa. */
  x: number;
  y: number;
  label?: string;
  color?: string;
};

export type FoldedMapProps = {
  pins?: MapPin[];
  /** Colunas x linhas de dobra. */
  folds?: [number, number];
  width?: number | string;
  height?: number;
  children?: ReactNode;
  className?: string;
};

/**
 * Mapa de papel dobrado.
 *
 * Os vincos sao um par de gradientes repetidos -- um claro na crista e um
 * escuro no vale -- porque dobra de papel reflete luz dos dois lados.
 */
export function FoldedMap({
  pins = [],
  folds = [3, 2],
  width = "100%",
  height = 240,
  children,
  className,
}: FoldedMapProps) {
  const [cols, rows] = folds;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-paper-news",
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height,
        boxShadow: "var(--shadow-cut)",
      }}
    >
      {/* Malha de ruas. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, rgb(143 179 147 / 0.5) 0 2px, transparent 2px 38px),
            repeating-linear-gradient(to bottom, rgb(143 179 147 / 0.5) 0 2px, transparent 2px 46px),
            linear-gradient(120deg, rgb(91 110 140 / 0.22) 0 8px, transparent 8px)`,
        }}
      />

      {/* Vincos das dobras. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, transparent 0 calc(100% / ${cols} - 1px), rgb(43 38 34 / 0.16) calc(100% / ${cols} - 1px) calc(100% / ${cols}), rgb(255 255 255 / 0.65) calc(100% / ${cols}) calc(100% / ${cols} + 1px)),
            repeating-linear-gradient(to bottom, transparent 0 calc(100% / ${rows} - 1px), rgb(43 38 34 / 0.16) calc(100% / ${rows} - 1px) calc(100% / ${rows}), rgb(255 255 255 / 0.65) calc(100% / ${rows}) calc(100% / ${rows} + 1px))`,
        }}
      />

      {pins.map((pin) => (
        <span
          key={`${pin.x}-${pin.y}-${pin.label ?? ""}`}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <svg
            width={26}
            height={32}
            viewBox="0 0 26 32"
            aria-hidden
            focusable="false"
          >
            <title>{pin.label ?? "Marcador no mapa"}</title>
            <path
              d="M13 31 C 2 17, 1 9, 6 4 C 11 -1, 21 1, 23 8 C 25 15, 20 22, 13 31 Z"
              fill={pin.color ?? "var(--poppy)"}
            />
            <circle cx={13} cy={11} r={4.5} fill="var(--paper-cream)" />
          </svg>
          {pin.label ? (
            <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap rounded-full bg-paper-cream/95 px-2 py-0.5 font-hand text-sm text-ink">
              {pin.label}
            </span>
          ) : null}
        </span>
      ))}

      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}
