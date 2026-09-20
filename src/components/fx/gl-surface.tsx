"use client";

import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { createGlEffect, type GlInstance, type GlSpec } from "./gl-effect";

export type UseGlEffect<C extends object> = {
  contentRef: RefObject<HTMLDivElement | null>;
  outputRef: RefObject<HTMLCanvasElement | null>;
  instance: RefObject<GlInstance<C> | null>;
};

/** Liga um fragment shader a um pedaco da arvore. */
export function useGlEffect<C extends object, S = void>(
  spec: GlSpec<C, S>,
  options: Partial<C>,
  active: boolean,
): UseGlEffect<C> {
  const contentRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const instance = useRef<GlInstance<C> | null>(null);
  const [initial] = useState(options);

  useEffect(() => {
    const content = contentRef.current;
    const output = outputRef.current;
    if (!content || !output) return;

    instance.current = createGlEffect({ content, output }, spec, initial);
    return () => {
      instance.current?.destroy();
      instance.current = null;
    };
  }, [spec, initial]);

  useEffect(() => {
    instance.current?.setOptions(options);
  });

  useEffect(() => {
    instance.current?.setActive(active);
  }, [active]);

  return { contentRef, outputRef, instance };
}

/* O host so precisa dos refs; a config e problema do efeito. */
// biome-ignore lint/suspicious/noExplicitAny: ver acima
export type AnyGlEffect = UseGlEffect<any>;

export type GlSurfaceProps = {
  gl: AnyGlEffect;
  children: ReactNode;
  /** Quanto o canvas transborda a caixa, por lado, em px. */
  bleed?: { top?: number; right?: number; bottom?: number; left?: number };
  /** Esconde o conteudo DOM (quando o shader ja desenha no lugar dele). */
  hideContent?: boolean;
  /** Canvas atras do conteudo em vez de na frente. */
  behind?: boolean;
  /** Blend do canvas com o que esta embaixo (luz pede "screen"). */
  blend?: CSSProperties["mixBlendMode"];
  className?: string;
  style?: CSSProperties;
  /** Camada desenhada atras de tudo, dentro da mesma caixa. */
  under?: ReactNode;
};

/**
 * Empilha conteudo e canvas.
 *
 * O conteudo continua sendo HTML normal e interativo; o canvas e so uma
 * camada de tinta por cima (ou por baixo, com `behind`), sempre com
 * pointer-events desligados.
 */
export function GlSurface({
  gl,
  children,
  bleed,
  hideContent = false,
  behind = false,
  blend,
  className,
  style,
  under,
}: GlSurfaceProps) {
  const { contentRef, outputRef } = gl;
  const top = bleed?.top ?? 0;
  const right = bleed?.right ?? 0;
  const bottom = bleed?.bottom ?? 0;
  const left = bleed?.left ?? 0;

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      {under ? (
        <div style={{ position: "absolute", inset: 0 }}>{under}</div>
      ) : null}

      <div
        ref={contentRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          opacity: hideContent ? 0 : 1,
          zIndex: behind ? 1 : 0,
        }}
      >
        {children}
      </div>

      <canvas
        ref={outputRef}
        aria-hidden
        style={{
          position: "absolute",
          top: -top,
          right: -right,
          bottom: -bottom,
          left: -left,
          width: `calc(100% + ${left + right}px)`,
          height: `calc(100% + ${top + bottom}px)`,
          pointerEvents: "none",
          mixBlendMode: blend,
          zIndex: behind ? 0 : 2,
        }}
      />
    </div>
  );
}
