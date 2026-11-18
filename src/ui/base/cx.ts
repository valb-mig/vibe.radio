import { twMerge } from "tailwind-merge"

export const cx = (...a: (string | false | null | undefined)[]) => twMerge(a.filter(Boolean).join(" "))
