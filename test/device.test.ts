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

  describe('desktop mode override (env signals)', () => {
    // iPhone requesting desktop site: UA looks like Mac, but env reveals touch-only phone
    const desktopModeIphoneUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/604.1'
    // Android requesting desktop site: UA looks like Linux x86_64
    const desktopModeAndroidUA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

    it('iPhone in desktop mode (coarse+no-hover, screen<768) → Mobile', () => {
      expect(detectDevice(desktopModeIphoneUA, {
        platform: 'MacIntel', maxTouchPoints: 5,
        pointerType: 'coarse', hoverCapability: false, screenWidth: 390
      })).toBe('Mobile')
    })

    it('iPad in desktop mode (coarse+no-hover, screen≥768) → Tablet', () => {
      expect(detectDevice(desktopModeIphoneUA, {
        platform: 'MacIntel', maxTouchPoints: 5,
        pointerType: 'coarse', hoverCapability: false, screenWidth: 820
      })).toBe('Tablet')
    })

    it('Android phone in desktop mode (coarse+no-hover, screen<768) → Mobile', () => {
      expect(detectDevice(desktopModeAndroidUA, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        pointerType: 'coarse', hoverCapability: false, screenWidth: 412
      })).toBe('Mobile')
    })

    it('touch laptop (coarse+hover=true) → PC, not overridden', () => {
      // Surface-style: primary pointer is touch but mouse/touchpad provides hover
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Win32', maxTouchPoints: 10,
        pointerType: 'coarse', hoverCapability: true, screenWidth: 1920
      })).toBe('PC')
    })

    it('desktop with no env signals → PC', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Win32', maxTouchPoints: 0
      })).toBe('PC')
    })
  })
})
