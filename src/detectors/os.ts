import type { OsName } from '../types.js'
import { OS_DEFS } from '../constants/os.js'
import { extractVersion, extractVersionFromPatterns } from '../utils/extract.js'

export interface OsResult {
  os:            OsName
  osVersion:     string
  osVersionName: string
}

/**
 * Look up a human-readable name for a version string, trying progressively shorter prefixes.
 * e.g. '14.3' tries '14.3' → '14'; '10.15.7' tries '10.15.7' → '10.15' → '10'.
 */
function lookupVersionName(map: Record<string, string>, version: string): string {
  const parts = version.split('.')
  for (let len = parts.length; len >= 1; len--) {
    const key = parts.slice(0, len).join('.')
    if (Object.prototype.hasOwnProperty.call(map, key)) return map[key]!
  }
  return 'unknown'
}

/**
 * Detect the operating system and its version from a user agent string.
 *
 * @param ua              - Raw user agent string
 * @param windowsVersion  - Pre-resolved Windows 11/10 string from getWindowsVersion()
 *                          (avoids the async race condition of the old implementation)
 */
export function detectOs(ua: string, windowsVersion?: string | null): OsResult {
  let matchedDef: (typeof OS_DEFS)[number] | null = null

  // Iterate in array order; later entries have higher priority (same as BROWSER_DEFS)
  for (const def of OS_DEFS) {
    if (def.detect.test(ua)) {
      matchedDef = def
    }
  }

  if (!matchedDef) return { os: 'unknown', osVersion: 'unknown', osVersionName: 'unknown' }

  let osVersion = 'unknown'

  if (matchedDef.versionPattern) {
    const raw = Array.isArray(matchedDef.versionPattern)
      ? extractVersionFromPatterns(ua, matchedDef.versionPattern)
      : extractVersion(ua, matchedDef.versionPattern)

    if (raw !== null) {
      // Normalise iOS underscore-separated version: "17_4_1" → "17.4.1"
      const normalised = raw.replace(/_/g, '.')

      if (matchedDef.versionLookup) {
        // Use lookup table if available (Windows NT, HarmonyOS)
        const mapped = Object.prototype.hasOwnProperty.call(matchedDef.versionLookup, normalised)
          ? matchedDef.versionLookup[normalised]
          : null

        if (mapped !== null) {
          osVersion = mapped
        } else if (matchedDef.name === 'Windows') {
          // For unknown Windows NT versions, fall back to the integer part
          const n = parseInt(normalised, 10)
          osVersion = isNaN(n) ? 'unknown' : n.toString()
        } else {
          // For other OS types (e.g. HarmonyOS Next), use raw version directly
          osVersion = normalised
        }
      } else {
        osVersion = normalised
      }
    }
  }

  // Windows 11 override — provided externally to avoid async race
  if (matchedDef.name === 'Windows' && windowsVersion) {
    osVersion = windowsVersion
  }

  const osVersionName = matchedDef.versionNames
    ? lookupVersionName(matchedDef.versionNames, osVersion)
    : 'unknown'
  return { os: matchedDef.name, osVersion, osVersionName }
}
