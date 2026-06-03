import type { EngineName } from '../types.js'
import { ENGINE_DEFS } from '../constants/engines.js'
import { detectBrowser } from './browser.js'

/**
 * Detect the rendering engine from a user agent string.
 *
 * @param ua      - Raw user agent string
 * @param browser - Pre-detected browser name; auto-detected when omitted
 * @param version - Pre-detected browser version; auto-detected when omitted
 */
export function detectEngine(ua: string, browser?: string, version?: string): EngineName {
  if (browser === undefined || version === undefined) {
    const b = detectBrowser(ua)
    browser  = browser  ?? b.browser
    version  = version  ?? b.version
  }
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
