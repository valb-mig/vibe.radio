import { spawn } from "node:child_process"
import { access, mkdir, writeFile } from "node:fs/promises"
import type { Art } from "../../src/core/station.ts"

const root = new URL("../../public/art/", import.meta.url)

const shapes: Record<keyof Art, { ext: string; args: string[] }> = {
  promo: { ext: "jpg", args: ["-resize", "1920x1920>", "-quality", "82"] },
  icon: { ext: "jpg", args: ["-resize", "512x512^", "-gravity", "center", "-extent", "512x512", "-quality", "86"] },
  logo: { ext: "png", args: ["-resize", "1024x1024>"] },
}

const exists = (url: URL) =>
  access(url).then(
    () => true,
    () => false,
  )

const tools = ["magick", "convert"]

const run = (tool: string, input: Buffer, args: string[], out: string) =>
  new Promise<boolean>((done) => {
    const p = spawn(tool, ["-", ...args, out])
    p.on("error", () => done(false))
    p.on("close", (code) => done(code === 0))
    p.stdin.on("error", () => {})
    p.stdin.end(input)
  })

const convert = async (input: Buffer, args: string[], out: string) => {
  for (const tool of tools) if (await run(tool, input, args, out)) return true
  return false
}

export const localize = async (slug: string, art: Art, opts: { fresh: boolean; trim: boolean }) => {
  const dir = new URL(`${slug}/`, root)
  const out: Art = {}
  for (const [key, url] of Object.entries(art) as [keyof Art, string][]) {
    const { ext, args } = shapes[key]
    const file = new URL(`${key}.${ext}`, dir)
    const path = `/art/${slug}/${key}.${ext}`
    if (!opts.fresh && (await exists(file))) {
      out[key] = path
      continue
    }
    const res = await fetch(url, { headers: { "user-agent": "vibe.radio/0.1 (fan project)" } })
    if (!res.ok) continue
    await mkdir(dir, { recursive: true })
    const raw = Buffer.from(await res.arrayBuffer())
    const pre = opts.trim ? ["-fuzz", "12%", "-trim", "+repage"] : []
    if (!(await convert(raw, [...pre, ...args], file.pathname))) await writeFile(file, raw)
    out[key] = path
  }
  return out
}
