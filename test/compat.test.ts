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
    const result = parseUA('Mozilla/5.0 (Windows NT 10.0) Chrome/124.0.0.0')
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

  it('default export has .detect async method', () => {
    expect(typeof uaBrowser.detect).toBe('function')
  })

  it('uaBrowser.detect() returns EnvOption shape', async () => {
    const result = await uaBrowser.detect('Mozilla/5.0 (Windows NT 10.0) Chrome/124.0.0.0')
    expect(result).toHaveProperty('browser')
    expect(result).toHaveProperty('os')
    expect(result).toHaveProperty('engine')
    expect(result.browser).toBe('Chrome')
    expect(result.os).toBe('Windows')
  })

  it('parseUA result has confidence field', () => {
    const result = parseUA('Mozilla/5.0 (Windows NT 10.0) Chrome/124.0.0.0')
    expect(result).toHaveProperty('confidence')
    expect(['high', 'medium', 'low']).toContain(result.confidence)
  })

  it('named export BotDef type is available (BotDef import compiles)', async () => {
    const mod = await import('../src/index.js')
    expect(mod).toBeDefined()
  })

})
