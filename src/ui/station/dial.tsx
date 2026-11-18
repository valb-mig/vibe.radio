import Link from "next/link"
import type { Station } from "@/core/station"
import { Badge } from "../art/badge"
import { cx } from "../base/cx"

function Side({ station, dir }: { station: Station; dir: "prev" | "next" }) {
  return (
    <Link
      href={`/${station.slug}`}
      className={cx(
        "flex min-w-0 items-center gap-3 rounded-2xl bg-night/60 p-3 ring-1 ring-white/10 transition hover:ring-white/25",
        dir === "next" && "flex-row-reverse text-right",
      )}
    >
      <Badge station={station} className="size-12 text-base" />
      <span className="min-w-0">
        <span className="block text-[11px] tracking-widest text-haze uppercase">{dir === "prev" ? "Previous" : "Next"}</span>
        <span className="block truncate font-display text-lg uppercase">{station.name}</span>
      </span>
    </Link>
  )
}

export function Dial({ prev, next }: { prev: Station; next: Station }) {
  return (
    <nav className="grid grid-cols-2 gap-3 pb-6">
      <Side station={prev} dir="prev" />
      <Side station={next} dir="next" />
    </nav>
  )
}
