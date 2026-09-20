import { FoldedMap } from "@/components/paper/folded-map";
import { ItineraryThread } from "@/components/paper/itinerary-thread";
import { PaperClip } from "@/components/paper/paper-clip";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PhotoCorners } from "@/components/paper/photo-corners";
import { Polaroid } from "@/components/paper/polaroid";
import { PINS, ROTEIRO } from "./dados";
import { Secao } from "./shell";

export function Roteiro() {
  return (
    <Secao id="roteiro" kicker="dia a dia" titulo="Roteiro">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative">
          <PaperClip className="absolute -left-4 -top-7 z-10 hidden lg:block" />
          <PaperSheet
            variant="cream"
            className="rounded-sm p-6 shadow-[var(--shadow-lift)] sm:p-8"
          >
            <ItineraryThread days={ROTEIRO} />
          </PaperSheet>
        </div>

        <aside className="space-y-8">
          <div>
            <p className="mb-3 font-hand text-xl text-caramel">
              onde fica cada coisa
            </p>
            <FoldedMap height={260} pins={PINS} folds={[3, 3]} />
          </div>

          {/* A foto fica reta de proposito: a cantoneira prende o canto do
              wrapper, entao uma foto girada dentro deixaria os cantos soltos. */}
          <PhotoCorners size={22} className="block">
            <Polaroid
              src="/photos/palmeiras.jpg"
              alt="Avenida de palmeiras na Florida"
              caption="a estrada pro parque"
              width={230}
              rotate={0}
            />
          </PhotoCorners>
        </aside>
      </div>
    </Secao>
  );
}
