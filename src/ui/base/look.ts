import { cx } from "./cx"

export type Tone = "solid" | "glass" | "ghost"
export type Size = "sm" | "md" | "lg"
export type Look = { tone?: Tone; size?: Size; round?: boolean }

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tint) disabled:pointer-events-none disabled:opacity-40"

const tones: Record<Tone, string> = {
  solid: "bg-(--tint) text-ink hover:brightness-110 active:brightness-95",
  glass: "bg-white/8 text-white ring-1 ring-white/12 backdrop-blur-md hover:bg-white/14",
  ghost: "text-white/75 hover:bg-white/8 hover:text-white",
}

const texts: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

const boxes: Record<Size, string> = {
  sm: "h-8 rounded-lg px-3",
  md: "h-10 rounded-xl px-4",
  lg: "h-12 rounded-2xl px-6",
}

const rounds: Record<Size, string> = {
  sm: "size-8 rounded-full",
  md: "size-10 rounded-full",
  lg: "size-12 rounded-full",
}

export const look = ({ tone = "ghost", size = "md", round }: Look) =>
  cx(base, tones[tone], texts[size], (round ? rounds : boxes)[size])
