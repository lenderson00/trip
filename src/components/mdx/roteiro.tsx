import type { ReactNode } from "react";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PillLabel } from "@/components/paper/pill-label";
import { cn } from "@/lib/utils";

export function Horario({
  time,
  title,
  children,
}: {
  time: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative mt-4 pl-6">
      <span
        aria-hidden
        className="absolute left-0 top-1.5 size-[11px] rounded-full bg-forest"
      />
      <p className="font-body text-sm font-medium text-forest">{time}</p>
      <p className="font-display text-lg leading-snug text-ink">{title}</p>
      {children ? (
        <div className="mt-1 text-sm leading-relaxed text-ink-soft">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function Passo({
  n,
  title,
  children,
}: {
  n: string | number;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="mt-7">
      <div className="flex items-baseline gap-3">
        <span className="font-chunky text-sm text-caramel">{n}</span>
        <h3 className="font-display text-xl leading-snug text-ink">{title}</h3>
      </div>
      {children ? <div className="mt-2">{children}</div> : null}
    </section>
  );
}

export function Trajeto({
  de,
  para,
  tempo,
  children,
}: {
  de: string;
  para: string;
  tempo?: string;
  children?: ReactNode;
}) {
  return (
    <PaperSheet
      variant="news"
      className="mt-3 rounded-sm px-4 py-3 shadow-[var(--shadow-lift)]"
    >
      <p className="font-hand text-lg text-caramel">trajeto</p>
      <p className="font-display text-base leading-snug text-ink">
        {de} <span className="text-ink-faint">→</span> {para}
      </p>
      {tempo ? <p className="mt-1 text-sm text-forest">{tempo}</p> : null}
      {children ? (
        <div className="mt-2 text-sm text-ink-soft">{children}</div>
      ) : null}
    </PaperSheet>
  );
}

export function Nota({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-4 rounded-sm bg-mustard/25 px-4 py-3 text-sm leading-relaxed text-ink">
      {children}
    </aside>
  );
}

export function Alerta({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-4 rounded-sm bg-blush/70 px-4 py-3 text-sm leading-relaxed text-ink">
      {children}
    </aside>
  );
}

export function Opcional({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-4 rounded-sm border border-dashed border-dusk/40 bg-paper-white/70 px-4 py-3 text-sm leading-relaxed text-ink-soft">
      <p className="mb-1 font-hand text-lg text-dusk">opcional</p>
      {children}
    </aside>
  );
}

export function Lista({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-ink-soft">
          <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-forest" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Atracao({
  name,
  area,
  limit,
  children,
}: {
  name: string;
  area?: string;
  limit?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-display text-lg text-ink">{name}</p>
        {area ? (
          <PillLabel size="sm" color="var(--sage)" font="body">
            {area}
          </PillLabel>
        ) : null}
        {limit ? (
          <span className="text-xs text-ink-faint">{limit}</span>
        ) : null}
      </div>
      {children ? (
        <div className={cn("mt-1 text-sm text-ink-soft")}>{children}</div>
      ) : null}
    </div>
  );
}
