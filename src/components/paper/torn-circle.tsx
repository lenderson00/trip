import Image from "next/image";
import { toSeed } from "@/lib/seed";
import { filterId } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type TornCircleProps = {
  src: string;
  alt: string;
  size?: number;
  /** Espessura do anel de papel rasgado em volta da foto. */
  ring?: number;
  ringColor?: string;
  rotate?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Foto redonda dentro de um anel de papel rasgado -- os recortes circulares
 * da ref. 1.
 *
 * O anel e uma camada branca com displacement; a foto entra por cima, com
 * clip circular limpo. Rasgar a foto junto a deixaria com a borda suja.
 */
export function TornCircle({
  src,
  alt,
  size = 190,
  ring = 11,
  ringColor = "#fff",
  rotate = 0,
  seed,
  className,
}: TornCircleProps) {
  const seedValue = toSeed(seed, 37) % 1000;
  const id = filterId("torn-ring", ring, seedValue);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{
        width: size,
        height: size,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <svg aria-hidden className="absolute size-0" focusable="false">
        <title>Anel rasgado</title>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.022}
            numOctaves={3}
            seed={seedValue}
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={9}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: ringColor,
          filter: `url(#${id})`,
          boxShadow: "var(--shadow-cut)",
        }}
      />

      <div
        className="absolute overflow-hidden rounded-full"
        style={{ inset: ring }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="photo-graded object-cover"
        />
      </div>
    </div>
  );
}
