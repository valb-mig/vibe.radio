"use client"

import type { CSSProperties } from "react"
import { at } from "@/core/clock"
import type { Station } from "@/core/station"
import { Bars } from "../base/bars"
import { cx } from "../base/cx"
import { clock } from "../base/time"
import { useNow } from "../radio/hooks"

export function Tracklist({ station }: { station: Station }) {
  const now = useNow()
  const slot = now ? at(station, now) : undefined
  const total = station.tracks.reduce((n, t) => n + (t.secs ?? 0), 0)
  const left = slot ? (slot.end - now) / 1000 : 0

  return (
    <section className="py-10" style={{ "--c": station.tint } as CSSProperties}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-3xl tracking-wide uppercase">Tracklist</h2>
        <p className="text-sm text-haze">
          {station.tracks.length} songs · {clock(total)} loop
          {slot && (
            <>
              {" "}
              · next song in <span className="font-mono text-white tabular-nums">{clock(left)}</span>
            </>
          )}
        </p>
      </div>
      <ol className="divide-y divide-white/5 overflow-hidden rounded-2xl bg-night/60 ring-1 ring-white/10 backdrop-blur-sm">
        {station.tracks.map((t, i) => {
          const live = slot?.track.id === t.id
          return (
            <li
              key={t.id}
              className={cx(
                "grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[2.5rem_1.2fr_1fr_3.5rem_3.5rem]",
                live && "bg-(--c)/10",
                !t.video && "opacity-50",
              )}
            >
              <span className="font-mono text-xs text-haze">
                {live ? <Bars className="text-(--c)" /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className={cx("block truncate font-medium", live && "text-(--c)")}>{t.title}</span>
                <span className="block truncate text-sm text-haze sm:hidden">{t.artist}</span>
              </span>
              <span className="hidden truncate text-sm text-haze sm:block">{t.artist}</span>
              <span className="hidden font-mono text-xs text-haze sm:block">{t.year ?? ""}</span>
              <span className="text-right font-mono text-xs text-haze tabular-nums">
                {t.secs ? clock(t.secs) : "off air"}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
