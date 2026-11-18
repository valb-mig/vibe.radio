import { catalog } from "@/infra/catalog"
import { Grid } from "@/ui/card/grid"
import { Hero } from "@/ui/home/hero"
import { groups } from "@/ui/station/kinds"

export default function Home() {
  const all = catalog.all()
  const songs = new Set(all.flatMap((s) => s.tracks.map((t) => t.id))).size

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      <Hero stations={all.length} songs={songs} />
      {groups.map((g) => (
        <Grid
          key={g.title}
          title={g.title}
          note={g.note}
          compact={g.compact}
          stations={all.filter((s) => g.kinds.includes(s.kind))}
        />
      ))}
    </main>
  )
}
