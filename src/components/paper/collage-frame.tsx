import Image from "next/image";
import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type CollageFrameProps = {
  src: string;
  alt: string;
  width?: number;
  ratio?: number;
  /**
   * Cor do passe-partout recortado atras da foto. O padrao kraft le como
   * papel de verdade e nao disputa atencao com a imagem.
   */
  matColor?: string;
  rotate?: number;
  seed?: number | string;
  className?: string;
};

/**
 * Foto sobre um passe-partout de papel recortado a tesoura.
 *
 * O papel de tras tem cantos irregulares (clip-path sorteado da seed) e gira
 * ao contrario da foto: e o desencontro entre as duas rotacoes que cria a
 * sensacao de colagem.
 */
export function CollageFrame({
  src,
  alt,
  width = 260,
  ratio = 1.25,
  matColor = "var(--paper-kraft)",
  rotate = 2.5,
  seed,
  className,
}: CollageFrameProps) {
  const rng = createRng(toSeed(seed, 41));
  const height = Math.round(width / ratio);
  const p = () => between(rng, 0, 4).toFixed(1);

  const clip = `polygon(${p()}% ${p()}%, ${100 - Number(p())}% 0%, 100% ${100 - Number(p())}%, ${p()}% 100%)`;

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span
        aria-hidden
        className="absolute"
        style={{
          inset: -14,
          background: matColor,
          clipPath: clip,
          transform: `rotate(${-rotate * 1.8}deg)`,
          boxShadow: "var(--shadow-lift)",
        }}
      />
      <div
        className="relative overflow-hidden"
        style={{ width, height, boxShadow: "var(--shadow-cut)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          className="photo-graded object-cover"
        />
      </div>
    </div>
  );
}
