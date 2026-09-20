import type { ReactNode } from "react";
import { toSeed } from "@/lib/seed";
import { filterId } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type TornSide = "top" | "right" | "bottom" | "left";
const ALL_SIDES: TornSide[] = ["top", "right", "bottom", "left"];

export type TornEdgeProps = {
  /** Cor do papel rasgado. Aceita qualquer cor CSS. */
  color?: string;
  /** Quais bordas rasgar. As demais ficam retas. */
  sides?: TornSide[];
  /** Quao irregular e o rasgo. 0.02 = suave, 0.08 = esfarelado. */
  roughness?: number;
  /** Profundidade do rasgo em px. */
  depth?: number;
  /** Camadas de ruido. Poucas = rasgo limpo, muitas = borda esfarelada. */
  octaves?: number;
  seed?: number | string;
  children?: ReactNode;
  className?: string;
};

/**
 * Borda rasgada de papel.
 *
 * O filtro cai numa camada de fundo separada, nunca no conteudo -- um
 * feDisplacementMap aplicado ao texto o deixaria ilegivel. O conteudo
 * flutua por cima, intacto.
 */
export function TornEdge({
  color = "var(--paper-white)",
  sides = ALL_SIDES,
  roughness = 0.012,
  depth = 14,
  octaves = 2,
  seed,
  children,
  className,
}: TornEdgeProps) {
  const seedValue = toSeed(seed, 3) % 1000;
  const id = filterId("torn", roughness, depth, octaves, seedValue);

  /* Borda que nao deve rasgar: estica a camada de papel pra fora do wrapper,
   * o overflow-hidden corta o rasgo e sobra um corte reto. */
  const bleed = (side: TornSide) => (sides.includes(side) ? 0 : -(depth + 4));

  return (
    <div className={cn("relative isolate", className)}>
      <svg aria-hidden className="absolute size-0" focusable="false">
        <title>Borda rasgada</title>
        <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={roughness}
            numOctaves={octaves}
            seed={seedValue}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={depth}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <span
          className="absolute block"
          style={{
            top: bleed("top"),
            right: bleed("right"),
            bottom: bleed("bottom"),
            left: bleed("left"),
            background: color,
            filter: `url(#${id})`,
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
