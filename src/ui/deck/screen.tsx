"use client"

import { useState } from "react"
import { Badge } from "../art/badge"
import { IconButton } from "../base/button"
import { cx } from "../base/cx"
import { Dial, Shrink } from "../base/icons"
import { useStation, useTuner } from "../radio/hooks"
import { player } from "../radio/wire"

export function Screen() {
  const [pick, setPick] = useState<boolean>()
  const { on } = useTuner()
  const station = useStation()
  const big = pick ?? on

  return (
    <div
      className={cx(
        "fixed left-3 z-50 overflow-hidden bg-black shadow-2xl shadow-black/60 ring-1 ring-white/15 transition-all duration-500 ease-out sm:left-4",
        big ? "bottom-24 w-[min(356px,calc(100vw-24px))] rounded-2xl" : "bottom-3 w-14 rounded-xl",
      )}
    >
      <div
        className={cx(
          "flex items-center justify-between gap-2 bg-ink/95 pl-3 text-xs text-white/70",
          big ? "h-9" : "hidden",
        )}
      >
        <span className="truncate">{station ? `${station.name} on YouTube` : "YouTube"}</span>
        <IconButton label="Minimize player" size="sm" onClick={() => setPick(false)}>
          <Shrink className="size-3.5" />
        </IconButton>
      </div>
      <div className={cx("relative overflow-hidden", big ? "h-[200px]" : "h-14")}>
        <div
          ref={(el) => {
            if (el) player?.mount(el)
          }}
          className={cx(
            "absolute top-1/2 left-1/2 aspect-video h-full -translate-x-1/2 -translate-y-1/2",
            !big && "pointer-events-none",
          )}
        />
        {!on && (
          <div className="absolute inset-0 grid place-items-center bg-night text-white/60">
            {station ? (
              <Badge station={station} className={cx("rounded-none text-xl", big ? "size-24 rounded-2xl" : "size-full")} />
            ) : (
              <Dial className="size-6" />
            )}
          </div>
        )}
        {!big && (
          <button
            type="button"
            onClick={() => setPick(true)}
            aria-label="Show player"
            title="Show player"
            className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-(--tint)"
          />
        )}
      </div>
    </div>
  )
}
