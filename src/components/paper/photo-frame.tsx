import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PhotoFrameProps = {
  src: string;
  alt: string;
  width?: number;
  /** Proporcao da foto: largura / altura. */
  ratio?: number;
  /** Espessura da moldura branca. */
  mat?: number;
  rotate?: number;
  /** Deslocamento da foto dentro da moldura, como na ref. 3. */
  offset?: number;
  children?: ReactNode;
  className?: string;
};

/**
 * Moldura branca grossa com a foto deslocada dentro -- o enquadramento da
 * ref. 3. O deslocamento e o que faz parecer montagem manual, nao um card.
 */
export function PhotoFrame({
  src,
  alt,
  width = 320,
  ratio = 1.4,
  mat = 16,
  rotate = -1.5,
  offset = 10,
  children,
  className,
}: PhotoFrameProps) {
  const height = Math.round(width / ratio);

  return (
    <div
      className={cn("relative inline-block bg-white", className)}
      style={{
        padding: mat,
        width: width + mat * 2,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        boxShadow: "var(--shadow-stick)",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width,
          height,
          transform: `translate(${offset}px, ${offset}px)`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          className="photo-graded object-cover"
        />
      </div>
      {children}
    </div>
  );
}
