import type { MDXComponents } from "mdx/types";
import {
  Alerta,
  Atracao,
  Horario,
  Lista,
  Nota,
  Opcional,
  Passo,
  Trajeto,
} from "@/components/mdx/roteiro";

const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-8 font-display text-2xl leading-tight text-ink first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 font-chunky text-lg leading-snug text-forest"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mt-3 text-sm leading-relaxed text-ink-soft" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft"
      {...props}
    />
  ),
  li: (props) => <li className="marker:text-forest" {...props} />,
  strong: (props) => <strong className="font-medium text-ink" {...props} />,
  a: (props) => (
    <a className="text-forest underline decoration-sage/70 underline-offset-2" {...props} />
  ),
  Horario,
  Passo,
  Trajeto,
  Nota,
  Alerta,
  Lista,
  Opcional,
  Atracao,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
