import type { ComponentType } from "react";
import Dia07 from "./dias/2026-10-07.mdx";
import Dia08 from "./dias/2026-10-08.mdx";
import Dia09 from "./dias/2026-10-09.mdx";
import Dia10 from "./dias/2026-10-10.mdx";
import Dia11 from "./dias/2026-10-11.mdx";
import Dia12 from "./dias/2026-10-12.mdx";
import Dia13 from "./dias/2026-10-13.mdx";
import Dia14 from "./dias/2026-10-14.mdx";
import Dia15 from "./dias/2026-10-15.mdx";

export type DayKind =
  | "Chegada"
  | "Parque"
  | "Compras"
  | "Passeio"
  | "Flexível"
  | "Volta";

export type TripDay = {
  date: string;
  title: string;
  weekday: string;
  kind: DayKind;
  summary: string;
  draft?: boolean;
  Content: ComponentType;
};

export const DIAS: TripDay[] = [
  {
    date: "2026-10-07",
    title: "Chegada",
    weekday: "Qua",
    kind: "Chegada",
    summary: "Pouso 16h30 → carro → Walmart → casa",
    Content: Dia07,
  },
  {
    date: "2026-10-08",
    title: "Epic",
    weekday: "Qui",
    kind: "Parque",
    summary: "Epic Universe 10h–20h, sem EPA",
    Content: Dia08,
  },
  {
    date: "2026-10-09",
    title: "Universal",
    weekday: "Sex",
    kind: "Parque",
    summary: "Park-to-park IOA + USF",
    Content: Dia09,
  },
  {
    date: "2026-10-10",
    title: "Érica",
    weekday: "Sáb",
    kind: "Passeio",
    summary: "Tarde com Érica → ICON → Lake Eola",
    Content: Dia10,
  },
  {
    date: "2026-10-11",
    title: "Compras",
    weekday: "Dom",
    kind: "Compras",
    summary: "Millenia → Best Buy → Outlets",
    Content: Dia11,
  },
  {
    date: "2026-10-12",
    title: "Érica",
    weekday: "Seg",
    kind: "Passeio",
    summary: "Passeio escolhido pela Érica",
    draft: true,
    Content: Dia12,
  },
  {
    date: "2026-10-13",
    title: "Flex",
    weekday: "Ter",
    kind: "Flexível",
    summary: "Kennedy Space Center ou compras",
    draft: true,
    Content: Dia13,
  },
  {
    date: "2026-10-14",
    title: "MK",
    weekday: "Qua",
    kind: "Parque",
    summary: "Magic Kingdom + fotos + fogos",
    draft: true,
    Content: Dia14,
  },
  {
    date: "2026-10-15",
    title: "Volta",
    weekday: "Qui",
    kind: "Volta",
    summary: "Últimas compras + aeroporto",
    draft: true,
    Content: Dia15,
  },
];

export function findDay(date?: string) {
  return DIAS.find((day) => day.date === date) ?? DIAS[0];
}
