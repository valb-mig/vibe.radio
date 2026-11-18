import Link from "next/link"
import { Trigger } from "../wheel/trigger"

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-2xl tracking-wide" aria-label="vibe.radio home">
          <span className="bg-gradient-to-r from-glow to-sun bg-clip-text text-transparent">vibe</span>
          <span className="text-white">.radio</span>
        </Link>
        <Trigger />
      </div>
    </header>
  )
}
