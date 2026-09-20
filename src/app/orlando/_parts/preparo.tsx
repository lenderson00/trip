import { BudgetEnvelope } from "@/components/paper/budget-envelope";
import { PackingChecklist } from "@/components/paper/packing-checklist";
import { PushPin } from "@/components/paper/push-pin";
import { BAGAGEM, ORCAMENTO } from "./dados";
import { Secao } from "./shell";

export function Preparo() {
  /* Total so pra mostrar o numero fechado; os envelopes ja trazem o detalhe. */
  const total = ORCAMENTO.reduce(
    (soma, item) => soma + Number(item.amount.replace(/\D/g, "")),
    0,
  );

  return (
    <>
      <Secao id="bagagem" kicker="antes de ir" titulo="Bagagem">
        <div className="flex flex-wrap items-start gap-10">
          <div className="relative">
            <PushPin
              size={26}
              className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
            />
            <PackingChecklist
              title="Na mala"
              items={BAGAGEM}
              seed="mala-orlando"
              className="w-72"
            />
          </div>

          <p className="max-w-xs font-hand text-2xl leading-snug text-caramel">
            a mala vazia nao e exagero — ela volta cheia e ainda sobra coisa pra
            mao.
          </p>
        </div>
      </Secao>

      <Secao id="orcamento" kicker="quanto custa" titulo="Orcamento">
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-ink-soft">
          Total planejado de{" "}
          <strong className="font-display text-lg text-ink">
            R$ {total.toLocaleString("pt-BR")}
          </strong>{" "}
          para tres pessoas. Cada envelope mostra quanto ainda sobra.
        </p>

        <div className="flex flex-wrap gap-8">
          {ORCAMENTO.map((item, i) => (
            <BudgetEnvelope
              key={item.label}
              label={item.label}
              amount={item.amount}
              spent={item.spent}
              color={item.color}
              rotate={i % 2 === 0 ? -1.5 : 2}
            />
          ))}
        </div>
      </Secao>
    </>
  );
}
