import { readFile, writeFile } from "node:fs/promises"
import type { Match } from "../../src/core/ports.ts"
import type { Station } from "../../src/core/station.ts"

const data = new URL("../../data/", import.meta.url)

const read = async <T>(name: string, empty: T): Promise<T> => {
  try {
    return JSON.parse(await readFile(new URL(name, data), "utf8"))
  } catch {
    return empty
  }
}

export const load = () => read<Station[]>("stations.json", [])

export const save = (list: Station[]) =>
  writeFile(new URL("stations.json", data), `${JSON.stringify(list, null, 2)}\n`)

export const pins = () => read<Record<string, Match | null>>("pins.json", {})
