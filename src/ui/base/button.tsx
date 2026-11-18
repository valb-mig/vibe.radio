import Link from "next/link"
import type { ComponentProps } from "react"
import { cx } from "./cx"
import { look, type Look } from "./look"

export function Button({ tone, size, round, className, ...rest }: ComponentProps<"button"> & Look) {
  return <button type="button" className={cx(look({ tone, size, round }), className)} {...rest} />
}

export function ButtonLink({ tone, size, round, className, ...rest }: ComponentProps<typeof Link> & Look) {
  return <Link className={cx(look({ tone, size, round }), className)} {...rest} />
}

export function IconButton({ label, ...rest }: Omit<ComponentProps<typeof Button>, "round"> & { label: string }) {
  return <Button round aria-label={label} title={label} {...rest} />
}
