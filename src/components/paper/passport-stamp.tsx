import { toSeed } from "@/lib/seed";
import { filterId } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type PassportStampProps = {
  /** Destino, em caixa alta no anel. */
  place: string;
  /** Data ou texto curto no centro. */
  date?: string;
  color?: string;
  size?: number;
  rotate?: number;
  shape?: "circle" | "rect";
  seed?: number | string;
  className?: string;
};

/**
 * Carimbo de passaporte.
 *
 * A tinta falhada vem de um feTurbulence usado como mascara de opacidade --
 * um carimbo com cor uniforme parece adesivo, nao tinta prensada em papel.
 */
export function PassportStamp({
  place,
  date,
  color = "var(--dusk)",
  size = 140,
  rotate = -12,
  shape = "circle",
  seed,
  className,
}: PassportStampProps) {
  const seedValue = toSeed(seed, 47) % 1000;
  const id = filterId("stamp", seedValue, size);
  const arcId = `${id}-arc`;
  const r = size / 2 - 10;
  const c = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      role="img"
      aria-label={date ? `Carimbo ${place}, ${date}` : `Carimbo ${place}`}
    >
      <title>{date ? `${place} — ${date}` : place}</title>

      <defs>
        {/* Falhas da tinta. */}
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.55}
            numOctaves={3}
            seed={seedValue}
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 0.92"
            result="mask"
          />
          <feComposite in="SourceGraphic" in2="mask" operator="in" />
        </filter>

        <path
          id={arcId}
          fill="none"
          d={`M ${c - r + 16},${c} A ${r - 16},${r - 16} 0 1 1 ${c + r - 16},${c}`}
        />
      </defs>

      <g filter={`url(#${id})`} fill="none" stroke={color}>
        {shape === "circle" ? (
          <>
            <circle cx={c} cy={c} r={r} strokeWidth={3.5} />
            <circle cx={c} cy={c} r={r - 7} strokeWidth={1.5} />
          </>
        ) : (
          <>
            <rect
              x={8}
              y={18}
              width={size - 16}
              height={size - 36}
              strokeWidth={3.5}
              rx={4}
            />
            <rect
              x={14}
              y={24}
              width={size - 28}
              height={size - 48}
              strokeWidth={1.5}
              rx={3}
            />
          </>
        )}

        <text
          fill={color}
          stroke="none"
          fontFamily="var(--font-fredoka), sans-serif"
          fontSize={size * 0.13}
          fontWeight={600}
          letterSpacing={size * 0.02}
        >
          <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
            {place.toUpperCase()}
          </textPath>
        </text>

        {date ? (
          <text
            x={c}
            y={c + size * 0.17}
            fill={color}
            stroke="none"
            textAnchor="middle"
            fontFamily="var(--font-dm-sans), sans-serif"
            fontSize={size * 0.11}
            letterSpacing={size * 0.012}
          >
            {date}
          </text>
        ) : null}
      </g>
    </svg>
  );
}
