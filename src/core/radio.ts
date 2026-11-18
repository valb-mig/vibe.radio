import type { Catalog, Fx, Player } from "./ports.ts"
import { at, next, offset, type Slot } from "./clock.ts"
import { step } from "./dial.ts"
import { sources } from "./track.ts"

export type State = {
  slug?: string
  slot?: Slot
  video?: string
  on: boolean
  level: number
  muted: boolean
  fault?: "blocked"
}

const drift = 2

export class Radio {
  #catalog: Catalog
  #player: Player
  #fx: Fx
  #now: () => number
  #state: State
  #subs = new Set<() => void>()
  #bad = new Set<string>()
  #dead = new Set<string>()

  constructor(catalog: Catalog, player: Player, fx: Fx, init: Partial<State> = {}, now = () => Date.now()) {
    this.#catalog = catalog
    this.#player = player
    this.#fx = fx
    this.#now = now
    this.#state = { level: 80, muted: false, ...init, on: false, slot: undefined, video: undefined, fault: undefined }
    player.on("end", () => this.#advance())
    player.on("error", () => this.#skip())
    player.on("play", () => this.#sync())
    this.#apply()
  }

  get state() {
    return this.#state
  }

  get station() {
    return this.#state.slug ? this.#catalog.get(this.#state.slug) : undefined
  }

  subscribe = (fn: () => void) => {
    this.#subs.add(fn)
    return () => {
      this.#subs.delete(fn)
    }
  }

  snap = () => this.#state

  tune(slug: string) {
    const s = this.#catalog.get(slug)
    if (!s) return
    this.#dead.clear()
    this.#bad.clear()
    this.#fx.tune(this.#state.muted ? 0 : this.#state.level)
    this.#play(slug, at(s, this.#now(), this.#bad))
  }

  toggle() {
    if (this.#state.on) {
      this.#player.stop()
      this.#set({ on: false })
      return
    }
    const slug = this.#state.slug ?? this.#catalog.all()[0]?.slug
    if (slug) this.tune(slug)
  }

  step(dir: 1 | -1) {
    const s = step(this.#catalog.all(), this.#state.slug, dir)
    if (s) this.tune(s.slug)
  }

  level(v: number) {
    this.#set({ level: Math.round(Math.min(100, Math.max(0, v))), muted: false })
    this.#apply()
  }

  mute() {
    this.#set({ muted: !this.#state.muted })
    this.#apply()
  }

  #play(slug: string, slot: Slot | undefined): void {
    const video = slot && this.#source(slot)
    if (slot && !video) {
      this.#bad.add(slot.track.id)
      this.#play(slug, at(this.#catalog.get(slug)!, this.#now(), this.#bad))
      return
    }
    const blocked = !slot && this.#bad.size > 0
    this.#set({ slug, slot, video, on: Boolean(slot), fault: blocked ? "blocked" : undefined })
    if (slot && video) this.#player.load(video, offset(slot, this.#now()))
    else this.#player.stop()
  }

  #source(slot: Slot) {
    return sources(slot.track).find((v) => !this.#dead.has(v))
  }

  #advance() {
    const s = this.station
    if (!s || !this.#state.on) return
    this.#play(s.slug, next(s, this.#now(), this.#bad))
  }

  #skip() {
    const s = this.station
    const { slot, video, on } = this.#state
    if (!s || !slot || !video || !on) return
    this.#dead.add(video)
    this.#play(s.slug, at(s, this.#now(), this.#bad))
  }

  #sync() {
    const slot = this.#state.slot
    if (!slot || !this.#state.on) return
    const want = offset(slot, this.#now())
    if (want * 1000 >= slot.end - slot.start) return this.#advance()
    if (Math.abs(this.#player.time() - want) > drift) this.#player.seek(want)
  }

  #apply() {
    this.#player.volume(this.#state.muted ? 0 : this.#state.level)
  }

  #set(patch: Partial<State>) {
    this.#state = { ...this.#state, ...patch }
    for (const fn of this.#subs) fn()
  }
}
