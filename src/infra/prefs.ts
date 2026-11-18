const key = "vibe.radio"

export type Prefs = {
  slug?: string
  level?: number
}

export const read = (): Prefs => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}")
  } catch {
    return {}
  }
}

export const write = (p: Prefs) => {
  try {
    localStorage.setItem(key, JSON.stringify(p))
  } catch {}
}
