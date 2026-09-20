import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DogEarCorner = "tr" | "br" | "tl" | "bl";

export type DogEarProps = {
  children: ReactNode;
  /** Tamanho do canto dobrado em px. */
  size?: number;
  /** Em qual canto a folha esta dobrada. */
  corner?: DogEarCorner;
  /** Cor do verso da folha, o lado que aparece ao dobrar. */
  back?: string;
  className?: string;
};

/** Recorte da folha: o canto e comido pela dobra. */
const SHEET: Record<DogEarCorner, (s: number) => string> = {
  tr: (s) =>
    `polygon(0 0, calc(100% - ${s}px) 0, 100% ${s}px, 100% 100%, 0 100%)`,
  br: (s) =>
    `polygon(0 0, 100% 0, 100% calc(100% - ${s}px), calc(100% - ${s}px) 100%, 0 100%)`,
  tl: (s) => `polygon(${s}px 0, 100% 0, 100% 100%, 0 100%, 0 ${s}px)`,
  bl: (s) =>
    `polygon(0 0, 100% 0, 100% 100%, ${s}px 100%, 0 calc(100% - ${s}px))`,
};

/** O triangulo do verso, encostado na hipotenusa do recorte. */
const FLAP: Record<
  DogEarCorner,
  { clip: string; angle: number; style: Record<string, number> }
> = {
  tr: {
    clip: "polygon(0 0, 100% 100%, 0 100%)",
    angle: 225,
    style: { top: 0, right: 0 },
  },
  br: {
    clip: "polygon(100% 0, 100% 100%, 0 0)",
    angle: 315,
    style: { bottom: 0, right: 0 },
  },
  tl: {
    clip: "polygon(100% 0, 100% 100%, 0 100%)",
    angle: 135,
    style: { top: 0, left: 0 },
  },
  bl: {
    clip: "polygon(0 0, 100% 0, 0 100%)",
    angle: 45,
    style: { bottom: 0, left: 0 },
  },
};

/**
 * Canto da folha dobrado pra dentro, marcando a pagina.
 *
 * Sao duas pecas: a folha com o canto recortado e o triangulo do verso por
 * cima. So o triangulo pareceria adesivo colado; o recorte e o que faz o
 * papel realmente ter dobrado.
 */
export function DogEar({
  children,
  size = 34,
  corner = "br",
  back = "var(--paper-kraft)",
  className,
}: DogEarProps) {
  const flap = FLAP[corner];

  return (
    <div className={cn("relative", className)}>
      <div style={{ clipPath: SHEET[corner](size) }}>{children}</div>
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          ...flap.style,
          width: size,
          height: size,
          clipPath: flap.clip,
          background: `linear-gradient(${flap.angle}deg, ${back} 0%, color-mix(in srgb, ${back} 72%, #2b2622) 100%)`,
        }}
      />
    </div>
  );
}
