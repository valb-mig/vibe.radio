import { hash } from "../../../src/core/rand.ts"

const channel = (h: number, s: number, l: number, n: number) => {
  const k = (n + h * 12) % 12
  const a = s * Math.min(l, 1 - l)
  const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  return Math.round(v * 255)
    .toString(16)
    .padStart(2, "0")
}

export const tint = (seed: string) => {
  const h = (hash(seed) % 360) / 360
  return `#${[0, 8, 4].map((n) => channel(h, 0.85, 0.62, n)).join("")}`
}
