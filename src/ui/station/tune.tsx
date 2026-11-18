"use client"

import type { Station } from "@/core/station"
import { Bars } from "../base/bars"
import { Button } from "../base/button"
import { Power } from "../base/icons"
import { useTuner } from "../radio/hooks"
import { radio } from "../radio/wire"

export function Tune({ station }: { station: Station }) {
  const t = useTuner()
  const live = t.on && t.slug === station.slug
  return (
    <Button
      tone={live ? "glass" : "solid"}
      size="lg"
      onClick={() => (live ? radio?.toggle() : radio?.tune(station.slug))}
    >
      {live ? <Bars /> : <Power />}
      {live ? "On air · turn off" : "Tune in"}
    </Button>
  )
}
