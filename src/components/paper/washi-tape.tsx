import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";

export type WashiVariant = "plain" | "stripe" | "checker" | "airmail" | "dots";

export type WashiTapeProps = {
  variant?: WashiVariant;
  /** Cor base da fita. O airmail ignora e usa vermelho/azul postal. */
  color?: string;
  width?: number | string;
  height?: number;
  /** Graus. Fita reta demais entrega que e digital. */
  rotate?: number;
  seed?: number | string;
  label?: string;
  className?: string;
};

function pattern(variant: WashiVariant, color: string): string {
  switch (variant) {
    case "stripe":
      return `repeating-linear-gradient(115deg, ${color} 0 7px, transparent 7px 15px)`;
    case "checker":
      return `repeating-conic-gradient(${color} 0% 25%, transparent 0% 50%) 0 0 / 13px 13px`;
    case "dots":
      return `radial-gradient(${color} 1.6px, transparent 1.8px) 0 0 / 11px 11px`;
    case "airmail":
      return `repeating-linear-gradient(115deg, var(--poppy) 0 9px, transparent 9px 18px, var(--dusk) 18px 27px, transparent 27px 36px)`;
    default:
      return "none";
  }
}

/**
 * Fita washi. Prende qualquer coisa na pagina.
 *
 * As pontas sao levemente irregulares (clip-path com jitter da seed), porque
 * fita cortada com a mao nunca termina numa reta perfeita.
 */
export function WashiTape({
  variant = "plain",
  color = "var(--blush)",
  width = 130,
  height = 34,
  rotate = -4,
  seed,
  label,
  className,
}: WashiTapeProps) {
  const rng = createRng(toSeed(seed, 5));
  const j = () => between(rng, 0, 3.2).toFixed(2);

  /* Pontas serrilhadas: 4 pontos por lado, cada um com desvio proprio. */
  const clip = `polygon(
    ${j()}% 0%, 100% ${j()}%, ${100 - Number(j())}% 100%, 0% ${100 - Number(j())}%
  )`;

  const base = variant === "airmail" ? "var(--paper-white)" : color;

  return (
    <span
      aria-hidden={label ? undefined : true}
      className={cn(
        "pointer-events-none inline-flex items-center justify-center",
        "font-hand text-sm text-ink-soft",
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height,
        transform: `rotate(${rotate}deg)`,
        backgroundColor: base,
        backgroundImage: pattern(
          variant,
          variant === "airmail" ? base : "rgb(255 255 255 / 0.55)",
        ),
        clipPath: clip,
        opacity: 0.92,
        boxShadow: "0 1px 3px rgb(43 38 34 / 0.14)",
      }}
    >
      {label}
    </span>
  );
}
