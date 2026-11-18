import Image from "next/image"
import type { CSSProperties } from "react"
import type { Station } from "@/core/station"
import { cx } from "../base/cx"
import { initials } from "./initials"

export function Badge({ station, className }: { station: Station; className?: string }) {
  return (
    <span
      className={cx("relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-night", className)}
      style={{ "--c": station.tint } as CSSProperties}
    >
      {station.art.icon ? (
        <Image src={station.art.icon} alt="" fill sizes="96px" className="object-cover" />
      ) : (
        <>
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--c),transparent_75%)] opacity-80" />
          <span className="relative font-display text-[0.9em] text-white">{initials(station.name)}</span>
        </>
      )}
    </span>
  )
}
