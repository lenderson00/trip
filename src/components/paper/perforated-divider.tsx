import { cn } from "@/lib/utils";

export type PerforatedDividerProps = {
  /** Texto pequeno centralizado na linha, tipo "destaque aqui". */
  label?: string;
  color?: string;
  /** Tamanho do furo em px. */
  dot?: number;
  /** Espaco entre furos em px. */
  gap?: number;
  /** Tesourinha na ponta esquerda. */
  scissors?: boolean;
  className?: string;
};

/**
 * Linha picotada de destacar, com tesourinha opcional na ponta.
 *
 * Serve pra separar secoes de um roteiro sem usar uma regua solida, que num
 * layout de papel sempre parece borda de card.
 */
export function PerforatedDivider({
  label,
  color = "var(--ink-faint)",
  dot = 3,
  gap = 7,
  scissors = true,
  className,
}: PerforatedDividerProps) {
  const line = (
    <span
      aria-hidden
      className="block h-px flex-1"
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${color} 0 ${dot}px, transparent ${dot}px ${dot + gap}px)`,
      }}
    />
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {scissors ? (
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.7}
          strokeLinecap="round"
          className="shrink-0"
          role="presentation"
          aria-hidden
        >
          <title>Tesoura</title>
          <path d="M6 4 L15 14 M6 20 L15 10 M13.2 12 L20 12 M4.2 4 a2 2 0 1 0 0 -0.1 M4.2 20 a2 2 0 1 0 0 -0.1" />
        </svg>
      ) : null}
      {line}
      {label ? (
        <span className="shrink-0 font-body text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          {label}
        </span>
      ) : null}
      {label ? line : null}
    </div>
  );
}
