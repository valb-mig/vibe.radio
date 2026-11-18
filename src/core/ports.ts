import type { Station } from "./station.ts"
import type { Track } from "./track.ts"

export type Signal = "play" | "end" | "error"

export interface Player {
  load(video: string, from: number): void
  stop(): void
  seek(secs: number): void
  time(): number
  volume(level: number): void
  on(signal: Signal, fn: () => void): void
}

export interface Fx {
  tune(level: number): void
}

export interface Catalog {
  all(): Station[]
  get(slug: string): Station | undefined
}

export interface Source {
  stations(): Promise<Station[]>
}

export type Match = Required<Pick<Track, "video" | "secs">> & Pick<Track, "alts">

export interface Resolver {
  find(track: Track): Promise<Match | undefined>
}
