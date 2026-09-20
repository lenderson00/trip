import { cn } from "@/lib/utils";

export type BudgetEnvelopeProps = {
  label: string;
  /** Valor ja formatado, do jeito que deve aparecer. */
  amount: string;
  /** Quanto do envelope ja foi usado, 0 a 1. */
  spent?: number;
  color?: string;
  rotate?: number;
  className?: string;
};

/**
 * Envelope de dinheiro separado por categoria, com as cedulas aparecendo
 * pra fora conforme o que ainda sobrou.
 */
export function BudgetEnvelope({
  label,
  amount,
  spent = 0,
  color = "var(--paper-kraft)",
  rotate = -1.5,
  className,
}: BudgetEnvelopeProps) {
  const left = Math.max(0, Math.min(1, 1 - spent));
  const notes = Math.max(0, Math.round(left * 3));
  const pct = Math.round(left * 100);

  return (
    <div
      className={cn("relative inline-block w-56", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* Cedulas espiando por cima da aba. */}
      <div aria-hidden className="relative mx-3 h-7">
        {Array.from({ length: notes }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: as cedulas sao identicas
            key={i}
            className="absolute inset-x-0 h-7 rounded-t-sm border border-forest/25 bg-sage/60"
            style={{
              transform: `translate(${(i - 1) * 5}px, ${i * 3}px) rotate(${(i - 1) * 1.6}deg)`,
              zIndex: i,
            }}
          />
        ))}
      </div>

      <div
        className="relative rounded-sm p-4 pt-6"
        style={{ background: color, boxShadow: "var(--shadow-cut)" }}
      >
        {/* Aba triangular. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-9"
          style={{
            background: "rgb(43 38 34 / 0.07)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />
        <p className="relative font-hand text-xl text-ink">{label}</p>
        <p className="relative mt-1 font-display text-2xl text-ink">{amount}</p>
        <div className="relative mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/12">
            <div
              className="h-full rounded-full bg-forest"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-ink-soft">{pct}% disponivel</p>
        </div>
      </div>
    </div>
  );
}
