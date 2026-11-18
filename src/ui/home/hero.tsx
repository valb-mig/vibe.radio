import { Bars } from "../base/bars"
import { Actions } from "./actions"

export function Hero({ stations, songs }: { stations: number; songs: number }) {
  return (
    <section className="pt-12 pb-8 sm:pt-24 sm:pb-14">
      <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/80 ring-1 ring-white/10">
        <Bars className="text-glow" />
        {stations} stations · {songs} songs · broadcasting from Leonida
      </p>
      <h1 className="font-display text-[clamp(3.6rem,12vw,9.5rem)] leading-[0.85] uppercase">
        Leonida is
        <br />
        <span className="bg-gradient-to-r from-glow via-[#ff6363] to-sun bg-clip-text text-transparent">on air.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-white/70">
        The radio of Grand Theft Auto VI, always playing. Tune in and you land mid-song, at the same moment as everyone
        else, like you just jumped into a car.
      </p>
      <Actions />
    </section>
  )
}
