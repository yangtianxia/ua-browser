import { describe, it, expect } from 'vitest'
import uaBrowser, {
  parseUA,
  isWebview,
  isWechatMiniapp,
  getLanguage,
  getWindowsVersion,
  detectBot,
  detectArch,
  detectHeadless,
  VERSION
} from '../src/index.js'

describe('API surface', () => {
  it('default export is a function', () => {
    expect(typeof uaBrowser).toBe('function')
  })

  it('default export has .isWebview property', () => {
    expect(typeof uaBrowser.isWebview).toBe('function')
  })

  it('default export has .isWechatMiniapp property', () => {
    expect(typeof uaBrowser.isWechatMiniapp).toBe('function')
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

  it('named export isWechatMiniapp is a function', () => {
    expect(typeof isWechatMiniapp).toBe('function')
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

  it('isWechatMiniapp returns boolean', () => {
    expect(typeof isWechatMiniapp()).toBe('boolean')
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
})
