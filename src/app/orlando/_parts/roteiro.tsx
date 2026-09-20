import { ItineraryCalendar } from "@/components/paper/itinerary-calendar";
import { PaperClip } from "@/components/paper/paper-clip";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PillLabel } from "@/components/paper/pill-label";
import { TripMap } from "@/components/paper/trip-map";
import { DIAS, findDay } from "@/content/orlando/dias";
import { MAP_PINS } from "./dados";
import { Secao } from "./shell";

export function Roteiro({ selectedDate }: { selectedDate?: string }) {
  const day = findDay(selectedDate);
  const Content = day.Content;

  return (
    <Secao id="roteiro" kicker="dia a dia" titulo="Roteiro">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative">
          <PaperClip className="absolute -left-4 -top-7 z-10 hidden lg:block" />
          <ItineraryCalendar
            days={DIAS.map(({ date, title, weekday, kind, draft }) => ({
              date,
              title,
              weekday,
              kind,
              draft,
            }))}
            selectedDate={day.date}
          />
        </div>

        <aside className="text-center lg:text-left">
          <p className="mb-3 font-hand text-xl text-caramel">
            onde fica cada coisa
          </p>
          <TripMap pins={MAP_PINS} selectedDate={day.date} height={280} />
        </aside>
      </div>

      <div className="relative mt-10">
        <PaperSheet
          variant="cream"
          className="rounded-sm p-6 shadow-[var(--shadow-lift)] sm:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <PillLabel color="var(--blush)" size="md">
              {day.weekday} {day.date.slice(8)}/10 — {day.title}
            </PillLabel>
            {day.draft ? (
              <span className="font-hand text-lg text-caramel">
                ainda vou detalhar
              </span>
            ) : null}
          </div>
          <p className="mb-6 text-sm text-ink-soft">{day.summary}</p>
          <Content />
        </PaperSheet>
      </div>
    </Secao>
  );
}
