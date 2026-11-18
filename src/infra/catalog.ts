import data from "../../data/stations.json"
import type { Catalog } from "@/core/ports"
import type { Station } from "@/core/station"

const list = data as Station[]
const map = new Map(list.map((s) => [s.slug, s]))

export const catalog: Catalog = {
  all: () => list,
  get: (slug) => map.get(slug),
}
