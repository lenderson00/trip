import { cn } from "@/lib/utils";

export type WeatherKind = "sol" | "nublado" | "chuva" | "vento" | "neve";

export type WeatherChipProps = {
  kind?: WeatherKind;
  /** Temperatura ja formatada. */
  temp: string;
  day?: string;
  className?: string;
};

const GLYPH: Record<WeatherKind, { d: string; color: string; fill?: boolean }> =
  {
    sol: {
      d: "M12 5.5 A6.5 6.5 0 1 1 11.99 5.5 M12 1 v2.4 M12 20.6 V23 M1 12 h2.4 M20.6 12 H23 M4.2 4.2 l1.7 1.7 M18.1 18.1 l1.7 1.7 M19.8 4.2 l-1.7 1.7 M5.9 18.1 l-1.7 1.7",
      color: "var(--mustard)",
    },
    nublado: {
      d: "M7 18 h10.5 a4.2 4.2 0 0 0 .3 -8.4 a6 6 0 0 0 -11.4 1.6 A3.5 3.5 0 0 0 7 18 Z",
      color: "var(--ink-faint)",
    },
    chuva: {
      d: "M7 14 h10.5 a4.2 4.2 0 0 0 .3 -8.4 a6 6 0 0 0 -11.4 1.6 A3.5 3.5 0 0 0 7 14 Z M8 17 l-1 3.5 M13 17 l-1 3.5 M18 17 l-1 3.5",
      color: "var(--dusk)",
    },
    vento: {
      d: "M3 9 h11 a3 3 0 1 0 -3 -3 M3 14 h15 a3.2 3.2 0 1 1 -3.2 3.2",
      color: "var(--sage)",
    },
    neve: {
      d: "M12 3 v18 M4.2 7.5 l15.6 9 M19.8 7.5 l-15.6 9",
      color: "var(--dusk)",
    },
  };

/**
 * Chip de clima: previsao do dia sem roubar espaco do roteiro.
 */
export function WeatherChip({
  kind = "sol",
  temp,
  day,
  className,
}: WeatherChipProps) {
  const glyph = GLYPH[kind];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5",
        "shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke={glyph.color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={kind}
      >
        <title>{kind}</title>
        <path d={glyph.d} />
      </svg>
      <span className="font-body text-sm font-medium text-ink">{temp}</span>
      {day ? <span className="text-xs text-ink-soft">{day}</span> : null}
    </span>
  );
}
