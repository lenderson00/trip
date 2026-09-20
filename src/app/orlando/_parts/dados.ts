import type { ItineraryDay } from "@/components/paper/itinerary-thread";
import type { PackingItem } from "@/components/paper/packing-checklist";

/**
 * Dados da viagem, separados do layout.
 *
 * Esta pagina e uma demonstracao do sistema de papel com conteudo realista --
 * os numeros e horarios sao inventados. Quando virar produto, isto aqui vira
 * a resposta da API e nenhuma das pecas visuais precisa mudar.
 */

export const VIAGEM = {
  destino: "Orlando",
  pais: "Estados Unidos",
  entrada: "05 de fevereiro de 2027",
  saida: "14 de fevereiro de 2027",
  noites: 9,
  viajantes: "2 adultos + 1 crianca (9 anos)",
  hospedagem: "Resort na International Drive",
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
  data: "05 fev",
  hora: "22h15",
  duracao: "8h20 · direto",
  assentos: "24A 24B 24C",
};

export const VOO_VOLTA: Voo = {
  numero: "LA 8181",
  de: "MCO",
  para: "GRU",
  cidadeDe: "Orlando",
  cidadePara: "Sao Paulo",
  data: "14 fev",
  hora: "21h40",
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
    amount: "R$ 9.800",
    spent: 1,
    color: "var(--paper-kraft)",
  },
  { label: "hospedagem", amount: "R$ 7.200", spent: 1, color: "var(--blush)" },
  { label: "ingressos", amount: "R$ 12.400", spent: 0.7, color: "var(--sage)" },
  {
    label: "comida",
    amount: "R$ 5.000",
    spent: 0.15,
    color: "var(--paper-kraft)",
  },
  { label: "compras", amount: "R$ 6.000", spent: 0, color: "var(--mustard)" },
  {
    label: "transporte",
    amount: "R$ 1.800",
    spent: 0.4,
    color: "var(--blush)",
  },
] as const;

export const PINS = [
  { x: 30, y: 34, label: "Magic Kingdom", color: "var(--poppy)" },
  { x: 56, y: 52, label: "EPCOT", color: "var(--forest)" },
  { x: 24, y: 66, label: "Animal Kingdom", color: "var(--forest)" },
  { x: 74, y: 30, label: "Universal", color: "var(--dusk)" },
  { x: 62, y: 76, label: "resort", color: "var(--terracotta)" },
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
      "Dez dias seguidos de parque acaba com qualquer um, ainda mais com crianca. O dia de piscina no meio e o que faz a segunda metade da viagem valer.",
  },
];
