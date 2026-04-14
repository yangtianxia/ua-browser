import type { BrowserName } from '../types.js'
import { BROWSER_DEFS } from '../constants/browsers.js'
import { extractVersionFromPatterns, lookupFromChromeVersion } from '../utils/extract.js'

export interface BrowserResult {
  browser: BrowserName
  version: string
}

/**
 * Detect the browser name and version from a user agent string.
 *
 * When multiple BROWSER_DEFS entries match the same UA, the one with
 * the highest `priority` value wins (ties go to the later definition).
 */
export function detectBrowser(ua: string): BrowserResult {
  let best: (typeof BROWSER_DEFS)[number] | null = null

  for (const def of BROWSER_DEFS) {
    if (def.detect.test(ua)) {
      if (best === null || def.priority >= best.priority) {
        best = def
      }
    }
  }

  if (!best) return { browser: 'unknown', version: 'unknown' }

  let version: string | null = null

  // 1. Try Chrome-version lookup table (for browsers like 360SE/EE that version by Chrome major)
  if (best.chromeLookup) {
    version = lookupFromChromeVersion(ua, best.chromeLookup)
  }

  // 2. Fall back to direct regex extraction
  if (version === null && best.versionPattern !== null) {
    const patterns = Array.isArray(best.versionPattern)
      ? best.versionPattern
      : [best.versionPattern]
    version = extractVersionFromPatterns(ua, patterns)
  }

  return { browser: best.name, version: version ?? 'unknown' }
}
