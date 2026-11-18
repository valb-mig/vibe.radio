"use client"

import Link from "next/link"
import type { CSSProperties } from "react"
import { at } from "@/core/clock"
import type { Station } from "@/core/station"
import { Cover } from "../art/cover"
import { Bars } from "../base/bars"
import { cx } from "../base/cx"
import { useNow, useTuner } from "../radio/hooks"
import { radio } from "../radio/wire"
import { tags } from "../station/kinds"

const wide = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
const small = "(min-width: 1024px) 25vw, 50vw"

export function Card({ station, compact }: { station: Station; compact?: boolean }) {
  const tuner = useTuner()
  const now = useNow()
  const live = tuner.on && tuner.slug === station.slug
  const slot = now ? at(station, now) : undefined
  const meta = [station.genre, station.hosts.join(" & ")].filter(Boolean).join(" · ")

  return (
    <article
      style={{ "--c": station.tint } as CSSProperties}
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-night/70 ring-1 ring-white/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:ring-(--c)/60",
        live && "ring-2 ring-(--c) shadow-[0_0_90px_-25px_var(--c)]",
      )}
    >
      <div className={cx("relative overflow-hidden", compact ? "aspect-[4/3]" : "aspect-video")}>
        <Cover station={station} sizes={compact ? small : wide} />
        <span
          className={cx(
            "absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md",
            live ? "bg-(--c) text-ink" : "bg-ink/60 text-white/85 ring-1 ring-white/15",
          )}
        >
          {live && <Bars />}
          {live ? "On air" : tags[station.kind]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate font-display text-xl tracking-wide uppercase">{station.name}</h3>
          {station.freq && <span className="font-mono text-xs text-(--c)">{station.freq}</span>}
        </div>
        {!compact && meta && <p className="truncate text-sm text-haze">{meta}</p>}
        <p className="mt-auto truncate pt-3 text-sm text-white/85">
          <span className="mr-1.5 text-[11px] font-semibold tracking-wider text-(--c) uppercase">Now</span>
          {slot ? `${slot.track.title} · ${slot.track.artist}` : "…"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => radio?.tune(station.slug)}
        aria-label={`Tune in to ${station.name}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c)"
      />
      <Link
        href={`/${station.slug}`}
        className="absolute top-3 right-3 z-20 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white/85 uppercase opacity-100 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-(--c) hover:text-ink sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        Tracklist
      </Link>
    </article>
  )
}
