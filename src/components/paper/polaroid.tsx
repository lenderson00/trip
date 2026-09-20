import Image from "next/image";
import { cn } from "@/lib/utils";

export type PolaroidProps = {
  src: string;
  alt: string;
  /** Legenda manuscrita na aba de baixo. */
  caption?: string;
  width?: number;
  rotate?: number;
  className?: string;
};

/**
 * Foto instantanea: aba grossa embaixo pra legenda a mao.
 */
export function Polaroid({
  src,
  alt,
  caption,
  width = 210,
  rotate = 3,
  className,
}: PolaroidProps) {
  return (
    <figure
      className={cn("inline-block bg-white p-3 pb-0", className)}
      style={{
        width,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "var(--shadow-stick)",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: Math.round(width * 1.05) }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          className="photo-graded object-cover"
        />
      </div>
      <figcaption className="flex h-16 items-center justify-center px-1 font-hand text-xl text-ink-soft">
        {caption}
      </figcaption>
    </figure>
  );
}
