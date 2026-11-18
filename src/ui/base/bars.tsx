import { cx } from "./cx"

export function Bars({ live = true, className }: { live?: boolean; className?: string }) {
  return (
    <span className={cx("inline-flex h-3 items-end gap-[2px]", className)} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cx("w-[3px] rounded-full bg-current", live ? "animate-eq" : "h-1")}
          style={{ animationDelay: `${i * -0.23}s` }}
        />
      ))}
    </span>
  )
}
