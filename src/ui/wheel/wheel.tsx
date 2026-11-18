"use client"

import { useRef, type CSSProperties, type PointerEvent } from "react"
import { at } from "@/core/clock"
import { catalog } from "@/infra/catalog"
import { initials } from "../art/initials"
import { Bars } from "../base/bars"
import { cx } from "../base/cx"
import { useNow, useTuner } from "../radio/hooks"
import { radio } from "../radio/wire"
import { useWheel, wheel } from "./store"

const R = 100
const r = 44
const mid = (R + r) / 2
const dot = 12.5

const polar = (deg: number, rad: number) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [rad * Math.cos(a), rad * Math.sin(a)] as const
}

const wedge = (a: number, b: number) => {
  const [x0, y0] = polar(a, R)
  const [x1, y1] = polar(b, R)
  const [x2, y2] = polar(b, r)
  const [x3, y3] = polar(a, r)
  return `M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 0 0 ${x3} ${y3}Z`
}

export function Wheel() {
  const w = useWheel()
  const t = useTuner()
  const now = useNow()
  const box = useRef<HTMLDivElement>(null)
  const list = catalog.all()
  const seg = 360 / list.length

  if (!w.open) return null

  const focus = w.hover !== undefined ? list[w.hover] : t.slug ? catalog.get(t.slug) : undefined
  const slot = focus && now ? at(focus, now) : undefined

  const aim = (e: PointerEvent) => {
    const b = box.current?.getBoundingClientRect()
    if (!b) return
    const dx = e.clientX - (b.left + b.width / 2)
    const dy = e.clientY - (b.top + b.height / 2)
    const d = (Math.hypot(dx, dy) / (b.width / 2)) * R
    if (d < r) return wheel.hover(undefined)
    const deg = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360
    wheel.hover(Math.floor(((deg + seg / 2) % 360) / seg))
  }

  const pick = (i: number) => {
    radio?.tune(list[i].slug)
    wheel.hide()
  }

  return (
    <div
      role="dialog"
      aria-label="Radio wheel"
      onPointerMove={aim}
      onClick={(e) => e.target === e.currentTarget && wheel.hide()}
      className="fixed inset-0 z-[60] flex animate-fade flex-col items-center justify-center gap-6 bg-ink/75 backdrop-blur-md"
    >
      <div ref={box} className="relative aspect-square w-[min(90vw,72vh,640px)] animate-pop">
        <svg viewBox="-104 -104 208 208" className="size-full overflow-visible">
          <defs>
            <clipPath id="dot" clipPathUnits="objectBoundingBox">
              <circle cx=".5" cy=".5" r=".5" />
            </clipPath>
          </defs>
          {list.map((s, i) => {
            const a = i * seg - seg / 2
            const on = i === w.hover
            const live = t.on && t.slug === s.slug
            const [x, y] = polar(i * seg, mid)
            return (
              <g
                key={s.slug}
                onClick={() => pick(i)}
                onPointerEnter={() => wheel.hover(i)}
                className="cursor-pointer"
                style={{ "--c": s.tint } as CSSProperties}
              >
                <path
                  d={wedge(a + 0.7, a + seg - 0.7)}
                  strokeWidth={on ? 0.9 : 0.4}
                  className={cx("transition-colors", on ? "fill-(--c)/30 stroke-(--c)" : "fill-ink/80 stroke-white/12")}
                />
                {s.art.icon ? (
                  <image
                    href={s.art.icon}
                    x={x - dot}
                    y={y - dot}
                    width={dot * 2}
                    height={dot * 2}
                    clipPath="url(#dot)"
                    className={cx("transition-opacity", on || live ? "opacity-100" : "opacity-60")}
                  />
                ) : (
                  <>
                    <circle cx={x} cy={y} r={dot} strokeWidth={0.6} className="fill-(--c)/25 stroke-(--c)/80" />
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={7}
                      className="fill-white font-display"
                    >
                      {initials(s.name)}
                    </text>
                  </>
                )}
                {live && <circle cx={x} cy={y} r={dot + 2.5} strokeWidth={1.1} className="fill-none stroke-(--c)" />}
              </g>
            )
          })}
        </svg>
        <button
          type="button"
          onClick={() => {
            radio?.toggle()
            wheel.hide()
          }}
          style={focus ? ({ "--c": focus.tint } as CSSProperties) : undefined}
          className="absolute inset-[23%] flex cursor-pointer flex-col items-center justify-center gap-1 rounded-full px-6 text-center"
        >
          {focus ? (
            <>
              <span className="text-[11px] font-semibold tracking-widest text-(--c) uppercase">
                {focus.genre ?? "Radio"}
              </span>
              <span className="font-display text-[clamp(1.4rem,4vw,2.4rem)] leading-none uppercase">{focus.name}</span>
              {slot && (
                <span className="mt-1 line-clamp-2 text-xs text-white/70">
                  {slot.track.title} · {slot.track.artist}
                </span>
              )}
              {t.on && t.slug === focus.slug && (
                <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-(--c) uppercase">
                  <Bars /> On air
                </span>
              )}
            </>
          ) : (
            <span className="font-display text-3xl uppercase">{t.on ? "Radio off" : "Radio"}</span>
          )}
        </button>
      </div>
      <p className="px-6 text-center text-xs text-haze">
        Point and click, or release <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Q</kbd> to tune · center
        toggles power · <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">Esc</kbd> closes
      </p>
    </div>
  )
}
