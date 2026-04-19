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

  it('Android tablet (no Mobile marker) → Tablet', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 10; SM-T515) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36'
    expect(detectDevice(ua)).toBe('Tablet')
  })

  it('Samsung Smart TV → TV', () => {
    const ua = 'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/6.0 TV Safari/538.1'
    expect(detectDevice(ua)).toBe('TV')
  })

  it('HbbTV device → TV', () => {
    const ua = 'Mozilla/5.0 (Linux; HbbTV/1.4.7 (+PVR+DL; Philips; TV; ; ; ;) CE-HTML/1.0 NETTV/4.4.0 SmartTV2018)'
    expect(detectDevice(ua)).toBe('TV')
  })

  it('empty UA → PC', () => {
    expect(detectDevice('')).toBe('PC')
  })
})
