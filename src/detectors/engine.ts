import type { EngineName } from '../types.js'
import { ENGINE_DEFS } from '../constants/engines.js'

/**
 * Detect the rendering engine, with post-detection upgrades for Blink and EdgeHTML.
 *
 * @param ua          - Raw user agent string
 * @param browser     - Already-detected browser name (for Blink/EdgeHTML disambiguation)
 * @param version     - Already-detected browser version string
 */
export function detectEngine(ua: string, browser: string, version: string): EngineName {
  let engine: EngineName = 'unknown'

  for (const def of ENGINE_DEFS) {
    if (def.detect.test(ua)) {
      engine = def.name as EngineName
    }
  }

  // Upgrade WebKit to Blink for Chrome 28+, Opera 15+, Yandex
  if (
    engine === 'WebKit' &&
    /(Chrome|CriOS)/.test(ua) &&
    parseInt((/Chrome\/([\d]+)/.exec(ua) ?? [])[1] ?? '0', 10) > 27
  ) {
    engine = 'Blink'
  } else if (browser === 'Opera' && parseInt(version, 10) > 12) {
    engine = 'Blink'
  } else if (browser === 'Yandex') {
    engine = 'Blink'
  }

  // Edge: Chromium-based Edge uses Blink (version > 75), legacy EdgeHTML below that
  if (browser === 'Edge') {
    engine = parseInt(version, 10) > 75 ? 'Blink' : 'EdgeHTML'
  }

  return engine
}
