const keys = [
  ["Q", "wheel"],
  ["← →", "stations"],
  ["Space", "power"],
  ["M", "mute"],
]

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 pt-16 pb-32 text-xs text-haze sm:px-6">
      <div className="flex flex-col gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl">
          vibe.radio is a fan project, not affiliated with Rockstar Games or Take-Two Interactive. Station data and
          artwork via{" "}
          <a href="https://gta.wiki" target="_blank" rel="noreferrer" className="underline hover:text-white">
            gta.wiki
          </a>
          . Music streams from YouTube.
        </p>
        <ul className="hidden flex-wrap gap-3 sm:flex">
          {keys.map(([k, v]) => (
            <li key={k}>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white/80">{k}</kbd> {v}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
