import { between, createRng, toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { Doodle } from "./doodle";
import { PaperSheet } from "./paper-sheet";

export type PackingItem = { label: string; done?: boolean };

export type PackingChecklistProps = {
  title?: string;
  items: PackingItem[];
  seed?: number | string;
  className?: string;
};

/**
 * Lista de bagagem em papel pautado, com check desenhado a mao.
 *
 * Os itens marcados ganham um risco levemente torto sobre o texto -- caneta
 * nao risca reto.
 */
export function PackingChecklist({
  title = "Na mala",
  items,
  seed,
  className,
}: PackingChecklistProps) {
  const rng = createRng(toSeed(seed, 53));

  return (
    <PaperSheet
      variant="lined"
      className={cn("rounded-sm p-5 shadow-[var(--shadow-cut)]", className)}
    >
      <h3 className="mb-3 font-hand text-2xl text-caramel">{title}</h3>
      <ul className="space-y-[7px]">
        {items.map((item) => {
          const tilt = between(rng, -1.6, 1.6);
          const slant = between(rng, -1.2, 1.2);
          return (
            <li
              key={item.label}
              className="flex items-center gap-2 leading-[28px]"
            >
              <span
                className="flex size-5 shrink-0 items-center justify-center border-[1.5px] border-ink-soft/70"
                style={{ transform: `rotate(${tilt}deg)` }}
              >
                {item.done ? (
                  <Doodle
                    kind="check"
                    size={22}
                    stroke={4}
                    color="var(--forest)"
                    className="-mt-1"
                  />
                ) : null}
              </span>
              <span
                className={cn(
                  "relative font-body text-[15px]",
                  item.done ? "text-ink-faint" : "text-ink",
                )}
              >
                {item.label}
                {item.done ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-1/2 h-px bg-ink-faint"
                    style={{ transform: `rotate(${slant}deg)` }}
                  />
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </PaperSheet>
  );
}
