import Image from "next/image"
import type { Station } from "@/core/station"
import { Poster } from "./poster"

export function Cover({ station, sizes, priority }: { station: Station; sizes: string; priority?: boolean }) {
  if (!station.art.promo) return <Poster station={station} />
  return (
    <Image
      src={station.art.promo}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition duration-700 group-hover:scale-[1.03]"
    />
  )
}
