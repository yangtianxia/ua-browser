/**
 * Extract the first capture group from `ua` using `pattern`.
 * Returns the matched string, or null if the pattern does not match.
 * Unlike String.replace(), this never returns the original input on no-match.
 */
export function extractVersion(ua: string, pattern: RegExp): string | null {
  const m = pattern.exec(ua)
  if (!m) return null
  const v = m[1]
  return v != null && v !== '' ? v : null
}

/**
 * Try each pattern in order; return the first non-null match, or null.
 */
export function extractVersionFromPatterns(ua: string, patterns: RegExp[]): string | null {
  for (const p of patterns) {
    const v = extractVersion(ua, p)
    if (v !== null) return v
  }
  return null
}

/**
 * Extract the Chrome major version from `ua` and look it up in a table.
 * Returns the mapped string on hit, or null on miss / no Chrome token.
 */
export function lookupFromChromeVersion(ua: string, table: Record<string, string>): string | null {
  const m = /Chrome\/([\d]+)/.exec(ua)
  if (!m) return null
  const major = m[1]
  return Object.prototype.hasOwnProperty.call(table, major) ? table[major] : null
}
