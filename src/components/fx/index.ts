/** Efeitos de papel em WebGL2. Nenhum depende de flag de browser. */

export { CanvasFxProvider, useCanvasFx } from "./canvas-fx";
export { CanvasSlot, type CanvasSlotProps } from "./canvas-slot";
export { Crumple, type CrumpleProps } from "./crumple";
export { DustMotes, type DustMotesProps } from "./dust-motes";
export { FoilShine, type FoilShineProps } from "./foil-shine";
export {
  createGlEffect,
  GL_PRELUDE,
  type GlInstance,
  type GlSpec,
} from "./gl-effect";
export { GlSurface, useGlEffect } from "./gl-surface";
export { InkBleed, type InkBleedProps } from "./ink-bleed";
export { LightLeak, type LightLeakProps } from "./light-leak";
export { PaperScraps, type PaperScrapsProps } from "./paper-scraps";
export { PaperTear, type PaperTearProps } from "./paper-tear";
export { ScissorReveal, type ScissorRevealProps } from "./scissor-reveal";
export { ScratchOff, type ScratchOffProps } from "./scratch-off";
