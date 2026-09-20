import { cn } from "@/lib/utils";

export type LuggageTagProps = {
  name: string;
  destination?: string;
  code?: string;
  color?: string;
  rotate?: number;
  className?: string;
};

/**
 * Etiqueta de bagagem pendurada por um barbante.
 *
 * O barbante e um path curvo, nao uma linha reta: fio pendurado sempre faz
 * catenaria.
 */
export function LuggageTag({
  name,
  destination,
  code,
  color = "var(--mustard)",
  rotate = 3,
  className,
}: LuggageTagProps) {
  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <svg
        width={54}
        height={34}
        viewBox="0 0 54 34"
        aria-hidden
        focusable="false"
      >
        <title>Barbante</title>
        <path
          d="M8 2 C 10 18, 44 18, 46 2"
          fill="none"
          stroke="var(--ink-soft)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>

      <div
        className="relative -mt-2 w-44 rounded-lg px-4 py-4"
        style={{
          background: color,
          transform: `rotate(${rotate}deg)`,
          boxShadow: "var(--shadow-cut)",
        }}
      >
        {/* Ilhos. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-2 size-3 -translate-x-1/2 rounded-full bg-paper-cream ring-2 ring-ink/20"
        />
        <p className="mt-3 font-hand text-xl leading-tight text-ink">{name}</p>
        {destination ? (
          <p className="mt-1 font-body text-sm text-ink-soft">{destination}</p>
        ) : null}
        {code ? (
          <p className="mt-2 border-t border-ink/15 pt-2 font-mono text-xs tracking-[0.2em] text-ink">
            {code}
          </p>
        ) : null}
      </div>
    </div>
  );
}
