import type { Track } from "../../../src/core/track.ts"

export type Hit = {
  video: string
  title: string
  artists: string
  secs: number
}

const noise = ["instrumental", "karaoke", "live", "sped", "slowed", "cover", "acoustic", "dub", "remix", "reverb", "8d", "tribute", "mix", "edit", "extended"]

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const words = (s: string) => new Set(norm(s).split(" ").filter(Boolean))

const names = (artist: string) =>
  artist
    .split(/,|&|\bfeat\.?|\bft\.?|\band\b|\bx\b/i)
    .map(norm)
    .filter((n) => n.length > 1)

const share = (want: Set<string>, got: Set<string>) =>
  [...want].filter((w) => got.has(w)).length / Math.max(1, want.size)

export const score = (t: Track, h: Hit) => {
  const want = words(t.title)
  const got = words(h.title)
  const base = words(t.title.replace(/\s*[([].*?[)\]]/g, ""))
  const title = Math.max(share(want, got), 0.9 * share(base, got))
  const who = norm(`${h.artists} ${h.title}`)
  const lead = t.artist.split(/\s+feat\.?\s+/i)[0].toLowerCase()
  const artist = names(t.artist).some((n) => who.includes(n)) || `${h.artists} ${h.title}`.toLowerCase().includes(lead)
  const extra = noise.filter((n) => got.has(n) && !want.has(n)).length
  const own = names(t.artist).some((n) => norm(h.artists).includes(n))
  if (!artist || title < 0.5) return 0
  return 4 * title + 2 + (own ? 1 : 0) - 4 * extra
}

export const rank = (t: Track, hits: Hit[]) =>
  hits
    .map((h, i) => ({ h, s: score(t, h) - i * 0.01 }))
    .filter((x) => x.s >= 4)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.h)
