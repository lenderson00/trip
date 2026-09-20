import type { ItineraryDay } from "@/components/paper/itinerary-thread";
import type { PackingItem } from "@/components/paper/packing-checklist";

/**
 * Dados da viagem Orlando outubro 2026.
 * O roteiro dia a dia vive em MDX em src/content/orlando/dias.
 */

export const VIAGEM = {
  destino: "Orlando",
  pais: "Estados Unidos",
  entrada: "07 de outubro de 2026",
  saida: "15 de outubro de 2026",
  voltaBrasil: "16 de outubro de 2026",
  noites: 8,
  viajantes: "familia",
  hospedagem: "Casa da amiga",
} as const;

/** Embarque GRU — contagem regressiva do caderno. */
export const PARTIDA = {
  iso: "2026-10-07T06:05:00-03:00",
  label: "07OUT · 06h05",
  chegaOrlando: "16h30",
} as const;

export type Voo = {
  numero: string;
  de: string;
  para: string;
  cidadeDe: string;
  cidadePara: string;
  data: string;
  hora: string;
  duracao: string;
  assentos: string;
};

export const VOO_IDA: Voo = {
  numero: "LA 8180",
  de: "GRU",
  para: "MCO",
  cidadeDe: "Sao Paulo",
  cidadePara: "Orlando",
  data: "07 out",
  hora: "06h05 → 16h30",
  duracao: "8h20 · direto",
  assentos: "24A 24B 24C",
};

export const VOO_VOLTA: Voo = {
  numero: "LA 8181",
  de: "MCO",
  para: "GRU",
  cidadeDe: "Orlando",
  cidadePara: "Sao Paulo",
  data: "15–16 out",
  hora: "22h00 → 10h40",
  duracao: "8h55 · direto",
  assentos: "31D 31E 31F",
};

export const CLIMA = [
  { kind: "sol", temp: "26°", day: "sex" },
  { kind: "sol", temp: "27°", day: "sab" },
  { kind: "nublado", temp: "24°", day: "dom" },
  { kind: "chuva", temp: "22°", day: "seg" },
  { kind: "sol", temp: "25°", day: "ter" },
] as const;

export const ROTEIRO: ItineraryDay[] = [
  {
    label: "Dia 01 — chegada",
    entries: [
      {
        time: "06h35",
        title: "Pouso em MCO",
        detail: "imigracao costuma levar 1h; pegar o carro alugado depois",
      },
      {
        time: "14h00",
        title: "Check-in no resort",
        detail: "quarto so libera as 16h, deixar malas na recepcao",
      },
      {
        time: "18h30",
        title: "Disney Springs",
        detail: "jantar leve e primeira compra — dia de chegada rende pouco",
      },
    ],
  },
  {
    label: "Dia 02 — Magic Kingdom",
    color: "var(--blush)",
    entries: [
      {
        time: "07h30",
        title: "Rope drop",
        detail: "entrar antes da abertura oficial vale por duas atracoes",
      },
      { time: "12h00", title: "Almoco no Be Our Guest", detail: "reservado" },
      {
        time: "21h00",
        title: "Fogos no castelo",
        detail: "pegar lugar 40min antes",
      },
    ],
  },
  {
    label: "Dia 03 — EPCOT",
    color: "var(--sage)",
    entries: [
      { time: "09h00", title: "Test Track e Soarin" },
      {
        time: "15h00",
        title: "Volta ao mundo no World Showcase",
        detail: "o pavilhao do Japao tem a melhor loja",
      },
    ],
  },
  {
    label: "Dia 04 — dia de respirar",
    color: "var(--mustard)",
    entries: [
      { time: "manha", title: "Piscina do resort", detail: "sem despertador" },
      { time: "16h00", title: "Outlet Premium", detail: "tenis e mala extra" },
    ],
  },
  {
    label: "Dia 05 — Hollywood Studios",
    color: "var(--dusk)",
    entries: [
      {
        time: "07h00",
        title: "Fila virtual do Rise of the Resistance",
        detail: "abre as 7h em ponto e esgota em segundos",
      },
      { time: "13h00", title: "Toy Story Land" },
    ],
  },
  {
    label: "Dia 06 — Animal Kingdom",
    color: "var(--terracotta)",
    entries: [
      {
        time: "08h00",
        title: "Kilimanjaro Safaris",
        detail: "bichos aparecem mais cedo",
      },
      { time: "19h00", title: "Pandora a noite", detail: "as plantas acendem" },
    ],
  },
  {
    label: "Dia 07 e 08 — Universal",
    entries: [
      {
        time: "dia 07",
        title: "Universal Studios",
        detail: "Hogsmeade pelo Expresso",
      },
      {
        time: "dia 08",
        title: "Islands of Adventure",
        detail: "poncho na mochila",
      },
    ],
  },
  {
    label: "Dia 09 — Kennedy Space Center",
    color: "var(--sage)",
    entries: [
      {
        time: "08h00",
        title: "Estrada ate Cabo Canaveral",
        detail: "1h de carro",
      },
      { time: "11h00", title: "Onibus ate a plataforma de lancamento" },
    ],
  },
  {
    label: "Dia 10 — volta",
    color: "var(--blush)",
    entries: [
      {
        time: "10h00",
        title: "Ultimas compras",
        detail: "conferir peso da mala",
      },
      {
        time: "18h00",
        title: "Devolver o carro e check-in",
        detail: "voo 21h40",
      },
    ],
  },
];

export const BAGAGEM: PackingItem[] = [
  { label: "passaporte e visto", done: true },
  { label: "seguro viagem impresso", done: true },
  { label: "reservas dos parques", done: true },
  { label: "protetor solar fator 50", done: true },
  { label: "poncho de chuva (3)", done: true },
  { label: "carregador portatil" },
  { label: "adaptador de tomada" },
  { label: "tenis ja amaciado" },
  { label: "garrafa de agua dobravel" },
  { label: "remedios de sempre" },
  { label: "mala vazia pras compras" },
];

export const ORCAMENTO = [
  {
    label: "passagens",
    amount: "R$ 2.200",
    spent: 1,
    color: "var(--paper-kraft)",
  },
  { label: "hospedagem", amount: "Free", spent: 1, color: "var(--blush)" },
  { label: "ingressos", amount: "R$ 7.500", spent: 0.85, color: "var(--sage)" },
  {
    label: "comida",
    amount: "~US$ 400",
    spent: 0.1,
    color: "var(--paper-kraft)",
  },
  { label: "compras", amount: "US$ 2.000", spent: 0, color: "var(--mustard)" },
  {
    label: "transporte",
    amount: "pontos do cartão",
    spent: 1,
    color: "var(--blush)",
  },
] as const;

export const PINS = [
  { x: 30, y: 34, label: "Magic Kingdom", color: "var(--poppy)" },
  { x: 56, y: 52, label: "EPCOT", color: "var(--forest)" },
  { x: 24, y: 66, label: "Animal Kingdom", color: "var(--forest)" },
  { x: 74, y: 30, label: "Universal", color: "var(--dusk)" },
  { x: 62, y: 76, label: "casa", color: "var(--terracotta)" },
];

export const MAP_PINS: {
  position: [number, number];
  label: string;
  color: string;
  days?: string[];
}[] = [
  {
    position: [28.4312, -81.3081],
    label: "MCO",
    color: "var(--dusk)",
    days: ["2026-10-07", "2026-10-15"],
  },
  {
    position: [28.522, -81.165],
    label: "casa",
    color: "var(--terracotta)",
  },
  {
    position: [28.569, -81.208],
    label: "Walmart",
    color: "var(--caramel)",
    days: ["2026-10-07"],
  },
  {
    position: [28.4427, -81.4503],
    label: "Epic Universe",
    color: "var(--poppy)",
    days: ["2026-10-08"],
  },
  {
    position: [28.4743, -81.4678],
    label: "Universal",
    color: "var(--dusk)",
    days: ["2026-10-09"],
  },
  {
    position: [28.4439, -81.47],
    label: "ICON Park",
    color: "var(--mustard)",
    days: ["2026-10-10"],
  },
  {
    position: [28.5437, -81.3729],
    label: "Lake Eola",
    color: "var(--forest)",
    days: ["2026-10-10"],
  },
  {
    position: [28.4847, -81.4314],
    label: "Millenia",
    color: "var(--mustard)",
    days: ["2026-10-11"],
  },
  {
    position: [28.4505, -81.3954],
    label: "Best Buy",
    color: "var(--dusk)",
    days: ["2026-10-11"],
  },
  {
    position: [28.4736, -81.4514],
    label: "Int’l Outlets",
    color: "var(--caramel)",
    days: ["2026-10-11"],
  },
  {
    position: [28.5729, -80.649],
    label: "Kennedy Space Center",
    color: "var(--sage)",
    days: ["2026-10-13"],
  },
  {
    position: [28.4177, -81.5812],
    label: "Magic Kingdom",
    color: "var(--poppy)",
    days: ["2026-10-14"],
  },
  {
    position: [28.3702, -81.5193],
    label: "Disney Springs",
    color: "var(--blush)",
    days: ["2026-10-08", "2026-10-13", "2026-10-15"],
  },
];

export const DICAS = [
  {
    titulo: "Rope drop ganha da fila virtual",
    texto:
      "Estar no portao 45 minutos antes da abertura rende duas ou tres atracoes populares antes das 10h. Depois disso a fila de qualquer coisa boa passa de uma hora.",
  },
  {
    titulo: "Chove todo dia, e passa rapido",
    texto:
      "A pancada da tarde dura vinte minutos. Quem tem poncho na mochila continua no parque; quem nao tem perde a tarde inteira na loja comprando um.",
  },
  {
    titulo: "Um dia sem parque nenhum",
    texto:
      "Oito noites com parque todo dia acaba com qualquer um. O domingo de compras e o dia da Erica sao o oxigenio da segunda metade.",
  },
  {
    titulo: "Comida de fora no parque? Quase nao",
    texto:
      "So agua ate 2L, dieta medica e cooler macio pequeno. Cafe forte em casa antes de sair — no parque tudo vira US$ 15 sem perceber.",
  },
];
