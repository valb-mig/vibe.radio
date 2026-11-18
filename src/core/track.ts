export type Track = {
  id: string
  title: string
  artist: string
  year?: number
  spotify?: string
  video?: string
  alts?: string[]
  secs?: number
}

export const playable = (t: Track) => Boolean(t.video && t.secs)

export const sources = (t: Track) => (t.video ? [t.video, ...(t.alts ?? [])] : [])
