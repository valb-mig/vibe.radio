import type { Station } from "./station.ts"
import { playable, type Track } from "./track.ts"
import { hash, shuffle } from "./rand.ts"

export type Slot = {
  track: Track
  start: number
  end: number
}

const gap = 2500

export const rotation = (s: Station, skip: ReadonlySet<string> = new Set()) =>
  s.tracks
    .filter((t) => playable(t) && !skip.has(t.id))
    .sort((a, b) => a.id.localeCompare(b.id))

export const at = (s: Station, now: number, skip?: ReadonlySet<string>): Slot | undefined => {
  const list = rotation(s, skip)
  if (!list.length) return
  const total = list.reduce((n, t) => n + t.secs!, 0)
  const seed = hash(s.slug)
  const t = now / 1000 + (seed % total)
  const lap = Math.floor(t / total)
  const pos = t - lap * total
  const base = now - pos * 1000
  let acc = 0
  for (const track of shuffle(list, seed + lap)) {
    if (pos < acc + track.secs!) {
      const start = base + acc * 1000
      return { track, start, end: start + track.secs! * 1000 }
    }
    acc += track.secs!
  }
}

export const next = (s: Station, now: number, skip?: ReadonlySet<string>) => {
  const slot = at(s, now, skip)
  if (!slot || slot.end - now > gap) return slot
  return at(s, slot.end + 1, skip)
}

export const offset = (slot: Slot, now: number) => Math.max(0, (now - slot.start) / 1000)
