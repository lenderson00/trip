import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { TornEdge } from "./torn-edge";

export type NewsprintStripProps = {
  /** Quantas linhas de "texto" de jornal. */
  lines?: number;
  width?: number | string;
  rotate?: number;
  seed?: number | string;
  /** Texto real por cima das linhas falsas, se quiser. */
  headline?: string;
  className?: string;
};

/**
 * Tira de jornal rasgada (o recorte de jornal da ref. 3).
 *
 * As linhas sao barras de largura sorteada, nao texto: a essa escala ninguem
 * le, e assim a tira nao vira lixo pra leitor de tela nem pro tradutor.
 */
export function NewsprintStrip({
  lines = 6,
  width = 200,
  rotate = -3,
  seed,
  headline,
  className,
}: NewsprintStripProps) {
  const rng = createRng(toSeed(seed, 31));
  const rows = Array.from({ length: lines }, (_, i) => ({
    key: i,
    w: between(rng, 55, 100),
  }));

  return (
    <div
      className={cn("inline-block", className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 3px 5px rgb(43 38 34 / 0.16))",
      }}
    >
      <TornEdge
        color="var(--paper-news)"
        seed={seed}
        depth={9}
        roughness={0.016}
      >
        <div className="px-4 py-4" aria-hidden>
          {headline ? (
            <p className="mb-2 font-display text-sm font-semibold leading-tight text-ink">
              {headline}
            </p>
          ) : null}
          <div className="space-y-[5px]">
            {rows.map((row) => (
              <span
                key={row.key}
                className="block h-[3px] rounded-full bg-ink/35"
                style={{ width: `${row.w}%` }}
              />
            ))}
          </div>
        </div>
      </TornEdge>
    </div>
  );
}
