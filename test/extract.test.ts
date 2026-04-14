import { describe, it, expect } from 'vitest'
import { extractVersion, extractVersionFromPatterns, lookupFromChromeVersion } from '../src/utils/extract.js'

describe('extractVersion', () => {
  it('returns the first capture group on match', () => {
    expect(extractVersion('Chrome/124.0.0.0', /Chrome\/([\d.]+)/)).toBe('124.0.0.0')
  })

  it('returns null on no-match (never the original string)', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0) Firefox/125.0'
    expect(extractVersion(ua, /Chrome\/([\d.]+)/)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractVersion('', /Chrome\/([\d.]+)/)).toBeNull()
  })

  it('returns null when capture group is empty', () => {
    expect(extractVersion('Chrome/', /Chrome\/([\d]*)/)).toBeNull()
  })
})

describe('extractVersionFromPatterns', () => {
  it('returns first matching pattern result', () => {
    const ua = 'FxiOS/125.0 Mobile'
    expect(extractVersionFromPatterns(ua, [/Firefox\/([\d.]+)/, /FxiOS\/([\d.]+)/])).toBe('125.0')
  })

  it('skips non-matching patterns', () => {
    const ua = 'FxiOS/125.0 Mobile'
    expect(extractVersionFromPatterns(ua, [/Firefox\/([\d.]+)/, /FxiOS\/([\d.]+)/])).toBe('125.0')
    expect(extractVersionFromPatterns(ua, [/Firefox\/([\d.]+)/])).toBeNull()
  })

  it('returns null when no pattern matches', () => {
    expect(extractVersionFromPatterns('Safari/604.1', [/Chrome\/([\d.]+)/, /Firefox\/([\d.]+)/])).toBeNull()
  })
})

describe('lookupFromChromeVersion', () => {
  const table = { '108': '14.0', '86': '13.0', '78': '12.0' }

  it('returns mapped version when Chrome major is in table', () => {
    const ua = 'Chrome/78.0.3904.108 Safari/537.36 360SE'
    expect(lookupFromChromeVersion(ua, table)).toBe('12.0')
  })

  it('returns null when Chrome major version is not in table', () => {
    const ua = 'Chrome/99.0.0.0 Safari/537.36 360SE'
    expect(lookupFromChromeVersion(ua, table)).toBeNull()
  })

  it('returns null when UA has no Chrome token', () => {
    const ua = 'Mozilla/5.0 Firefox/125.0'
    expect(lookupFromChromeVersion(ua, table)).toBeNull()
  })
})
