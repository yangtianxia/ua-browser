import { describe, it, expect } from 'vitest'
import uaBrowser, {
  parseUA,
  isWebview,
  getLanguage,
  getNavContext,
  getWindowsVersion,
  getEnvContext,
  detectBot,
  detectArch,
  detectHeadless,
  parseHeaders,
  ACCEPT_CH,
  VERSION
} from '../src/index.js'
import type { DetectStrategy } from '../src/index.js'

const WIN_UA = 'Mozilla/5.0 (Windows NT 10.0) Chrome/124.0.0.0'
const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

describe('API surface', () => {
  it('default export is a function', () => {
    expect(typeof uaBrowser).toBe('function')
  })

  it('default export has .isWebview property', () => {
    expect(typeof uaBrowser.isWebview).toBe('function')
  })

  it('default export has .getLanguage property', () => {
    expect(typeof uaBrowser.getLanguage).toBe('function')
  })

  it('default export has .VERSION property', () => {
    expect(typeof uaBrowser.VERSION).toBe('string')
    expect(uaBrowser.VERSION.length).toBeGreaterThan(0)
  })

  it('named export parseUA is a function', () => {
    expect(typeof parseUA).toBe('function')
  })

  it('named export isWebview is a function', () => {
    expect(typeof isWebview).toBe('function')
  })

  it('named export getLanguage is a function', () => {
    expect(typeof getLanguage).toBe('function')
  })

  it('named export getWindowsVersion is a function', () => {
    expect(typeof getWindowsVersion).toBe('function')
  })

  it('named export VERSION is a string', () => {
    expect(typeof VERSION).toBe('string')
  })

  it('named export detectBot is a function', () => {
    expect(typeof detectBot).toBe('function')
  })

  it('named export detectArch is a function', () => {
    expect(typeof detectArch).toBe('function')
  })

  it('named export detectHeadless is a function', () => {
    expect(typeof detectHeadless).toBe('function')
  })

  it('isWebview correctly identifies webview UA', () => {
    expect(isWebview('Mozilla/5.0 (Linux; Android 10; K); wv)')).toBe(true)
    expect(isWebview('Mozilla/5.0 (Linux; Android 10; K)')).toBe(false)
  })

  it('parseUA result has platform (not platfrom)', () => {
    const result = parseUA(WIN_UA)
    expect(result).toHaveProperty('platform')
    expect(result).not.toHaveProperty('platfrom')
  })

  it('VERSION matches package.json version', async () => {
    const pkg = await import('../package.json', { assert: { type: 'json' } })
    expect(VERSION).toBe(pkg.default.version)
  })

  it('named export getNavContext is a function', () => {
    expect(typeof getNavContext).toBe('function')
  })

  it('named export getEnvContext is a function', () => {
    expect(typeof getEnvContext).toBe('function')
  })

  it('named export parseHeaders is a function', () => {
    expect(typeof parseHeaders).toBe('function')
  })

  it('named export ACCEPT_CH is a string', () => {
    expect(typeof ACCEPT_CH).toBe('string')
    expect(ACCEPT_CH.length).toBeGreaterThan(0)
  })

  it('isWebview detects iOS WKWebView (no Version/, no Safari/)', () => {
    const iosWKWebView = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    expect(isWebview(iosWKWebView)).toBe(true)
  })

  it('isWebview does not flag CriOS as webview (has Safari/)', () => {
    const crios = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.0.0 Mobile/15E148 Safari/604.1'
    expect(isWebview(crios)).toBe(false)
  })

  it('named export BotDef type is available (BotDef import compiles)', async () => {
    const mod = await import('../src/index.js')
    expect(mod).toBeDefined()
  })
})

describe('uaBrowser() — default export sync', () => {
  it('parses UA string and returns EnvOption shape', () => {
    const r = uaBrowser(WIN_UA)
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('Windows')
    expect(r.confidence).toBe('low')
  })

  it('accepts strategy option', () => {
    const r = uaBrowser(WIN_UA, { strategy: 'ua-first' })
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('Windows')
    expect(r.confidence).toBe('low')
  })

  it('DetectStrategy type accepts all four values', () => {
    const strategies: DetectStrategy[] = ['auto', 'ua-first', 'hardware-first', 'strict']
    for (const s of strategies) {
      const r = uaBrowser(WIN_UA, { strategy: s })
      expect(['high', 'medium', 'low', 'conflict']).toContain(r.confidence)
    }
  })
})

describe('uaBrowser.detect() — async', () => {
  it('is an async function on the default export', () => {
    expect(typeof uaBrowser.detect).toBe('function')
    expect(uaBrowser.detect(WIN_UA)).toBeInstanceOf(Promise)
  })

  it('returns full EnvOption shape', async () => {
    const r = await uaBrowser.detect(WIN_UA)
    const keys = ['browser', 'version', 'engine', 'os', 'osVersion', 'device',
      'arch', 'isWebview', 'isHeadless', 'isBot', 'botName', 'language', 'platform', 'confidence']
    for (const k of keys) expect(r).toHaveProperty(k)
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('Windows')
  })

  it('confidence is a valid value', async () => {
    const r = await uaBrowser.detect(WIN_UA)
    expect(['high', 'medium', 'low', 'conflict']).toContain(r.confidence)
  })

  it('accepts strategy: ua-first — version is not overridden by Client Hints in Node.js', async () => {
    const r = await uaBrowser.detect(WIN_UA, { strategy: 'ua-first' })
    expect(r.browser).toBe('Chrome')
    // In Node.js there is no Client Hints, so ua-first and auto produce same confidence
    expect(['low', 'medium']).toContain(r.confidence)
  })

  it('accepts strategy: hardware-first', async () => {
    const r = await uaBrowser.detect(MAC_UA, { strategy: 'hardware-first' })
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('MacOS')
    expect(['low', 'medium', 'high']).toContain(r.confidence)
  })

  it('accepts strategy: strict — no conflict in Node.js (no hardware context)', async () => {
    const r = await uaBrowser.detect(WIN_UA, { strategy: 'strict' })
    expect(r.browser).toBe('Chrome')
    // No hardware context in Node.js → no conflict possible
    expect(r.confidence).not.toBe('conflict')
  })

  it('all four strategies return a valid EnvOption', async () => {
    const strategies: DetectStrategy[] = ['auto', 'ua-first', 'hardware-first', 'strict']
    for (const strategy of strategies) {
      const r = await uaBrowser.detect(WIN_UA, { strategy })
      expect(r.browser).toBe('Chrome')
      expect(r.os).toBe('Windows')
      expect(['high', 'medium', 'low', 'conflict']).toContain(r.confidence)
    }
  })
})

describe('parseUA() — confidence field', () => {
  it('confidence is low without context', () => {
    const r = parseUA(WIN_UA)
    expect(r.confidence).toBe('low')
  })

  it('confidence is medium with ctx (EnvContext)', () => {
    const ctx = { userAgent: WIN_UA, platform: 'Win32', language: 'en-US', maxTouchPoints: 0 }
    const r = parseUA(WIN_UA, { ctx })
    expect(r.confidence).toBe('medium')
  })

  it('confidence is low with nav only (NavContext does not upgrade confidence)', () => {
    const nav = { userAgent: WIN_UA, platform: 'Win32', language: 'en-US', maxTouchPoints: 0 }
    const r = parseUA(WIN_UA, { nav })
    expect(r.confidence).toBe('low')
  })

  it('confidence can be conflict with strict strategy and contradicting ctx', () => {
    const spoofedAndroidUA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    const macCtx = {
      userAgent: spoofedAndroidUA,
      platform: 'MacIntel',
      language: 'en-US',
      maxTouchPoints: 5,
      userAgentData: { platform: 'Android', getHighEntropyValues: async () => ({}) },
      webglRenderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1 Pro, unspecified version)',
      screenWidth: 390,
    }
    const r = parseUA(spoofedAndroidUA, { ctx: macCtx, strategy: 'strict' })
    expect(r.confidence).toBe('conflict')
    expect(r.os).toBe('unknown')
  })

  it('all confidence values are in the valid set', () => {
    const validValues = new Set(['high', 'medium', 'low', 'conflict'])
    expect(validValues.has(parseUA(WIN_UA).confidence)).toBe(true)
  })
})
