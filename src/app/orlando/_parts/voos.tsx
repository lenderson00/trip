import { LuggageTag } from "@/components/paper/luggage-tag";
import { PassportStamp } from "@/components/paper/passport-stamp";
import { TicketStub } from "@/components/paper/ticket-stub";
import { WeatherChip } from "@/components/paper/weather-chip";
import { CLIMA, VOO_IDA, VOO_VOLTA, type Voo } from "./dados";
import { Secao } from "./shell";

function Bilhete({ voo, seed }: { voo: Voo; seed: string }) {
  return (
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
          <dd className="font-medium text-ink">
            {voo.data} · {voo.hora}
          </dd>
        </div>
        <div>
          <dt className="text-ink-faint">voo</dt>
          <dd className="font-medium text-ink">{voo.numero}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">duracao</dt>
          <dd className="font-medium text-ink">{voo.duracao}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">assentos</dt>
          <dd className="font-mono text-ink">{voo.assentos}</dd>
        </div>
      </dl>
    </TicketStub>
  );
}

export function Voos() {
  return (
    <Secao id="voos" kicker="como chegar" titulo="Voos">
      <div className="flex flex-wrap items-start gap-8">
        <Bilhete voo={VOO_IDA} seed="ida" />
        <Bilhete voo={VOO_VOLTA} seed="volta" />

        <div className="flex flex-row flex-wrap items-center gap-8">
          <LuggageTag
            name="familia Macedo"
            destination="Orlando, FL"
            code="GRU MCO"
          />
          <PassportStamp
            place="Orlando"
            date="05.02.27"
            size={116}
            rotate={-9}
            seed="carimbo"
          />
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 font-hand text-xl text-caramel">
          previsao da primeira semana
        </p>
        <div className="flex flex-wrap gap-2">
          {CLIMA.map((c) => (
            <WeatherChip key={c.day} kind={c.kind} temp={c.temp} day={c.day} />
          ))}
        </div>
      </div>
    </Secao>
  );
}
