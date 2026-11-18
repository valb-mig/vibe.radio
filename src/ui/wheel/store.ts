"use client"

import { useSyncExternalStore } from "react"

type Wheel = {
  open: boolean
  held: boolean
  hover?: number
  since: number
}

let state: Wheel = { open: false, held: false, since: 0 }
const subs = new Set<() => void>()

const set = (patch: Partial<Wheel>) => {
  state = { ...state, ...patch }
  for (const fn of subs) fn()
}

export const wheel = {
  show: (held = false) => set({ open: true, held, hover: undefined, since: Date.now() }),
  keep: () => set({ held: false }),
  hide: () => set({ open: false, held: false, hover: undefined }),
  toggle: () => (state.open ? wheel.hide() : wheel.show()),
  hover: (hover?: number) => hover !== state.hover && set({ hover }),
  get: () => state,
  sub: (fn: () => void) => {
    subs.add(fn)
    return () => {
      subs.delete(fn)
    }
  },
}

export const useWheel = () => useSyncExternalStore(wheel.sub, wheel.get, wheel.get)
