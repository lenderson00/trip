"use client";

import { useRouter } from "next/navigation";
import { PaperSheet } from "@/components/paper/paper-sheet";
import { PillLabel } from "@/components/paper/pill-label";
import type { DayKind } from "@/content/orlando/dias";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"] as const;

const KIND_COLOR: Record<DayKind, string> = {
  Chegada: "var(--blush)",
  Parque: "var(--sage)",
  Compras: "var(--mustard)",
  Passeio: "var(--dusk)",
  Flexível: "var(--paper-kraft)",
  Volta: "var(--terracotta)",
};

export type CalendarDay = {
  date: string;
  title: string;
  weekday: string;
  kind: DayKind;
  draft?: boolean;
};

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: startPad + daysInMonth }, (_, i) => {
    if (i < startPad) return null;
    return i - startPad + 1;
  });
}

export function ItineraryCalendar({
  days,
  selectedDate,
  year = 2026,
  month = 9,
}: {
  days: CalendarDay[];
  selectedDate: string;
  year?: number;
  month?: number;
}) {
  const router = useRouter();
  const byDate = new Map(days.map((day) => [day.date, day]));
  const cells = monthCells(year, month);
  const selected = byDate.get(selectedDate);

  return (
    <PaperSheet
      variant="cream"
      className="rounded-sm p-5 shadow-[var(--shadow-lift)] sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-hand text-xl text-caramel">outubro</p>
          <h3 className="font-display text-3xl leading-none text-ink">{year}</h3>
        </div>
        {selected ? (
          <PillLabel color={KIND_COLOR[selected.kind]} size="sm">
            {selected.kind}
            {selected.draft ? " · rascunho" : ""}
          </PillLabel>
        ) : null}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <p key={day} className="pb-2 font-chunky text-[11px] text-ink-faint">
            {day}
          </p>
        ))}

        {cells.map((dayNumber, index) => {
          if (!dayNumber) {
            return <span key={`empty-${index}`} />;
          }

          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
          const tripDay = byDate.get(iso);
          const isSelected = iso === selectedDate;

          if (!tripDay) {
            return (
              <span
                key={iso}
                className="flex aspect-square items-center justify-center text-sm text-ink-faint"
              >
                {dayNumber}
              </span>
            );
          }

          return (
            <button
              key={iso}
              type="button"
              onClick={() => router.push(`/orlando?dia=${iso}`, { scroll: false })}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-sm text-sm transition-colors",
                isSelected
                  ? "bg-forest text-paper-cream"
                  : "bg-paper-white text-ink hover:bg-blush/60",
              )}
              style={
                isSelected
                  ? undefined
                  : { boxShadow: `inset 0 -3px 0 ${KIND_COLOR[tripDay.kind]}` }
              }
              aria-current={isSelected ? "date" : undefined}
            >
              <span className="font-display text-base leading-none">
                {dayNumber}
              </span>
              <span
                className={cn(
                  "mt-1 max-w-[4.5rem] truncate font-hand text-[11px] leading-none",
                  isSelected ? "text-paper-cream/90" : "text-ink-soft",
                )}
              >
                {tripDay.title}
              </span>
            </button>
          );
        })}
      </div>
    </PaperSheet>
  );
}
