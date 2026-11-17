/**
 * Join class names, skipping falsy values.
 * Lightweight alternative to clsx.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
