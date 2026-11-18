const entities: Record<string, string> = {
  amp: "&",
  nbsp: " ",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  ndash: "–",
  mdash: "—",
}

export const join = (names: string[]) =>
  names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`

const games: Record<string, string> = {
  vi: "Grand Theft Auto VI",
  v: "Grand Theft Auto V",
  o: "GTA Online",
  vo: "GTA V and GTA Online",
  vc: "GTA Vice City",
  tbogt: "The Ballad of Gay Tony",
  "3d": "3D Universe",
  hd: "HD Universe",
  s: "series",
}

const named = (a: string) => /^\s*\w+\s*=/.test(a)

const render: Record<string, (args: string[]) => string> = {
  nd: () => " – ",
  "!": () => "|",
  wp: (a) => a[1] ?? a[0],
  url: (a) => a[1] ?? a[0],
  time: (a) => a[0],
  qt: (a) => a[0],
  location: (a) =>
    a[0]
      .replace(/^\w+-/, "")
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
  song: (a) => {
    const [title, ...artists] = a.filter((x) => !named(x)).map((x) => x.trim())
    return `"${title}" by ${join(artists)}`
  },
}

export const clean = (w: string) =>
  w
    .replace(/<!--[\s\S]*?(?:-->|$)/g, "")
    .replace(/<ref[^>/]*\/>/g, "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replace(/<\/?(?:noinclude|includeonly|onlyinclude)>/g, "")

const links = (w: string) =>
  w.replace(/\[\[([^\]|]*)(?:\|([^\]]*))?\]\]/g, (_, to: string, label?: string) =>
    /^(File|Image|Category):/i.test(to) ? "" : (label ?? to.replace(/^:/, "").replace(/#.*$/, "")),
  )

const templates = (w: string) => {
  let out = w
  let prev
  do {
    prev = out
    out = out.replace(/\{\{([^{}]*)\}\}/g, (_, body: string) => {
      const [name, ...args] = body.split("|")
      const key = name.trim().toLowerCase()
      return render[key]?.(args) ?? (args.length ? "" : (games[key] ?? ""))
    })
  } while (out !== prev)
  return out
}

const decode = (w: string) =>
  w
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&(\w+);/g, (m, n: string) => entities[n] ?? m)

export const plain = (w: string) =>
  decode(templates(links(clean(w))))
    .replace(/'{2,}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim()

export const calls = (w: string, name: string) => {
  const out: string[][] = []
  const re = new RegExp(`\\{\\{\\s*${escape(name)}\\s*[|}]`, "gi")
  for (const m of w.matchAll(re)) {
    const args: string[] = []
    let depth = 0
    let cur = ""
    for (let i = m.index; i < w.length; i++) {
      const two = w.slice(i, i + 2)
      if (two === "{{" || two === "[[") {
        if (++depth > 1) cur += two
        i++
      } else if (two === "}}" || two === "]]") {
        if (--depth === 0) break
        cur += two
        i++
      } else if (w[i] === "|" && depth === 1) {
        args.push(cur)
        cur = ""
      } else cur += w[i]
    }
    args.push(cur)
    out.push(args.slice(1))
  }
  return out
}

export const field = (args: string[], key: string) => {
  const hit = args.find((a) => new RegExp(`^\\s*${key}\\s*=`).test(a))
  return hit?.replace(/^[^=]*=/, "").trim()
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const section = (w: string, name: string, level = 2) => {
  const bar = "=".repeat(level)
  const start = w.search(new RegExp(`^${bar}\\s*${escape(name)}\\s*${bar}\\s*$`, "m"))
  if (start < 0) return ""
  const rest = w.slice(start).replace(/^.*\n/, "")
  const end = rest.search(new RegExp(`^={2,${level}}[^=]`, "m"))
  return end < 0 ? rest : rest.slice(0, end)
}

export const prose = (w: string) =>
  clean(w)
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !/^(\{\{|\[\[(File|Image):|\*|\||!|=)/i.test(l))
