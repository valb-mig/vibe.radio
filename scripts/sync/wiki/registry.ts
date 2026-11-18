import type { Kind } from "../../../src/core/station.ts"

export type Entry = {
  page: string
  kind: Kind
  tint: string
  name?: string
  slug?: string
  genre?: string
  blurb?: string
  list?: string
  songs?: RegExp
  art?: { promo?: string; icon?: string; logo?: string; trim?: boolean }
}

export const overview = "Radio Stations in GTA VI"

const trailer = "GTAVIPreLoadTrailer-GTAVI-SS4.jpg"

export const registry: Entry[] = [
  { page: "Flash FM", kind: "official", tint: "#ff3ea5" },
  { page: "AfroBank FM", kind: "official", tint: "#ffb400" },
  { page: "Cocoteo FM", kind: "official", tint: "#d68cff" },
  { page: "The Chamber 106.6", kind: "official", tint: "#ff2a1f" },
  { page: "Dirty South Classics", kind: "official", tint: "#e0b84f" },
  { page: "Back Country Radio", kind: "official", tint: "#d9a46a" },
  { page: "Vice City FM", kind: "official", tint: "#f472b6" },
  { page: "Honey FM", kind: "official", tint: "#fbbf24" },
  { page: "CircoLoco Records Radio", kind: "official", tint: "#c084fc" },
  { page: "V-Rock", kind: "leaked", tint: "#a855f7" },
  { page: "Emotion 98.3", kind: "leaked", tint: "#fb7185" },
  { page: "Kaleidoscope FM", kind: "leaked", tint: "#22d3ee" },
  { page: "La Ola", kind: "leaked", tint: "#fb923c" },
  { page: "Radio On-U", kind: "leaked", tint: "#4ade80" },
  { page: "Stockyard FM", kind: "leaked", tint: "#38bdf8" },
  { page: "Symphony FM", kind: "leaked", tint: "#e2e8f0" },
  { page: "WorldWide FM", kind: "leaked", tint: "#fde047" },
  { page: "The Wipe", kind: "leaked", tint: "#60a5fa" },
  {
    page: "Grand Theft Auto VI: The Album",
    kind: "album",
    tint: "#ff6a3d",
    name: "The Album",
    slug: "the-album",
    genre: "Soundtrack",
    blurb: "The official soundtrack album: original songs made for the game, from Travis Scott and Cardi B to Justice and Tove Lo.",
    list: "Grand Theft Auto VI: The Album",
    art: {
      promo: "GTAVITheAlbum-GTAVI-CoverArtLandscape.jpg",
      icon: "GTAVITheAlbum-GTAVI-CoverArt.jpg",
    },
  },
  {
    page: overview,
    kind: "trailer",
    tint: "#2dd4bf",
    name: "Trailer Mix",
    slug: "trailer-mix",
    genre: "Various",
    blurb: "Every song from the trailers and An Extended Look, back to back.",
    songs: /gtavithealbum/,
    art: { promo: trailer, icon: trailer, trim: true },
  },
]
