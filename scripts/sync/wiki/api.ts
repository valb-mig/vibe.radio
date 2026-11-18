const base = "https://gta.wiki"
const agent = "vibe.radio/0.1 (fan project)"

export type Page = {
  title: string
  text: string
  images: string[]
}

const call = async (params: Record<string, string>) => {
  const url = new URL(`${base}/api.php`)
  url.search = new URLSearchParams({ ...params, format: "json", formatversion: "2" }).toString()
  const res = await fetch(url, { headers: { "user-agent": agent } })
  if (!res.ok) throw new Error(`wiki ${res.status} ${url}`)
  return res.json()
}

export const page = async (title: string): Promise<Page | undefined> => {
  const j = await call({ action: "parse", page: title, prop: "wikitext|images", redirects: "1" })
  if (j.error) return
  return { title: j.parse.title, text: j.parse.wikitext, images: j.parse.images }
}

export const files = async (names: string[]) => {
  const out = new Map<string, string>()
  if (!names.length) return out
  const j = await call({
    action: "query",
    prop: "imageinfo",
    iiprop: "url",
    titles: names.map((n) => `File:${n}`).join("|"),
  })
  for (const p of j.query.pages) {
    const url = p.imageinfo?.[0]?.url
    if (url) out.set(p.title.replace(/^File:/, "").replaceAll(" ", "_"), url)
  }
  return out
}

export const link = (title: string) => `${base}/w/${encodeURIComponent(title.replaceAll(" ", "_"))}`
