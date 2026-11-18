"use client"

import { Bars } from "../base/bars"
import { Button, IconButton } from "../base/button"
import { Dial, Mute, Next, Power, Prev, Volume } from "../base/icons"
import { clock } from "../base/time"
import { useNow, useStation, useTuner } from "../radio/hooks"
import { radio } from "../radio/wire"
import { wheel } from "../wheel/store"

export function Deck() {
  const t = useTuner()
  const station = useStation()
  const now = useNow()
  const slot = t.on ? t.slot : undefined
  const span = slot ? slot.end - slot.start : 0
  const pos = slot && now ? Math.min(1, Math.max(0, (now - slot.start) / span)) : 0

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-20 border-t border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5">
        <div
          className="h-full bg-(--tint) shadow-[0_0_14px_var(--tint)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${pos * 100}%` }}
        />
      </div>
      <div className="mx-auto flex h-full max-w-7xl items-center gap-2 pr-3 pl-[80px] sm:gap-5 sm:pr-6 sm:pl-[92px]">
        <div className="min-w-0 flex-1">
          {slot && station ? (
            <>
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-(--tint) uppercase">
                <Bars />
                <span className="truncate">{station.name}</span>
              </p>
              <p className="truncate font-medium">{slot.track.title}</p>
              <p className="truncate text-sm text-haze">{slot.track.artist}</p>
            </>
          ) : station && t.fault ? (
            <>
              <p className="truncate font-medium">YouTube blocked {station.name}</p>
              <p className="truncate text-sm text-haze">
                Sign in at{" "}
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-(--tint) underline underline-offset-2"
                >
                  youtube.com
                </a>{" "}
                in this browser, then tune again.
              </p>
            </>
          ) : station ? (
            <Button tone="ghost" size="sm" className="-ml-3 max-w-full" onClick={() => radio?.tune(station.slug)}>
              <span className="truncate">
                Resume <span className="text-(--tint)">{station.name}</span>
              </span>
            </Button>
          ) : (
            <>
              <p className="font-medium">Pick a station</p>
              <p className="truncate text-sm text-haze">Tap a card or hold Q for the wheel</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <IconButton label="Previous station" className="hidden sm:inline-flex" onClick={() => radio?.step(-1)}>
            <Prev />
          </IconButton>
          <IconButton
            label={t.on ? "Turn radio off" : "Turn radio on"}
            tone={t.on ? "solid" : "glass"}
            size="lg"
            onClick={() => radio?.toggle()}
          >
            <Power />
          </IconButton>
          <IconButton label="Next station" className="hidden sm:inline-flex" onClick={() => radio?.step(1)}>
            <Next />
          </IconButton>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {slot && now > 0 && (
            <span className="hidden font-mono text-xs text-haze tabular-nums md:block">
              {clock((now - slot.start) / 1000)} / {clock(span / 1000)}
            </span>
          )}
          <div className="hidden items-center lg:flex">
            <IconButton label={t.muted ? "Unmute" : "Mute"} onClick={() => radio?.mute()}>
              {t.muted || !t.level ? <Mute /> : <Volume />}
            </IconButton>
            <input
              type="range"
              min={0}
              max={100}
              value={t.muted ? 0 : t.level}
              onChange={(e) => radio?.level(Number(e.target.value))}
              aria-label="Volume"
              className="w-24"
            />
          </div>
          <IconButton label="Radio wheel (Q)" tone="glass" onClick={() => wheel.toggle()}>
            <Dial />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
