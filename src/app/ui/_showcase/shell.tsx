import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  kicker,
  description,
  children,
}: {
  id: string;
  title: string;
  kicker?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink/10 pt-10">
      {kicker ? (
        <p className="font-hand text-xl text-caramel">{kicker}</p>
      ) : null}
      <h2 className="font-display text-3xl text-ink">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

export function Demo({
  name,
  note,
  wide,
  dark,
  children,
}: {
  name: string;
  note?: string;
  wide?: boolean;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn(
        "flex min-w-0 flex-col gap-3",
        wide && "sm:col-span-2 xl:col-span-3",
      )}
    >
      <div
        className={cn(
          "flex min-h-52 items-center justify-center overflow-hidden rounded-lg p-6",
          "border border-ink/10",
          dark ? "bg-ink/90" : "bg-white/55",
        )}
      >
        {children}
      </div>
      <figcaption className="min-w-0">
        <code className="font-mono text-xs font-semibold text-forest">
          {name}
        </code>
        {note ? (
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{note}</p>
        ) : null}
      </figcaption>
    </figure>
  );
}
