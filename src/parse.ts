import type { EnvOption, BrowserName } from './types.js'
import { detectBrowser } from './detectors/browser.js'
import { detectEngine } from './detectors/engine.js'
import { detectOs } from './detectors/os.js'
import { detectDevice } from './detectors/device.js'
import { detectBot } from './detectors/bot.js'
import { detectArch } from './detectors/arch.js'
import { detectHeadless } from './detectors/headless.js'
import { getMimeType, getLanguage, type NavContext } from './utils/navigator.js'

export interface ParseOptions {
  /** Nav context to use for language, platform, MIME-type checks, and device detection. */
  nav?: NavContext
  /** Pre-resolved Windows version string (from getWindowsVersion()). Pass to avoid async races. */
  windowsVersion?: string | null
}

/**
 * Parse a user agent string into a full browser/OS/engine/device description.
 *
 * Pure function — no global state, no singletons. All environment access is
 * supplied through `options.nav`; omit it for Node.js / testing contexts.
 */
export function parseUA(ua: string, options: ParseOptions = {}): EnvOption {
  const { nav, windowsVersion } = options

  const { browser: rawBrowser, version: rawVersion } = detectBrowser(ua)
  const { os, osVersion } = detectOs(ua, windowsVersion)
  const device = detectDevice(ua, nav)
  const arch = detectArch(ua)
  const { isBot, botName } = detectBot(ua)
  const isHeadless = detectHeadless(ua)
  const language = nav ? getLanguage(nav) : 'unknown'
  const platform = nav?.platform ?? 'unknown'

  let browser: BrowserName = rawBrowser
  let version = rawVersion

  // ── Post-detection overrides ────────────────────────────────────────────────

  // 360 browser disambiguation via Chrome global APIs and MIME types.
  // Only runs when a nav context is provided (browser environment).
  if (nav) {
    const chromeGlobal = typeof chrome !== 'undefined' ? chrome : undefined
    const chromeMatch = /Chrome\/([\d]+)/.exec(ua)
    const chromeMajor = chromeMatch ? parseInt(chromeMatch[1], 10) : 0

    if (chromeGlobal) {
      if (chromeGlobal.adblock2345 || chromeGlobal.common2345) {
        browser = '2345Explorer'
        version = 'unknown'
      } else {
        let is360 = false

        if (
          getMimeType(nav, 'application/360softmgrplugin') ||
          getMimeType(nav, 'application/mozilla-npqihooquicklogin') ||
          (chromeMajor > 36 && typeof showModalDialog !== 'undefined')
        ) {
          is360 = true
        } else if (chromeMajor > 45) {
          is360 = getMimeType(nav, 'application/vnd.chromium.remoting-viewer')
          if (!is360 && chromeMajor >= 69) {
            is360 =
              getMimeType(nav, 'application/hwepass2001.installepass2001') ||
              getMimeType(nav, 'application/asx')
          }
        }

        if (is360) {
          // 360EE only when saveData is explicitly enabled; default to 360SE
          const saveDataEnabled = nav.connection?.saveData === true
          if (getMimeType(nav, 'application/gameplugin') || !saveDataEnabled) {
            browser = '360SE'
          } else {
            browser = '360EE'
          }
          version = 'unknown' // re-derived below via browser lookup
        }
      }
    }
  }

  // Baidu UA can include Opera token — Opera takes priority
  if (browser === 'Baidu' && /(Opera|OPR|OPT)/.test(ua)) {
    browser = 'Opera'
    const opVer = /OPR\/([\d.]+)/.exec(ua) ?? /OPT\/([\d.]+)/.exec(ua) ?? /Opera\/([\d.]+)/.exec(ua)
    version = opVer?.[1] ?? 'unknown'
  }

  // Generic "SomethingBrowser/x.y" catch-all: Chrome-based third-party browsers
  // that embed their own token alongside Chrome
  if (browser === 'Chrome' && /\S+Browser\//.test(ua)) {
    const m = /(\S+Browser)\/([\d.]+)/.exec(ua)
    if (m) {
      browser = m[1] as BrowserName
      version = m[2]
    }
  }

  // Firefox Nightly detection — only meaningful in a real browser environment.
  // The heuristic checks for globals that exist in Chrome (clientInformation) but
  // not in standard Firefox, or where u2f was removed in Nightly builds.
  // Skip entirely in Node.js (no nav = not a browser).
  if (browser === 'Firefox' && nav) {
    try {
      if (typeof clientInformation !== 'undefined' || typeof u2f === 'undefined') {
        browser = 'Firefox Nightly'
      }
    } catch {
      // globals not accessible — leave as Firefox
    }
  }

  // WeChat Miniapp detection
  if (browser === 'Wechat') {
    try {
      if (typeof __wxjs_environment !== 'undefined' && __wxjs_environment === 'miniprogram') {
        browser = 'Wechat Miniapp'
      }
    } catch {
      // not in WeChat miniapp context
    }
  }

  const engine = detectEngine(ua, browser, version)

  return {
    browser,
    version,
    engine,
    os,
    osVersion,
    device,
    arch,
    isWebview: /; wv/.test(ua),
    isHeadless,
    isBot,
    botName,
    language,
    platform
  }
}
