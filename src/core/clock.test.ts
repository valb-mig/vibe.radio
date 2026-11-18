import { test } from "node:test"
import assert from "node:assert/strict"
import { at, next, rotation } from "./clock.ts"
import type { Station } from "./station.ts"

const station: Station = {
  slug: "flash-fm",
  name: "Flash FM",
  kind: "official",
  tint: "#f0a",
  hosts: [],
  art: {},
  source: "",
  tracks: [
    { id: "a", title: "A", artist: "X", video: "va", secs: 200 },
    { id: "b", title: "B", artist: "X", video: "vb", secs: 150 },
    { id: "c", title: "C", artist: "X", video: "vc", secs: 240 },
    { id: "d", title: "D", artist: "X" },
  ],
}

const now = Date.UTC(2026, 10, 19, 12)

test("slot contains now", () => {
  const s = at(station, now)!
  assert.ok(s.start <= now && now < s.end)
  assert.equal(s.end - s.start, s.track.secs! * 1000)
})

test("same moment, same slot", () => {
  assert.deepEqual(at(station, now), at(station, now))
})

test("slots are contiguous", () => {
  let s = at(station, now)!
  for (let i = 0; i < 20; i++) {
    const n = at(station, s.end)!
    assert.equal(n.start, s.end)
    s = n
  }
})

test("unplayable tracks stay out", () => {
  assert.deepEqual(rotation(station).map((t) => t.id), ["a", "b", "c"])
  for (let t = now; t < now + 3_600_000; t += 30_000) assert.notEqual(at(station, t)!.track.id, "d")
})

test("next jumps when track is ending", () => {
  const s = at(station, now)!
  assert.equal(next(station, s.end - 1000)!.start, s.end)
  assert.equal(next(station, s.start + 1000)!.start, s.start)
})

test("skip removes track", () => {
  const skip = new Set(["a", "b"])
  for (let t = now; t < now + 3_600_000; t += 60_000) assert.equal(at(station, t, skip)!.track.id, "c")
})

test("empty station has no slot", () => {
  assert.equal(at({ ...station, tracks: [] }, now), undefined)
})
