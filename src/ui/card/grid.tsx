import type { Station } from "@/core/station"
import { cx } from "../base/cx"
import { Card } from "./card"

type Props = {
  title: string
  note: string
  stations: Station[]
  compact?: boolean
}

export function Grid({ title, note, stations, compact }: Props) {
  if (!stations.length) return null
  return (
    <section className="py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-3xl tracking-wide uppercase sm:text-4xl">{title}</h2>
        <p className="max-w-md text-sm text-haze">{note}</p>
      </div>
      <div className={cx("grid gap-4", compact ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3")}>
        {stations.map((s) => (
          <Card key={s.slug} station={s} compact={compact} />
        ))}
      </div>
    </section>
  )
}
