export function Skeleton() {
  return (
    <div className="animate-pulse pt-6 sm:pt-10" aria-hidden>
      <div className="mb-4 h-8 w-32 rounded-lg bg-white/5" />
      <div className="aspect-[4/5] rounded-3xl bg-white/5 ring-1 ring-white/10 sm:aspect-[21/9]" />
      <div className="mt-6 h-6 max-w-2xl rounded-lg bg-white/5" />
      <div className="mt-10 h-64 rounded-2xl bg-white/5" />
    </div>
  )
}
