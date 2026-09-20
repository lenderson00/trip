import type { ReactNode } from "react";
import { PerforatedDivider } from "@/components/paper/perforated-divider";
import { cn } from "@/lib/utils";

export function Secao({
  id,
  kicker,
  titulo,
  children,
  className,
}: {
  id?: string;
  kicker?: string;
  titulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <header className="mb-7">
        {kicker ? (
          <p className="font-hand text-2xl text-caramel">{kicker}</p>
        ) : null}
        <h2 className="font-display text-4xl leading-tight text-ink">
          {titulo}
        </h2>
        <PerforatedDivider className="mt-4 max-w-sm" scissors={false} />
      </header>
      {children}
    </section>
  );
}
