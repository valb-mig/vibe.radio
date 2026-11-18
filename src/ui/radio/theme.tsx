"use client"

import { useEffect } from "react"
import { useStation } from "./hooks"

export function Theme() {
  const s = useStation()
  useEffect(() => {
    if (s) document.documentElement.style.setProperty("--tint", s.tint)
  }, [s])
  return null
}
