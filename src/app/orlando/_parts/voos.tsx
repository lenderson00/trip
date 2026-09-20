"use client";

import { DustMotes } from "@/components/fx/dust-motes";
import { LightLeak } from "@/components/fx/light-leak";
import { LuggageTag } from "@/components/paper/luggage-tag";
import { PassportStamp } from "@/components/paper/passport-stamp";
import { TicketStub } from "@/components/paper/ticket-stub";
import { WeatherChip } from "@/components/paper/weather-chip";
import { CLIMA, VOO_IDA, VOO_VOLTA, type Voo } from "./dados";
import { Secao } from "./shell";

function Bilhete({ voo, seed }: { voo: Voo; seed: string }) {
  return (
    <LightLeak seed={`voo-${seed}`} intensity={0.45}>
      <TicketStub
        seed={seed}
        rotate={seed === "ida" ? -1.5 : 1.5}
        stub={
          <span className="font-mono text-xs tracking-widest text-ink">
            {voo.para}
          </span>
        }
      >
        <p className="font-hand text-xl text-caramel">
          {seed === "ida" ? "ida" : "volta"}
        </p>
        <p className="font-display text-2xl leading-tight text-ink">
          {voo.de} <span className="text-ink-faint">&rarr;</span> {voo.para}
        </p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {voo.cidadeDe} para {voo.cidadePara}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1.5 text-xs">
          <div>
            <dt className="text-ink-faint">data</dt>
            <dd className="font-medium text-ink">{voo.data}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">horario</dt>
            <dd className="font-medium text-ink">{voo.hora}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">voo</dt>
            <dd className="font-medium text-ink">{voo.numero}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">duracao</dt>
            <dd className="font-medium text-ink">{voo.duracao}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-ink-faint">assentos</dt>
            <dd className="font-mono text-ink">{voo.assentos}</dd>
          </div>
        </dl>
      </TicketStub>
    </LightLeak>
  );
}

export function Voos() {
  return (
    <Secao id="voos" kicker="como chegar" titulo="Voos">
      <DustMotes seed="voos" density={0.65} beam={0.5} className="relative">
        <div className="flex flex-wrap items-start justify-center gap-8">
          <Bilhete voo={VOO_IDA} seed="ida" />
          <Bilhete voo={VOO_VOLTA} seed="volta" />

          <div className="flex flex-row flex-wrap items-center justify-center gap-8">
            <LuggageTag
              name="Lenderson & Lays"
              destination="Orlando, FL"
              code="GRU MCO"
            />
            <PassportStamp
              place="Orlando"
              date="07.10.26"
              size={116}
              rotate={-9}
              seed="carimbo"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <p className="mb-3 font-hand text-xl text-caramel">
            previsao da primeira semana
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CLIMA.map((c) => (
              <WeatherChip key={c.day} kind={c.kind} temp={c.temp} day={c.day} />
            ))}
          </div>
        </div>
      </DustMotes>
    </Secao>
  );
}
