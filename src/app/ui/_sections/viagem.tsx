import { BudgetEnvelope } from "@/components/paper/budget-envelope";
import { FoldedMap } from "@/components/paper/folded-map";
import { ItineraryThread } from "@/components/paper/itinerary-thread";
import { LuggageTag } from "@/components/paper/luggage-tag";
import { PackingChecklist } from "@/components/paper/packing-checklist";
import { PassportStamp } from "@/components/paper/passport-stamp";
import { PostcardFlip } from "@/components/paper/postcard-flip";
import { SpiralNotebook } from "@/components/paper/spiral-notebook";
import { TicketStub } from "@/components/paper/ticket-stub";
import { WeatherChip } from "@/components/paper/weather-chip";
import { Demo, Section } from "../_showcase/shell";

export function ViagemSection() {
  return (
    <Section
      id="viagem"
      kicker="o conteudo"
      title="Viagem"
      description="Os componentes que carregam a informacao de uma viagem: roteiro, bagagem, orcamento, bilhete."
    >
      <Demo
        name="<TicketStub stub barcode />"
        note="Entalhes sao radial-gradient, nao clip-path: o bilhete mantem sombra propria."
      >
        <TicketStub
          seed="tk"
          stub={
            <span className="font-mono text-xs tracking-widest text-ink">
              LIS
            </span>
          }
        >
          <p className="font-hand text-xl text-caramel">voo de ida</p>
          <p className="font-display text-2xl leading-tight text-ink">
            GRU → LIS
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            12 mar · 22h40 · portao 14
          </p>
        </TicketStub>
      </Demo>

      <Demo
        name="<PassportStamp />"
        note="Falhas da tinta por mascara de turbulencia — cor uniforme pareceria adesivo."
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <PassportStamp place="Lisboa" date="12.03.26" seed="s1" />
          <PassportStamp
            place="Porto"
            date="18.03"
            shape="rect"
            color="var(--terracotta)"
            size={120}
            rotate={7}
            seed="s2"
          />
        </div>
      </Demo>

      <Demo
        name="<FoldedMap pins />"
        note="Vinco tem gradiente claro na crista e escuro no vale: dobra reflete dos dois lados."
      >
        <FoldedMap
          height={210}
          pins={[
            { x: 28, y: 42, label: "Alfama" },
            { x: 66, y: 66, label: "Belem", color: "var(--dusk)" },
          ]}
        />
      </Demo>

      <Demo
        name="<ItineraryThread days />"
        note="<ol> por dia e <dl> por parada: a ordem e a relacao horario/atividade ficam explicitas."
      >
        <ItineraryThread
          days={[
            {
              label: "Dia 01 — Lisboa",
              entries: [
                {
                  time: "08h00 – 08h30",
                  title: "Pastel de Belem",
                  detail: "fila menor antes das nove",
                },
                { time: "09h00 – 10h00", title: "Mosteiro dos Jeronimos" },
              ],
            },
            {
              label: "Dia 02 — Sintra",
              color: "var(--sage)",
              entries: [{ time: "10h00", title: "Quinta da Regaleira" }],
            },
          ]}
        />
      </Demo>

      <Demo
        name="<PackingChecklist />"
        note="Check e risco saem da seed — caneta nao risca reto."
      >
        <PackingChecklist
          seed="mala"
          items={[
            { label: "passaporte", done: true },
            { label: "adaptador de tomada", done: true },
            { label: "protetor solar" },
            { label: "caderno", done: true },
            { label: "carregador" },
          ]}
        />
      </Demo>

      <Demo
        name="<BudgetEnvelope spent />"
        note="As cedulas somem conforme o envelope esvazia."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <BudgetEnvelope label="comida" amount="R$ 1.200" spent={0.35} />
          <BudgetEnvelope
            label="passeios"
            amount="R$ 800"
            spent={0.8}
            color="var(--blush)"
            rotate={2}
          />
        </div>
      </Demo>

      <Demo
        name="<PostcardFlip />"
        note="Vira no hover E no foco, dentro de um <button>: funciona no teclado."
      >
        <PostcardFlip
          src="/photos/rua.jpg"
          alt="Fachadas de Lisboa"
          place="Lisboa"
          to="pra vovo"
          message="cheguei! a cidade inteira cheira a pao quente e o sol nao vai embora nunca."
        />
      </Demo>

      <Demo
        name="<LuggageTag />"
        note="O barbante e uma catenaria, nao uma reta."
      >
        <LuggageTag name="Lenderson" destination="Lisboa, PT" code="GRU LIS" />
      </Demo>

      <Demo
        name="<SpiralNotebook rings />"
        note="Argola passa por cima da borda com o furo visivel atras."
      >
        <SpiralNotebook rotate={-1}>
          <p className="font-hand text-2xl text-caramel">notas do dia</p>
          <p className="mt-2 max-w-[15rem] text-sm leading-[28px] text-ink">
            achar o miradouro que a moca do cafe falou
          </p>
        </SpiralNotebook>
      </Demo>

      <Demo
        name="<WeatherChip kind />"
        note="Previsao sem roubar espaco do roteiro."
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <WeatherChip kind="sol" temp="24°" day="seg" />
          <WeatherChip kind="nublado" temp="19°" day="ter" />
          <WeatherChip kind="chuva" temp="16°" day="qua" />
          <WeatherChip kind="vento" temp="21°" day="qui" />
          <WeatherChip kind="neve" temp="-2°" day="sex" />
        </div>
      </Demo>
    </Section>
  );
}
