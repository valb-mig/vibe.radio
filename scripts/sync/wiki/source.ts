import type { Source } from "../../../src/core/ports.ts"
import type { Station } from "../../../src/core/station.ts"
import { slug } from "../../../src/core/id.ts"
import { files, link, page } from "./api.ts"
import { meta, songs, table } from "./parse.ts"
import { overview, registry, type Entry } from "./registry.ts"
import { clean, parts, plain, prose, section } from "./text.ts"
import { tint } from "./tint.ts"

const leak = "Spotted on the radio wheel in the August 2026 leaks."

const vi = /\{\{VI\}\}|Grand Theft Auto VI|GTA VI/

const special = (e: Entry) => e.kind === "album" || e.kind === "trailer"

const found = (main: string) =>
  [...section(main, "Radio Stations").matchAll(/\{\{Main\|([^}|]+)/g)].map((m) => m[1].trim())

const plan = (main: string) => {
  const known = new Set(registry.map((e) => e.page))
  const extra: Entry[] = found(main)
    .filter((p) => !known.has(p))
    .map((page) => ({ page, kind: "official", tint: tint(page) }))
  return [...registry.filter((e) => !special(e)), ...extra, ...registry.filter(special)]
}

const pick = (images: string[], kind: string) => images.find((i) => i.includes(`-GTAVI-${kind}.`))

export class Wiki implements Source {
  async stations() {
    const main = clean((await page(overview))?.text ?? "")
    const out: Station[] = []
    for (const e of plan(main)) {
      const s = await this.#station(e, main)
      if (s?.tracks.length) out.push(s)
    }
    return out
  }

  async #station(e: Entry, main: string): Promise<Station | undefined> {
    const p = await page(e.page)
    if (!p) return
    const m = meta(p.text)
    const known = e.kind === "official"
    const intro = plain(prose(section(main, p.title, 3)) ?? "") || undefined
    const list = e.songs ? undefined : await page(e.list ?? `${e.page}/Tracklist`)
    const shared = !e.list && m.games.some((g) => g !== "VI")
    const body = list ? (shared ? parts(clean(list.text), vi) : list.text) : ""
    const tracks = e.songs ? songs(p.text, e.songs) : table(body)
    const want = e.art ?? {
      promo: pick(p.images, "PromotionalImage"),
      icon: pick(p.images, "Icon"),
      logo: pick(p.images, "Logo"),
    }
    const names = { promo: want.promo, icon: want.icon, logo: want.logo }
    const urls = await files(Object.values(names).filter((v): v is string => Boolean(v)))
    const art = Object.fromEntries(
      Object.entries(names).flatMap(([k, v]) => (v && urls.get(v) ? [[k, urls.get(v)!]] : [])),
    )
    return {
      slug: e.slug ?? slug(p.title),
      name: e.name ?? m.name ?? p.title,
      kind: e.kind,
      tint: e.tint,
      genre: e.genre ?? m.genre,
      freq: m.freq,
      hosts: known ? m.hosts : [],
      blurb: e.blurb ?? (known ? m.blurb : intro) ?? leak,
      art,
      source: link(p.title),
      tracks: [...new Map(tracks.map((t) => [t.id, t])).values()],
    }
  }
}

export const trims = new Set(registry.filter((e) => e.art?.trim).map((e) => e.slug))
