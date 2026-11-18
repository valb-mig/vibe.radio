export const initials = (name: string) => {
  const words = name
    .replace(/\b(the|fm|radio)\b/gi, "")
    .split(/[\s-]+/)
    .filter((w) => /^[a-z]/i.test(w))
  const out = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? name).slice(0, 2)
  return out.toUpperCase()
}
