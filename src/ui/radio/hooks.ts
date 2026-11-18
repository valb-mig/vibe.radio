"use client"

import { useSyncExternalStore } from "react"
import type { State } from "@/core/radio"
import { catalog } from "@/infra/catalog"
import { radio } from "./wire"

const idle: State = { on: false, level: 80, muted: false }
const none = () => () => {}
const still = () => idle

export const useTuner = () => useSyncExternalStore(radio?.subscribe ?? none, radio?.snap ?? still, still)

export const useStation = () => {
  const { slug } = useTuner()
  return slug ? catalog.get(slug) : undefined
}

let now = 0
let timer: ReturnType<typeof setInterval> | undefined
const ticks = new Set<() => void>()

const tick = (fn: () => void) => {
  ticks.add(fn)
  if (!timer) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      for (const f of ticks) f()
    }, 1000)
  }
  return () => {
    ticks.delete(fn)
    if (!ticks.size) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

export const useNow = () =>
  useSyncExternalStore(
    tick,
    () => now,
    () => 0,
  )
