import type { Resolver } from "../../../src/core/ports.ts"
import type { Track } from "../../../src/core/track.ts"
import { rank, type Hit } from "./match.ts"

const endpoint = "https://music.youtube.com/youtubei/v1/search?prettyPrint=false"
const filters = ["EgWKAQIIAWoKEAkQBRAKEAMQBA%3D%3D", "EgWKAQIQAWoKEAkQChAFEAMQBA%3D%3D"]
const drift = 6
const client = { clientName: "WEB_REMIX", clientVersion: "1.20251110.01.00", hl: "en", gl: "US" }

type Node = Record<string, unknown>

const walk = (o: unknown, key: string, acc: Node[] = []) => {
  if (o && typeof o === "object") {
    const n = o as Node
    if (key in n) acc.push(n[key] as Node)
    for (const v of Object.values(n)) walk(v, key, acc)
  }
  return acc
}

const text = (col: Node) => {
  const runs = (col as { musicResponsiveListItemFlexColumnRenderer?: { text?: { runs?: { text: string }[] } } })
    .musicResponsiveListItemFlexColumnRenderer?.text?.runs
  return (runs ?? []).map((r) => r.text).join("")
}

const secs = (s: string) => s.split(":").reduce((n, p) => n * 60 + Number(p), 0)

const hit = (item: Node): Hit | undefined => {
  const video = (item.playlistItemData as { videoId?: string } | undefined)?.videoId
  const cols = ((item.flexColumns as Node[]) ?? []).map(text)
  const parts = (cols[1] ?? "").split(" • ")
  const time = parts.at(-1) ?? ""
  if (!video || !/^\d+(:\d\d){1,2}$/.test(time)) return
  return { video, title: cols[0] ?? "", artists: parts[0] ?? "", secs: secs(time) }
}

const embeddable = async (video: string) => {
  const url = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${video}`
  return (await fetch(url)).ok
}

export class YouTubeMusic implements Resolver {
  async search(query: string, filter = filters[0]) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://music.youtube.com", "user-agent": "Mozilla/5.0" },
      body: JSON.stringify({ context: { client }, query, params: filter }),
    })
    if (!res.ok) throw new Error(`youtube music ${res.status}`)
    return walk(await res.json(), "musicResponsiveListItemRenderer").flatMap((i) => hit(i) ?? [])
  }

  async find(track: Track) {
    const query = `${track.artist} ${track.title}`
    const hits: Hit[] = []
    for (const filter of filters) hits.push(...rank(track, await this.search(query, filter)).slice(0, 4))
    const ok: Hit[] = []
    for (const h of hits) if (!ok.some((o) => o.video === h.video) && (await embeddable(h.video))) ok.push(h)
    const [best, ...rest] = ok
    if (!best) return
    const alts = rest
      .filter((h) => Math.abs(h.secs - best.secs) <= drift)
      .slice(0, 3)
      .map((h) => h.video)
    return { video: best.video, secs: best.secs, ...(alts.length ? { alts } : {}) }
  }
}
