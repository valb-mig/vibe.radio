"use client"

import { useEffect } from "react"
import { catalog } from "@/infra/catalog"
import { radio } from "../radio/wire"
import { wheel } from "../wheel/store"

const quick = 250

const typing = (e: KeyboardEvent) => {
  const el = e.target as HTMLElement | null
  return Boolean(el?.isContentEditable || (el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)))
}

export function Keys() {
  useEffect(() => {
    const list = catalog.all()
    const tune = (i: number) => {
      radio?.tune(list[i].slug)
      wheel.hide()
    }

    const down = (e: KeyboardEvent) => {
      if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return
      const w = wheel.get()
      if (e.code === "KeyQ") {
        if (!e.repeat && !w.open) wheel.show(true)
        return
      }
      if (w.open) {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
        if (step) {
          e.preventDefault()
          wheel.hover(((w.hover ?? (step > 0 ? -1 : 0)) + step + list.length) % list.length)
        }
        if (e.key === "Enter" && w.hover !== undefined) {
          e.preventDefault()
          tune(w.hover)
        }
        if (e.key === "Escape") wheel.hide()
        return
      }
      if (e.key === "ArrowRight") radio?.step(1)
      if (e.key === "ArrowLeft") radio?.step(-1)
      if (e.key.toLowerCase() === "m") radio?.mute()
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        radio?.toggle()
      }
    }

    const up = (e: KeyboardEvent) => {
      if (e.code !== "KeyQ") return
      const w = wheel.get()
      if (!w.open || !w.held) return
      if (Date.now() - w.since < quick) return wheel.keep()
      if (w.hover !== undefined) tune(w.hover)
      else wheel.hide()
    }

    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  return null
}
