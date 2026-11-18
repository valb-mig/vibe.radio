"use client"

import { Button } from "../base/button"
import { Dial } from "../base/icons"
import { wheel } from "./store"

export function Trigger() {
  return (
    <Button tone="glass" size="sm" onClick={() => wheel.toggle()}>
      <Dial className="size-4" />
      Wheel
      <kbd className="hidden rounded bg-white/10 px-1.5 font-mono text-[10px] sm:inline">Q</kbd>
    </Button>
  )
}
