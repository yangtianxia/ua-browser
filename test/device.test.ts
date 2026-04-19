import { describe, it, expect } from 'vitest'
import { detectDevice } from '../src/detectors/device.js'
import { UA } from './fixtures/user-agents.js'

describe('detectDevice', () => {
  it('Mobile Chrome UA → Mobile', () => {
    expect(detectDevice(UA.chrome.android)).toBe('Mobile')
  })

  it('Desktop Chrome UA → PC', () => {
    expect(detectDevice(UA.chrome.windows)).toBe('PC')
  })

  it('iPad UA string → Tablet', () => {
    expect(detectDevice(UA.safari.ipad)).toBe('Tablet')
  })

  it('modern iPad nav context (MacIntel + maxTouchPoints>1) → Tablet', () => {
    // Modern iPad sends a "Macintosh" UA but has touch points
    const macUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15'
    expect(detectDevice(macUA, { platform: 'MacIntel', maxTouchPoints: 5 })).toBe('Tablet')
  })

  it('macOS desktop nav context → PC', () => {
    expect(detectDevice(UA.safari.desktop, { platform: 'MacIntel', maxTouchPoints: 0 })).toBe('PC')
  })

  it('iOS phone → Mobile', () => {
    expect(detectDevice(UA.safari.ios)).toBe('Mobile')
  })

  it('empty UA → PC', () => {
    expect(detectDevice('')).toBe('PC')
  })
})
