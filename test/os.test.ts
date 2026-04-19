import { describe, it, expect } from 'vitest'
import { detectOs } from '../src/detectors/os.js'
import { UA } from './fixtures/user-agents.js'

describe('detectOs', () => {
  it('Windows NT 10.0 → Windows 10', () => {
    const r = detectOs(UA.chrome.windows)
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('10')
  })

  it('Windows NT 6.1 → Windows 7', () => {
    const r = detectOs(UA.ie.ie11) // Windows NT 6.1
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('7')
  })

  it('Windows NT 6.2 → Windows 8', () => {
    const ua = 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0'
    const r = detectOs(ua)
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('8')
  })

  it('Android 14 → Android 14', () => {
    const r = detectOs(UA.chrome.android)
    expect(r.os).toBe('Android')
    expect(r.osVersion).toBe('14')
  })

  it('iOS 17_4 → iOS 17.4 (underscore normalised)', () => {
    const r = detectOs(UA.chrome.crios)
    expect(r.os).toBe('iOS')
    expect(r.osVersion).toBe('17.4')
  })

  it('MacOS → MacOS with version', () => {
    const r = detectOs(UA.safari.desktop)
    expect(r.os).toBe('MacOS')
    expect(r.osVersion).toBe('14.3')
  })

  it('iPad UA → iOS', () => {
    const r = detectOs(UA.safari.ipad)
    expect(r.os).toBe('iOS')
    expect(r.osVersion).toBe('17.4')
  })

  it('windowsVersion override applied when provided', () => {
    const r = detectOs(UA.chrome.windows, '11')
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('11')
  })

  it('returns unknown for empty UA', () => {
    const r = detectOs('')
    expect(r.os).toBe('unknown')
    expect(r.osVersion).toBe('unknown')
  })

  it('osVersion is unknown when version token absent', () => {
    // A Windows UA missing the NT version
    const ua = 'Mozilla/5.0 (Windows; Win64; x64) AppleWebKit/537.36'
    const r = detectOs(ua)
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('unknown')
  })
})
