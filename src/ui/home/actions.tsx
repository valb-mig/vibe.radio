"use client"

import { catalog } from "@/infra/catalog"
import { Button } from "../base/button"
import { Dial, Shuffle } from "../base/icons"
import { radio } from "../radio/wire"
import { wheel } from "../wheel/store"

export function Actions() {
  const random = () => {
    const list = catalog.all()
    const pool = list.filter((s) => s.slug !== radio?.state.slug)
    radio?.tune(pool[Math.floor(Math.random() * pool.length)].slug)
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button tone="solid" size="lg" onClick={() => wheel.show()}>
        <Dial />
        Open the wheel
      </Button>
      <Button tone="glass" size="lg" onClick={random}>
        <Shuffle />
        Surprise me
      </Button>
    </div>
  )
}
