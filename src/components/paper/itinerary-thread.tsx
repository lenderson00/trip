import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PillLabel } from "./pill-label";

export type ItineraryEntry = {
  /** Horario ou intervalo. */
  time: string;
  title: string;
  detail?: ReactNode;
};

export type ItineraryDay = {
  label: string;
  /** Cor da pill do dia. */
  color?: string;
  entries: ItineraryEntry[];
};

export type ItineraryThreadProps = {
  days: ItineraryDay[];
  /** Cor da linha e dos pontos. */
  threadColor?: string;
  className?: string;
};

/**
 * Linha do tempo do roteiro -- a estrutura de dias da ref. 1.
 *
 * E uma <ol> de verdade por dia, com <dl> pra cada parada: a ordem e a
 * relacao horario/atividade ficam explicitas pra leitor de tela, em vez de
 * virarem so pontinhos e texto solto.
 */
export function ItineraryThread({
  days,
  threadColor = "var(--forest)",
  className,
}: ItineraryThreadProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {days.map((day) => (
        <section key={day.label}>
          <PillLabel color={day.color ?? "var(--blush)"} size="md">
            {day.label}
          </PillLabel>

          <ol className="mt-4 space-y-5 pl-1">
            {day.entries.map((entry) => (
              <li
                key={`${day.label}-${entry.time}-${entry.title}`}
                className="relative pl-6"
              >
                {/* Fio ligando as paradas. */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-[5px] top-4 w-px"
                  style={{ background: threadColor, opacity: 0.45 }}
                />
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 size-[11px] rounded-full"
                  style={{ background: threadColor }}
                />
                <dl>
                  <dt className="font-body text-sm font-medium text-forest">
                    {entry.time}
                  </dt>
                  <dd className="mt-0.5">
                    <span className="block font-display text-lg leading-snug text-ink">
                      {entry.title}
                    </span>
                    {entry.detail ? (
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {entry.detail}
                      </span>
                    ) : null}
                  </dd>
                </dl>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
