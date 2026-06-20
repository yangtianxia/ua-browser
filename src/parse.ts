import type { EnvOption, BrowserName, OsName } from './types.js'
import { OS_DEFS } from './constants/os.js'
import { detectBrowser } from './detectors/browser.js'
import { detectEngine } from './detectors/engine.js'
import { detectOs } from './detectors/os.js'
import { detectDevice, detectVendorModel } from './detectors/device.js'
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
   * Explicit language override (BCP47, e.g. "zh-CN"). Useful for server-side parsing
   * where the Accept-Language header is available but no browser context exists.
   * Takes precedence over language derived from ctx/nav or UA string.
   */
  language?: string
}

// Priority-ordered brand → browser, derived from Client Hints fullVersionList.
// More specific brands (Edge, Opera, Vivaldi) listed before the generic Chrome/Chromium
// so that e.g. an Edge UA with both 'Microsoft Edge' and 'Chromium' resolves to Edge.
const BRAND_TO_BROWSER: ReadonlyArray<[string, BrowserName]> = [
  ['Microsoft Edge', 'Edge'],
  ['Opera',          'Opera'],
  ['Vivaldi',        'Vivaldi'],
  ['Brave',          'Brave'],
  ['Google Chrome',  'Chrome'],
  ['Chromium',       'Chromium'],
]

/**
 * Infer the OS from hardware context using a tiered trust model.
 *
 * Tier 1 — WebGL (unspoofable by DevTools):
 *   pvrtc = PowerVR GPU → iOS only; ANGLE → desktop (blocks DevTools mobile emulation);
 *   Adreno/Mali → Android.
 * Tier 2 — Client Hints with platformVersion (getHighEntropyValues call, harder to fake consistently).
 * Tier 3 — navigator.platform (reliable for Mac/Win/iOS; DevTools rarely changes this).
 * Tier 4 — Additional hardware signals: CSS safe-area-inset (iOS notch/Dynamic Island).
 * Tier 5 — chPlatform alone with Linux ARM corroboration (last-resort Android fallback).
 *
 * Generic 'Linux' is intentionally not returned — too ambiguous for server vs. desktop.
 */
function osFromHardware(ctx: EnvContext): OsName | null {
  const p = (ctx.platform ?? '').toLowerCase()
  const chPlatform = ctx.userAgentData?.platform
  const platformVersion = ctx.highEntropyData?.platformVersion
  const hasPlatformVersion = !!(platformVersion && platformVersion !== '0.0.0')

  // Tier 1: WebGL — cannot be spoofed by DevTools device emulation
  // pvrtc = PowerVR GPU, exclusive to iOS; never present on Android or any desktop GPU
  if (ctx.webglCompressedFormats?.pvrtc && !ctx.webglCompressedFormats.s3tc) return 'iOS'
  // ANGLE = desktop Chromium translating WebGL via D3D/Metal — definitively not mobile.
  // Returning null when Mac/Win/ChromeOS can't be confirmed prevents DevTools iOS/Android
  // platform signals from leaking through when the real GPU exposes a desktop renderer.
  if (ctx.webglRenderer && /^ANGLE\b/.test(ctx.webglRenderer)) {
    if (p.startsWith('mac') || chPlatform === 'macOS') return 'MacOS'
    if (p.startsWith('win') || chPlatform === 'Windows') return 'Windows'
    if (chPlatform === 'Chrome OS') return 'Chrome OS'
    // Cannot confirm which desktop OS — null blocks DevTools-spoofed os/osVersion from
    // leaking through. Note: if platformVersion were available, Tier 2 would already
    // have returned a specific OS before reaching this point, so null is safe here.
    return null
  }
  // Adreno (Qualcomm) and Mali (ARM) are Android-exclusive mobile GPU families
  if (ctx.webglRenderer && (/Adreno/i.test(ctx.webglRenderer) || /Mali[-\s]/i.test(ctx.webglRenderer))) {
    return 'Android'
  }

  // Tier 2: Client Hints platform + platformVersion — requires getHighEntropyValues(),
  // harder to fake consistently across both fields simultaneously
  if (chPlatform && hasPlatformVersion) {
    const chMap: Partial<Record<string, OsName>> = {
      Windows: 'Windows', macOS: 'MacOS', Android: 'Android',
      iOS: 'iOS', 'Chrome OS': 'Chrome OS',
    }
    const mapped = chMap[chPlatform]
    if (mapped) return mapped
  }

  // Tier 3: navigator.platform — reliable for Mac/Win/iOS; DevTools rarely spoofs this
  if (p.startsWith('mac')) return 'MacOS'
  if (p.startsWith('win')) return 'Windows'
  if (p === 'iphone' || p === 'ipad' || p === 'ipod') return 'iOS'

  // Tier 4: Additional hardware signals
  // CSS env(safe-area-inset-top) > 0: iOS notch/Dynamic Island — OS-level, not fakeable by JS
  if ((ctx.safeAreaInsetTop ?? 0) > 0) return 'iOS'

  // Tier 5: chPlatform alone (easily spoofed) — minimal fallback
  if (chPlatform === 'Chrome OS') return 'Chrome OS'
  // Android: require Linux ARM corroboration — pure chPlatform='Android' alone is too easy to spoof
  if (chPlatform === 'Android' && (p.includes('android') || /^linux arm/i.test(ctx.platform ?? ''))) {
    return 'Android'
  }
  if (p.includes('android') || /^linux arm/i.test(ctx.platform ?? '')) return 'Android'

  return null
}

/**
 * Approximate navigator.platform from the UA string for UA-only mode.
 * Matches what real browsers return: 'MacIntel', 'Win32'/'Win64', 'iPhone', etc.
 */
function platformFromUA(ua: string): string {
  if (/iPhone/.test(ua)) return 'iPhone'
  if (/iPad/.test(ua))   return 'iPad'
  if (/iPod/.test(ua))   return 'iPod'
  if (/Macintosh/.test(ua)) return 'MacIntel'
  if (/Windows NT/.test(ua)) return /Win64|WOW64/i.test(ua) ? 'Win64' : 'Win32'
  if (/CrOS/.test(ua)) return 'Linux x86_64'
  if (/Android/.test(ua)) return /aarch64|arm64/i.test(ua) ? 'Linux aarch64' : 'Linux armv8l'
  if (/Linux/.test(ua)) {
    if (/x86_64/i.test(ua))    return 'Linux x86_64'
    if (/aarch64|arm64/i.test(ua)) return 'Linux aarch64'
    return 'Linux'
  }
  return 'unknown'
}

/**
 * Extract a BCP47 locale from UA strings that embed it (e.g. some Android OEM browsers:
 * "Linux; Android 10; zh-CN; ..."). Standard Chrome/Firefox/Safari desktop UAs do not
 * include locale, so this returns 'unknown' for them.
 */
function normalizeBCP47(raw: string): string {
  const parts = raw.replace(/_/g, '-').split('-')
  return parts.map((p, i) => {
    if (i === 0) return p.toLowerCase()
    if (p.length === 4) return p[0].toUpperCase() + p.slice(1).toLowerCase()  // script subtag: TitleCase
    return p.toUpperCase()                                                      // region subtag: UPPERCASE
  }).join('-')
}

// ISO 639-1 whitelist — prevents false-positives on non-language UA tokens (arm, wv, rv…).
const ISO_639_1 = new Set([
  'af','am','ar','az','be','bg','bn','bs','ca','cs','cy','da','de','el','en',
  'es','et','eu','fa','fi','fr','ga','gl','gu','he','hi','hr','hu','hy','id',
  'is','it','ja','ka','kk','km','kn','ko','lt','lv','mk','ml','mn','mr','ms',
  'mt','my','nb','ne','nl','no','pa','pl','pt','ro','ru','si','sk','sl','sq',
  'sr','sv','sw','ta','te','th','tl','tr','uk','ur','uz','vi','zh','zu',
])

function languageFromUA(ua: string): string {
  // WeChat / many app UAs: "Language/zh_CN", "Language/zh-Hans-CN", etc.
  const kwMatch = /\bLanguage\/([a-zA-Z]{2,3}(?:[-_][a-zA-Z]{2,4}){1,2})\b/i.exec(ua)
  if (kwMatch) return normalizeBCP47(kwMatch[1])

  // Standard: "; zh-CN;" / "; en-us;" / "; zh_CN;" between delimiters.
  // Initial segment must be lowercase (filters OS names, Build strings, etc.).
  const re = /[;(]\s*([a-z]{2,3}(?:[-_][A-Za-z]{2,4})+)\s*[;)]/g
  let m
  while ((m = re.exec(ua)) !== null) {
    const parts = m[1].replace(/_/g, '-').split('-')
    if (parts.length >= 2) return normalizeBCP47(m[1])
  }

  // Bare 2-letter codes: "; en;" in older Android OEM UAs.
  // Whitelisted against ISO 639-1 to avoid matching architecture tokens (arm, wv…).
  const bare = /[;(]\s*([a-z]{2,3})\s*[;)]/g
  while ((m = bare.exec(ua)) !== null) {
    if (ISO_639_1.has(m[1])) return m[1]
  }

  return 'unknown'
}

/**
 * Parse a user agent string into a full browser/OS/engine/device description.
 *
 * Pure function — no global state, no singletons. All environment access is
 * supplied through `options.nav`; omit it for Node.js / testing contexts.
 */
export function parseUA(ua: string, options: ParseOptions = {}): EnvOption {
  const effectiveNav: EnvContext | NavContext | undefined = options.ctx ?? options.nav
  const effectiveWindowsVersion = options.ctx?.windowsVersion ?? options.windowsVersion

  const { browser: rawBrowser, version: rawVersion, browserType } = detectBrowser(ua)
  const { os: rawOs, osVersion: rawOsVersion, osVersionName } = detectOs(ua, effectiveWindowsVersion)
  let os: OsName = rawOs
  let osVersion: string = rawOsVersion
  const device = detectDevice(ua, effectiveNav)
  const { vendor, model } = detectVendorModel(ua)
  const arch = detectArch(ua, options.ctx ?? effectiveNav as EnvContext | undefined)
  const nav = effectiveNav
  const { isBot, botName, botCategory } = detectBot(ua, options.customBotDefs)
  const isHeadless = detectHeadless(ua)
  const language = options.language
    || (nav?.language || nav?.browserLanguage ? getLanguage(nav) : '')
    || languageFromUA(ua)
  const platform = nav?.platform || platformFromUA(ua)

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

  // 360 Mobile Browser on iOS: no MIME plugins on mobile, but injects proprietary
  // window properties (window__$_qihoo360_$__dayMode / nightMode) detectable via ctx.
  // Restricted to iOS + Safari UA since that's the only confirmed environment.
  if (options.ctx?.has360Mobile && os === 'iOS' && browser === 'Safari') {
    browser = '360'
    version = 'unknown'
  }

  // Brave cannot be detected via UA: it mimics Chrome on Android and Safari on iOS.
  // Only override when browser is still the generic base (Chrome or Safari) — this
  // ensures 360/Edge/Opera/etc. detected above are not replaced, even if a browser
  // falsely exposes navigator.brave.isBrave().
  if (options.ctx?.hasBrave && (browser === 'Chrome' || browser === 'Safari')) browser = 'Brave'

  // Baidu UA can include Opera token — Opera takes priority
  if (browser === 'Baidu' && /(Opera|OPR|OPT)/.test(ua)) {
    browser = 'Opera'
    const opVer = /OPR\/([\d.]+)/.exec(ua) ?? /OPT\/([\d.]+)/.exec(ua) ?? /Opera\/([\d.]+)/.exec(ua)
    version = opVer?.[1] ?? 'unknown'
  }

  // Firefox Nightly: version string carries an 'a1' pre-release suffix (e.g. Firefox/128.0a1).
  if (browser === 'Firefox' && /Firefox\/[\d.]+a\d/.test(ua)) {
    browser = 'Firefox Nightly'
  }

  // Firefox Focus iOS: newer versions dropped the Focus/ token and use Version/ instead of Safari/.
  // Detected by: FxiOS/ present (iOS-only) + Safari/ absent (Focus omits it, Firefox iOS always includes it).
  if (browser === 'Firefox' && /\bFxiOS\//.test(ua) && !/\bSafari\//.test(ua)) {
    browser = 'Firefox Focus'
    const m = /\bFxiOS\/([\d.]+)/.exec(ua)
    if (m) version = m[1]
  }

  // iOS 26+: Apple freezes "CPU iPhone OS" at the last iOS 18 value for web compatibility.
  // \bVersion/ (word boundary excludes ReleaseVersion/ etc.) carries the real iOS version.
  // Apple provides this token to all third-party browsers, not just Safari.
  if (os === 'iOS') {
    const m = /\bVersion\/([\d.]+)/.exec(ua)
    if (m && parseInt(m[1], 10) > parseInt(osVersion, 10)) {
      osVersion = m[1]
    }
  }

  // Baidu iOS freezes CPU iPhone OS but embeds real version in "(Baidu; P<n> <version>)".
  // Must run before the isIOS26Plus fallback so its precise value isn't overwritten by '26'.
  if (os === 'iOS' && browser === 'Baidu') {
    const m = /\(Baidu; P\d+ ([\d.]+)\)/.exec(ua)
    if (m && parseInt(m[1], 10) > parseInt(osVersion, 10)) {
      osVersion = m[1]
    }
  }

  // iOS 26+ fallback: when UA is frozen at ≤18 and no Version/ token is present (e.g. WKWebView,
  // Firefox iOS), CSS feature detection on the ctx confirms Safari/WebKit 26+.
  if (os === 'iOS' && parseInt(osVersion, 10) <= 18 && options.ctx?.isIOS26Plus) {
    osVersion = '26'
  }

  // macOS 26+: Apple unified version numbering — Safari major version = macOS major version.
  // UA still freezes "Mac OS X 10_15_7"; Version/ carries the real macOS version from 26+.
  if (os === 'MacOS' && browser === 'Safari') {
    const m = /Version\/([\d.]+)/.exec(ua)
    if (m && parseInt(m[1], 10) >= 26) {
      osVersion = m[1]
    }
  }

  // ── Hardware context: OS + osVersion + browser + version ──────────────────
  if (options.ctx) {
    const hwOs = osFromHardware(options.ctx)
    if (hwOs !== null) {
      if (hwOs !== rawOs) {
        os = hwOs
        osVersion = 'unknown'
      }
      // UA freezes macOS at 10.15.7 and Android version is often stale;
      // platformVersion carries the real value. Skip Windows — already resolved via getWindowsVersion().
      if (os !== 'Windows') {
        const pv = options.ctx.highEntropyData?.platformVersion
        if (pv && pv !== '0.0.0') {
          const parts = pv.split('.').map(Number)
          while (parts.length > 1 && parts[parts.length - 1] === 0) parts.pop()
          if (parts[0]) osVersion = parts.join('.')
        }
      }
    }

    const fullVersionList = options.ctx.highEntropyData?.fullVersionList
    if (fullVersionList) {
      for (const [brand, browserName] of BRAND_TO_BROWSER) {
        const entry = fullVersionList.find(e => e.brand === brand)
        if (entry?.version) {
          browser = browserName
          version = entry.version
          break
        }
      }
    }
  }

  const { engine, engineVersion } = detectEngine(ua, browser, version)

  const major = parseInt(version.split('.')[0] ?? '', 10)
  const versionMajor = Number.isNaN(major) ? 0 : major
  const connectionType = (options.ctx ?? options.nav)?.connection?.effectiveType ?? 'unknown'

  // Recompute osVersionName after any Windows 11 override in options.
  // Use tiered lookup: try '14.3' → '14' so that versionNames keyed on major version match too.
  const finalOsVersionName = (os === 'MacOS' || os === 'Windows')
    ? (() => {
        const map = OS_DEFS.find(d => d.name === os)?.versionNames
        if (!map) return 'unknown'
        const parts = osVersion.split('.')
        for (let len = parts.length; len >= 1; len--) {
          const key = parts.slice(0, len).join('.')
          if (Object.prototype.hasOwnProperty.call(map, key)) return map[key]!
        }
        return 'unknown'
      })()
    : osVersionName

  // Known independent browsers (non-app, non-unknown) are never webviews, even when
  // their iOS UA lacks Version/ and Safari/ tokens. Android "; wv" is always reliable.
  const rawIsWebview = isWebview(ua)
  const finalIsWebview = /; wv/.test(ua)
    ? true
    : rawIsWebview && (browser === 'unknown' || browserType === 'app')

  return {
    browser,
    version,
    versionMajor,
    browserType: browser === 'Brave' ? 'browser' : browserType,
    engine,
    engineVersion,
    os,
    osVersion,
    osVersionName: finalOsVersionName,
    device,
    vendor,
    model,
    arch,
    isWebview: finalIsWebview,
    isHeadless,
    isBot,
    botName,
    botCategory,
    language,
    platform,
    connectionType,
  }
}
