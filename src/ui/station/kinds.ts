import type { Kind } from "@/core/station"

export const tags: Record<Kind, string> = {
  official: "Official",
  leaked: "Leaked",
  album: "Album",
  trailer: "Trailers",
}

export const groups: { title: string; note: string; kinds: Kind[]; compact?: boolean }[] = [
  {
    title: "Official stations",
    note: "Revealed by Rockstar ahead of launch. Tracklists grow as the wiki fills in.",
    kinds: ["official"],
  },
  {
    title: "Specials",
    note: "The soundtrack album and every song from the trailers, running as stations.",
    kinds: ["album", "trailer"],
  },
  {
    title: "Spotted in the leaks",
    note: "Seen on the radio wheel in leaked footage. Only a few songs known so far.",
    kinds: ["leaked"],
    compact: true,
  },
]
