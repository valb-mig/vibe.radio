import type { Track } from "../../../src/core/track.ts"
import { slug } from "../../../src/core/id.ts"
import { calls, clean, field, plain, section } from "./text.ts"

const track = (title: string, artist: string, year?: number, spotify?: string): Track => ({
  id: slug(`${artist} ${title}`),
  title,
  artist,
  ...(year ? { year } : {}),
  ...(spotify ? { spotify } : {}),
})

const credit = (cell: string) => plain(cell).match(/^"(.+?)"\s+by\s+(.+)$/s)

export const table = (w: string) =>
  clean(w)
    .split(/\n\|-/)
    .slice(1)
    .flatMap((row) => {
      const cells = row.split("\n").filter((l) => l.startsWith("|") && !l.startsWith("|}"))
      const m = cells[0] && credit(cells[0].slice(1))
      if (!m) return []
      const year = cells
        .slice(1, 3)
        .map((c) => c.match(/^\|\s*(\d{4})\b/)?.[1])
        .find(Boolean)
      const spotify = row.match(/spotify:track:(\w+)/)?.[1]
      return [track(m[1].trim(), m[2].trim(), year ? Number(year) : undefined, spotify)]
    })

export const songs = (w: string, except: RegExp) =>
  clean(section(w, "Songs"))
    .split("\n")
    .filter((l) => l.startsWith("*") && !except.test(l))
    .flatMap((l) => {
      const m = plain(l.slice(1)).match(/^(.+?)\s+[–-]\s+"(.+?)"\s*\((\d{4})/)
      return m ? [track(m[2].trim(), m[1].trim(), Number(m[3]))] : []
    })

export const meta = (w: string) => {
  const box = calls(w, "Infobox media")[0] ?? []
  const value = (key: string) => plain(field(box, key) ?? "") || undefined
  const quote = calls(w, "Quote")[0]?.[0]
  const lead = clean(w)
    .split("\n")
    .find((l) => l.startsWith("'''"))
  const games = [...(field(box, "games") ?? "").matchAll(/\|\s*(\w+)\s*=/g)].map((g) => g[1])
  return {
    games,
    name: value("name"),
    genre: value("genre"),
    freq: value("frequency"),
    hosts: (value("host") ?? "")
      .split("\n")
      .map((l) => l.replace(/^\*\s*/, "").trim())
      .filter(Boolean),
    blurb: plain(quote ?? lead ?? "") || undefined,
  }
}
