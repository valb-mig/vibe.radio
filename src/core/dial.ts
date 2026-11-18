import type { Station } from "./station.ts"

export const step = (list: Station[], slug: string | undefined, dir: 1 | -1) => {
  if (!list.length) return
  const i = list.findIndex((s) => s.slug === slug)
  if (i < 0) return list[dir > 0 ? 0 : list.length - 1]
  return list[(i + dir + list.length) % list.length]
}
