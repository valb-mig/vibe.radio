import type { CSSProperties } from "react"
import type { Station } from "@/core/station"
import { cx } from "../base/cx"

export function Poster({ station, className }: { station: Station; className?: string }) {
  return (
    <div
      className={cx("absolute inset-0 overflow-hidden bg-night", className)}
      style={{ "--c": station.tint } as CSSProperties}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_10%,var(--c),transparent_60%)] opacity-70" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_14px,rgb(255_255_255/0.05)_14px_16px)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/90 to-transparent" />
      <span className="absolute -right-2 -bottom-3 font-display text-[clamp(3rem,9vw,6rem)] leading-none text-white/10 uppercase">
        {station.genre ?? "FM"}
      </span>
      <span className="absolute top-1/2 left-5 -translate-y-1/2 pr-5 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[0.9] text-white uppercase drop-shadow-[0_2px_18px_var(--c)]">
        {station.name}
      </span>
    </div>
  )
}
