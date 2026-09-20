"use client";

import { useEffect, useMemo, useState } from "react";
import { useCanvasFx } from "@/components/fx/canvas-fx";
import { GL_PRELUDE, type GlSpec } from "@/components/fx/gl-effect";
import { GlSurface, useGlEffect } from "@/components/fx/gl-surface";
import { toSeed } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { PARTIDA } from "./dados";

type GlowConfig = {
  warm: [number, number, number];
  cool: [number, number, number];
  intensity: number;
  pulse: number;
  seed: number;
};

const FRAG = `${GL_PRELUDE}
uniform vec3 uWarm;
uniform vec3 uCool;
uniform float uIntensity;
uniform float uPulse;
uniform float uSeed;

void main () {
  vec2 frag = vUv * uResolution;
  vec2 rel = frag - uRectCenter;
  vec2 p = rel / uDpr;
  vec2 half_ = uRectHalf / uDpr;

  float t = uTime * (0.4 + uPulse * 0.25);
  float ring = length(p / half_);
  float breathe = 0.78 + 0.22 * sin(t + uSeed);

  /* Halo nas bordas — o miolo fica limpo pra o texto nao lavar. */
  float edge = S(0.35, 1.05, ring);
  float halo = edge * exp(-pow(ring * 0.85, 2.0)) * breathe;
  float sweep = exp(-pow(abs(p.x / half_.x) * 1.6 + abs(p.y / half_.y) * 0.5, 2.4)) * 0.35;
  float grain = (hash1(floor(frag) + floor(uTime * 14.0)) - 0.5) * 0.04;

  vec3 col = uWarm * (halo * 0.9 + sweep * 0.4) + uCool * edge * 0.25;
  col += grain;

  float alpha = clamp((halo * 0.85 + sweep * 0.3) * uIntensity, 0.0, 0.55);
  outColor = vec4(max(col, vec3(0.0)) * alpha, alpha);
}`;

const SPEC: GlSpec<GlowConfig> = {
  frag: FRAG,
  defaults: {
    warm: [0.92, 0.68, 0.38],
    cool: [0.4, 0.55, 0.72],
    intensity: 0.55,
    pulse: 1,
    seed: 4,
  },
  uniforms: (gl, loc, c) => {
    if (loc.uWarm) gl.uniform3f(loc.uWarm, c.warm[0], c.warm[1], c.warm[2]);
    if (loc.uCool) gl.uniform3f(loc.uCool, c.cool[0], c.cool[1], c.cool[2]);
    if (loc.uIntensity) gl.uniform1f(loc.uIntensity, c.intensity);
    if (loc.uPulse) gl.uniform1f(loc.uPulse, c.pulse);
    if (loc.uSeed) gl.uniform1f(loc.uSeed, c.seed);
  },
};

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function split(ms: number): Parts {
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds, done: false };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-[4.25rem] flex-col items-center">
      <span className="relative z-10 font-display text-3xl tabular-nums leading-none text-ink sm:text-4xl">
        {value}
      </span>
      <span className="relative z-10 mt-1 font-hand text-lg text-caramel">
        {label}
      </span>
    </div>
  );
}

/**
 * Contagem regressiva ate o embarque em GRU.
 * O WebGL fica atras do cartao — nunca lava os digitos.
 */
export function Cronometro({ className }: { className?: string }) {
  const target = useMemo(() => new Date(PARTIDA.iso).getTime(), []);
  const [now, setNow] = useState(() => Date.now());
  const { enabled } = useCanvasFx();
  const seedValue = useMemo(() => (toSeed("partida", 4) % 91) / 6, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = split(target - now);
  const options = useMemo<Partial<GlowConfig>>(
    () => ({
      intensity: enabled ? (parts.done ? 0.25 : 0.55) : 0,
      pulse: parts.done ? 0.2 : 1,
      seed: seedValue,
    }),
    [enabled, parts.done, seedValue],
  );
  const gl = useGlEffect(SPEC, options, enabled);

  return (
    <GlSurface
      gl={gl}
      blend="screen"
      behind
      bleed={{ top: 32, right: 40, bottom: 32, left: 40 }}
      className={cn("relative inline-block max-w-full", className)}
    >
      <div
        className="relative z-10 rounded-sm border border-ink/15 bg-[var(--paper-cream)] px-5 py-5 text-center shadow-[var(--shadow-lift)] sm:px-8"
        style={{ transform: "rotate(-0.6deg)" }}
      >
        <p className="font-hand text-2xl text-caramel">falta pra decolar</p>
        <p className="mt-0.5 text-xs font-medium tracking-wide text-ink-soft">
          {PARTIDA.label} · chega MCO {PARTIDA.chegaOrlando}
        </p>

        {parts.done ? (
          <p className="mt-4 font-display text-2xl text-ink">
            ja foi · boa viagem
          </p>
        ) : (
          <div className="mt-4 flex items-end justify-center gap-3 sm:gap-5">
            <Unit value={String(parts.days)} label="dias" />
            <span className="mb-6 font-display text-2xl text-ink/40">:</span>
            <Unit value={pad(parts.hours)} label="hrs" />
            <span className="mb-6 font-display text-2xl text-ink/40">:</span>
            <Unit value={pad(parts.minutes)} label="min" />
            <span className="mb-6 font-display text-2xl text-ink/40">:</span>
            <Unit value={pad(parts.seconds)} label="seg" />
          </div>
        )}

        <p className="mt-4 text-xs font-medium text-ink-soft">
          volta · MCO 22h00 → GRU 10h40 · 16 out
        </p>
      </div>
    </GlSurface>
  );
}
