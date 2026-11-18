import type { Station } from "../../src/core/station.ts"
import type { Track } from "../../src/core/track.ts"
import { localize } from "./art.ts"
import { load, pins, save } from "./store.ts"
import { YouTubeMusic } from "./tube/music.ts"
import { trims, Wiki } from "./wiki/source.ts"

const args = process.argv.slice(2)
const mode = args.find((a) => !a.startsWith("--")) ?? "all"
const fresh = args.includes("--fresh")
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const label = (s: Station, t: Track) => `${s.slug.padEnd(22)} ${t.artist} – ${t.title}`

const wiki = async () => {
  const prev = new Map((await load()).flatMap((s) => s.tracks.map((t) => [t.id, t])))
  const list = await new Wiki().stations()
  for (const s of list) {
    s.art = await localize(s.slug, s.art, { fresh, trim: trims.has(s.slug) })
    s.tracks = s.tracks.map((t) => {
      const old = prev.get(t.id)
      return old?.video ? { ...t, video: old.video, alts: old.alts, secs: old.secs } : t
    })
    console.log(`${s.slug.padEnd(22)} ${s.tracks.length} tracks  art: ${Object.keys(s.art).join(", ") || "none"}`)
  }
  await save(list)
}

const tube = async () => {
  const list = await load()
  const fixed = await pins()
  const yt = new YouTubeMusic()
  for (const s of list) {
    for (const t of s.tracks) {
      if (t.id in fixed) {
        const pin = fixed[t.id]
        if (pin) Object.assign(t, pin)
        else {
          delete t.video
          delete t.alts
          delete t.secs
        }
        continue
      }
      if (t.video && !fresh) continue
      const m = await yt.find(t).catch(() => undefined)
      delete t.alts
      if (m) Object.assign(t, m)
      console.log(`${m ? "✓" : "✗"} ${label(s, t)}${m ? `  ${m.video} ${m.secs}s +${m.alts?.length ?? 0}` : ""}`)
      await wait(250)
    }
  }
  await save(list)
  const miss = list.flatMap((s) => s.tracks.filter((t) => !t.video).map((t) => label(s, t)))
  console.log(`\n${miss.length} missing${miss.length ? `:\n  ${miss.join("\n  ")}` : ""}`)
}

if (mode === "wiki" || mode === "all") await wiki()
if (mode === "tube" || mode === "all") await tube()
