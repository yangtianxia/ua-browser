import type { EnvOption, BrowserName, OsName, DetectStrategy } from './types.js'
import { detectBrowser } from './detectors/browser.js'
import { detectEngine } from './detectors/engine.js'
import { detectOs } from './detectors/os.js'
import { detectDevice } from './detectors/device.js'
import { detectBot, type BotDef } from './detectors/bot.js'
import { detectArch } from './detectors/arch.js'
import { detectHeadless } from './detectors/headless.js'
import { isWebview } from './detectors/webview.js'
import { getMimeType, getLanguage, type NavContext } from './utils/navigator.js'
import type { EnvContext } from './utils/env-context.js'

export interface ParseOptions {
  /** Nav context to use for language, platform, MIME-type checks, and device detection. */
  nav?: NavContext
  /** Pre-resolved Windows version string (from getWindowsVersion()). Pass to avoid async races. */
  windowsVersion?: string | null
  /** Full env context from getEnvContext() — supersedes nav and windowsVersion when provided. */
  ctx?: EnvContext
  /** Additional bot definitions prepended before the GenericBot catch-all. */
  customBotDefs?: readonly BotDef[]
  /**
   * Signal arbitration strategy.
   *
   * - `'auto'` (default) — UA first, hardware fills gaps
   * - `'ua-first'` — UA string is authoritative; hardware only supplements language/platform/arch
   * - `'hardware-first'` — hardware signals (Client Hints, WebGL) take precedence over UA
   * - `'strict'` — contradicting signals produce `'unknown'` and `confidence: 'conflict'`
   */
  strategy?: DetectStrategy
}

// Maps detected BrowserName to the expected brand strings in Sec-CH-UA-Full-Version-List.
// Only Chromium-based browsers that actually send Client Hints are included.
// Brave blocks Client Hints by default; Samsung Internet doesn't support them.
const BRAND_MAP: Partial<Record<BrowserName, string[]>> = {
  Chrome:   ['Google Chrome', 'Chromium'],
  Edge:     ['Microsoft Edge'],
  Chromium: ['Chromium'],
  Opera:    ['Opera'],
  Vivaldi:  ['Vivaldi'],
}

// All brand strings that identify a Chromium-based browser in fullVersionList.
const ALL_CHROMIUM_BRANDS = new Set(Object.values(BRAND_MAP).flat())

/**
 * Infer the OS from hardware context (Client Hints platform or navigator.platform).
 * Returns null when neither source provides enough information.
 *
 * Priority rationale:
 * - navigator.platform is NOT spoofed by Chrome DevTools device emulation.
 * - userAgentData.platform IS spoofed (DevTools sets it to 'Android' etc.).
 * - So for Mac/Win/iOS we trust navigator.platform first; for ambiguous Linux-based
 *   platforms (Android, Chrome OS) we fall back to userAgentData.platform to
 *   distinguish them on real devices.
 */
function osFromHardware(ctx: EnvContext): OsName | null {
  // navigator.platform is never spoofed by DevTools — use it for unambiguous platforms.
  const p = (ctx.platform ?? '').toLowerCase()
  if (p.startsWith('mac')) return 'MacOS'
  if (p.startsWith('win')) return 'Windows'
  if (p === 'iphone' || p === 'ipad' || p === 'ipod') return 'iOS'

  // For ambiguous Linux-based platforms (Android, Chrome OS, generic Linux),
  // userAgentData.platform can distinguish them on real devices.
  // On a real Mac/Win/iOS we already returned above, so reaching here means
  // either we're on a Linux-based platform or the old API was unavailable.
  const chPlatform = ctx.userAgentData?.platform
  if (chPlatform) {
    const map: Partial<Record<string, OsName>> = {
      Windows: 'Windows',
      macOS: 'MacOS',
      Linux: 'Linux',
      Android: 'Android',
      iOS: 'iOS',
      'Chrome OS': 'Chrome OS',
    }
    const mapped = map[chPlatform]
    if (mapped) return mapped
  }

  // Final navigator.platform patterns for Linux/Android as last resort
  if (p.includes('android') || /linux arm/i.test(ctx.platform ?? '')) return 'Android'
  if (p.includes('linux')) return 'Linux'
  return null
}

/**
 * Parse a user agent string into a full browser/OS/engine/device description.
 *
 * Pure function — no global state, no singletons. All environment access is
 * supplied through `options.nav`; omit it for Node.js / testing contexts.
 */
export function parseUA(ua: string, options: ParseOptions = {}): EnvOption {
  const strategy: DetectStrategy = options.strategy ?? 'auto'
  const effectiveNav: EnvContext | NavContext | undefined = options.ctx ?? options.nav
  const effectiveWindowsVersion = options.ctx?.windowsVersion ?? options.windowsVersion

  const { browser: rawBrowser, version: rawVersion } = detectBrowser(ua)
  const { os: rawOs, osVersion: rawOsVersion } = detectOs(ua, effectiveWindowsVersion)
  let os: OsName = rawOs
  let osVersion: string = rawOsVersion
  const device = detectDevice(ua, effectiveNav, strategy)
  const arch = detectArch(ua, options.ctx)
  const nav = effectiveNav
  const { isBot, botName } = detectBot(ua, options.customBotDefs)
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
  if (browser === 'Firefox' && nav) {
    try {
      if (typeof clientInformation !== 'undefined' || typeof u2f === 'undefined') {
        browser = 'Firefox Nightly'
      }
    } catch {
      // globals not accessible — leave as Firefox
    }
  }

  // iOS 26+: Apple freezes "CPU iPhone OS" at the last iOS 18 value for web compatibility.
  // The Version/ token reliably reflects the real Safari/iOS version.
  if (os === 'iOS' && browser === 'Safari') {
    const m = /Version\/([\d.]+)/.exec(ua)
    if (m && parseInt(m[1], 10) > parseInt(osVersion, 10)) {
      osVersion = m[1]
    }
  }

  // ── hardware-first: OS + osVersion from hardware signals ───────────────────
  if (strategy === 'hardware-first' && options.ctx) {
    const hwOs = osFromHardware(options.ctx)
    if (hwOs !== null) {
      if (hwOs !== rawOs) {
        os = hwOs
        osVersion = 'unknown'
      }
      // Use Client Hints platformVersion as the authoritative OS version.
      // UA freezes macOS at 10.15.7 and Android version is often stale;
      // platformVersion carries the real value (e.g. "14.5.0" for macOS Sonoma).
      // Skip Windows — its version is already resolved via getWindowsVersion().
      if (os !== 'Windows') {
        const pv = options.ctx.highEntropyData?.platformVersion
        if (pv && pv !== '0.0.0') {
          const [major, minor] = pv.split('.')
          if (major && major !== '0') {
            osVersion = minor && minor !== '0' ? `${major}.${minor}` : major
          }
        }
      }
    }
  }

  // ── Client Hints version override (skipped for ua-first) ───────────────────
  // Chrome/Edge/Opera/Vivaldi freeze their patch version in the UA string; fullVersionList
  // carries the real full version (e.g. "124.0.6367.201" vs "124.0.0.0").
  let usedClientHintsVersion = false
  if (strategy !== 'ua-first') {
    const fullVersionList = options.ctx?.highEntropyData?.fullVersionList
    if (fullVersionList) {
      const brands = BRAND_MAP[browser]
      if (brands) {
        for (const brandName of brands) {
          const entry = fullVersionList.find(e => e.brand === brandName)
          if (entry?.version) {
            version = entry.version
            usedClientHintsVersion = true
            break
          }
        }
      }
    }
  }

  // ── strict: conflict detection ──────────────────────────────────────────────
  let hasConflict = false
  if (strategy === 'strict' && options.ctx) {
    // OS conflict: hardware says different OS than UA
    const hwOs = osFromHardware(options.ctx)
    if (hwOs !== null && hwOs !== rawOs) {
      os = 'unknown'
      osVersion = 'unknown'
      hasConflict = true
    }

    // Browser/version conflict: fullVersionList contradicts UA-detected browser
    const fullVersionList = options.ctx.highEntropyData?.fullVersionList
    if (fullVersionList && fullVersionList.length > 0) {
      const brands = BRAND_MAP[browser]
      if (brands) {
        // UA says a Chromium browser — verify its brand appears in fullVersionList
        const found = brands.some(b => fullVersionList.some(e => e.brand === b))
        if (!found) {
          browser = 'unknown'
          version = 'unknown'
          hasConflict = true
        }
      } else {
        // UA says non-Chromium browser (Safari, Firefox, etc.) —
        // if fullVersionList has a Chromium brand, the real browser is different
        if (fullVersionList.some(e => ALL_CHROMIUM_BRANDS.has(e.brand))) {
          browser = 'unknown'
          version = 'unknown'
          hasConflict = true
        }
      }
    }

    // Device conflict is signalled by detectDevice returning 'unknown'
    if (device === 'unknown') hasConflict = true
  }

  const engine = detectEngine(ua, browser, version)

  const confidence: 'high' | 'medium' | 'low' | 'conflict' =
    strategy === 'strict' && hasConflict ? 'conflict'
    : usedClientHintsVersion             ? 'high'
    : options.ctx                        ? 'medium'
    : 'low'

  return {
    browser,
    version,
    engine,
    os,
    osVersion,
    device,
    arch,
    isWebview: isWebview(ua),
    isHeadless,
    isBot,
    botName,
    language,
    platform,
    confidence,
  }
}
