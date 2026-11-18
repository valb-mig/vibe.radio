"use client"

import Image from "next/image"
import { useStation } from "../radio/hooks"

export function Backdrop() {
  const s = useStation()
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_10%_0%,rgb(255_62_165/0.22),transparent),radial-gradient(60%_50%_at_100%_5%,rgb(255_138_61/0.16),transparent),radial-gradient(90%_60%_at_50%_100%,rgb(91_33_182/0.25),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,color-mix(in_oklab,var(--tint)_22%,transparent),transparent)] transition-colors duration-700" />
      {s?.art.promo && (
        <Image
          key={s.slug}
          src={s.art.promo}
          alt=""
          fill
          sizes="50vw"
          className="scale-125 animate-fade object-cover opacity-25 blur-3xl saturate-150"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/60 to-ink" />
    </div>
  )
}
