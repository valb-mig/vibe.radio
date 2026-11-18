import type { Fx } from "@/core/ports"

const noise = (ctx: AudioContext) => {
  const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (Math.random() < 0.02 ? 1 : 0.55)
  return buf
}

export class Static implements Fx {
  #ctx?: AudioContext
  #buf?: AudioBuffer

  tune(level: number) {
    if (!level || typeof AudioContext === "undefined") return
    const ctx = (this.#ctx ??= new AudioContext())
    if (ctx.state === "suspended") void ctx.resume()
    const src = ctx.createBufferSource()
    src.buffer = this.#buf ??= noise(ctx)
    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.Q.value = 0.8
    const gain = ctx.createGain()
    const t = ctx.currentTime
    band.frequency.setValueAtTime(500, t)
    band.frequency.exponentialRampToValueAtTime(3400, t + 0.45)
    gain.gain.setValueAtTime(0.22 * (level / 100), t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85)
    src.connect(band).connect(gain).connect(ctx.destination)
    src.start(t)
    src.stop(t + 0.9)
  }
}
