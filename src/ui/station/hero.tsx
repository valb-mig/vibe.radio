import type { CSSProperties } from "react"
import type { Station } from "@/core/station"
import { Cover } from "../art/cover"
import { ButtonLink } from "../base/button"
import { Back, Out } from "../base/icons"
import { tags } from "./kinds"
import { Tune } from "./tune"

export function Hero({ station }: { station: Station }) {
  const meta = [station.genre, station.freq, station.hosts.length ? `with ${station.hosts.join(" & ")}` : undefined]
    .filter(Boolean)
    .join(" · ")

  return (
    <section className="pt-6 sm:pt-10" style={{ "--c": station.tint, "--tint": station.tint } as CSSProperties}>
      <ButtonLink href="/" size="sm" className="mb-4 -ml-3">
        <Back className="size-4" />
        All stations
      </ButtonLink>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-white/10 sm:aspect-[21/9]">
        <Cover station={station} sizes="(min-width: 1280px) 1280px, 100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-(--c) px-2.5 py-1 text-[11px] font-semibold tracking-wider text-ink uppercase">
              {tags[station.kind]}
            </span>
            <h1 className="mt-3 font-display text-5xl leading-none uppercase sm:text-7xl">{station.name}</h1>
            {meta && <p className="mt-2 text-white/75">{meta}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Tune station={station} />
            <ButtonLink href={station.source} target="_blank" rel="noreferrer" tone="glass" size="lg">
              gta.wiki
              <Out className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
      {station.blurb && <p className="mt-6 max-w-3xl text-lg text-white/75">{station.blurb}</p>}
    </section>
  )
}
