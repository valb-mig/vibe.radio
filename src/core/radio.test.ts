import { test } from "node:test"
import assert from "node:assert/strict"
import type { Catalog, Fx, Player, Signal } from "./ports.ts"
import { Radio } from "./radio.ts"
import type { Station } from "./station.ts"

class Fake implements Player {
  loads: [string, number][] = []
  stops = 0
  level = 0
  subs = new Map<Signal, () => void>()
  load(video: string, from: number) {
    this.loads.push([video, from])
  }
  stop() {
    this.stops++
  }
  seek() {}
  time() {
    return 0
  }
  volume(level: number) {
    this.level = level
  }
  on(signal: Signal, fn: () => void) {
    this.subs.set(signal, fn)
  }
  emit(signal: Signal) {
    this.subs.get(signal)?.()
  }
}

const station = (slug: string, tracks: Station["tracks"]): Station => ({
  slug,
  name: slug,
  kind: "official",
  tint: "#fff",
  hosts: [],
  art: {},
  source: "",
  tracks,
})

const a = station("a", [
  { id: "a1", title: "1", artist: "x", video: "v1", alts: ["v1b"], secs: 300 },
  { id: "a2", title: "2", artist: "x", video: "v2", secs: 300 },
])
const b = station("b", [{ id: "b1", title: "1", artist: "x", video: "w1", secs: 200 }])

const catalog: Catalog = {
  all: () => [a, b],
  get: (slug) => [a, b].find((s) => s.slug === slug),
}

const fx: Fx = { tune() {} }
const now = () => Date.UTC(2026, 10, 19, 12)

const setup = () => {
  const p = new Fake()
  return { p, r: new Radio(catalog, p, fx, {}, now) }
}

test("tune loads current track at live offset", () => {
  const { p, r } = setup()
  r.tune("a")
  assert.equal(r.state.on, true)
  assert.equal(p.loads.length, 1)
  assert.equal(p.loads[0][0], r.state.video)
  assert.ok(p.loads[0][1] >= 0 && p.loads[0][1] < 300)
})

test("embed error falls back to alternate video, then to another track", () => {
  const { p, r } = setup()
  r.tune("a")
  const first = r.state.slot!.track.id
  p.emit("error")
  if (first === "a1") {
    assert.equal(r.state.video, "v1b")
    assert.equal(r.state.slot!.track.id, "a1")
    p.emit("error")
  }
  assert.equal(r.state.on, true)
  assert.notEqual(r.state.slot!.track.id, first)
})

test("station with every video blocked reports a fault", () => {
  const { p, r } = setup()
  r.tune("b")
  p.emit("error")
  assert.equal(r.state.on, false)
  assert.equal(r.state.fault, "blocked")
})

test("toggle and step move through the dial", () => {
  const { p, r } = setup()
  r.toggle()
  assert.equal(r.state.slug, "a")
  r.step(1)
  assert.equal(r.state.slug, "b")
  r.step(1)
  assert.equal(r.state.slug, "a")
  r.toggle()
  assert.equal(r.state.on, false)
  assert.ok(p.stops > 0)
})

test("mute keeps level", () => {
  const { p, r } = setup()
  r.level(40)
  r.mute()
  assert.equal(p.level, 0)
  r.mute()
  assert.equal(p.level, 40)
})
