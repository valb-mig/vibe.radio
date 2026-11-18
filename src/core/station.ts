import type { Track } from "./track.ts"

export type Kind = "official" | "leaked" | "album" | "trailer"

export type Art = {
  promo?: string
  icon?: string
  logo?: string
}

export type Station = {
  slug: string
  name: string
  kind: Kind
  tint: string
  genre?: string
  freq?: string
  hosts: string[]
  blurb?: string
  art: Art
  source: string
  tracks: Track[]
}
