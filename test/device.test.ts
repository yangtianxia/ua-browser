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

    // ── Hard-to-fake hardware signals ─────────────────────────────────────────

    it('Adreno GPU (Qualcomm/Android), screen<768 → Mobile', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        webglRenderer: 'Adreno (TM) 730', screenWidth: 412
      })).toBe('Mobile')
    })

    it('Adreno GPU, screen≥768 → Tablet', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        webglRenderer: 'Adreno (TM) 730', screenWidth: 820
      })).toBe('Tablet')
    })

    it('Mali GPU (ARM/Android), screen<768 → Mobile', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        webglRenderer: 'Mali-G710 MC10', screenWidth: 390
      })).toBe('Mobile')
    })

    it('pvrtc only (iOS GPU), no s3tc → Mobile', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'iPhone', maxTouchPoints: 5,
        webglCompressedFormats: { s3tc: false, pvrtc: true, etc2: false, astc: false },
        screenWidth: 390
      })).toBe('Mobile')
    })

    it('pvrtc + s3tc (desktop with PowerVR driver) → not overridden → PC', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Win32', maxTouchPoints: 0,
        webglCompressedFormats: { s3tc: true, pvrtc: true, etc2: false, astc: false },
        screenWidth: 1920
      })).toBe('PC')
    })

    it('vibration API present, screen<768 → Mobile', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        hasVibration: true, screenWidth: 412
      })).toBe('Mobile')
    })

    it('DeviceMotion present, screen≥768 → Tablet', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        hasDeviceMotion: true, screenWidth: 810
      })).toBe('Tablet')
    })

    it('3G network, screen<768 → Mobile', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        connection: { effectiveType: '3g' }, screenWidth: 412
      })).toBe('Mobile')
    })

    it('4G network alone → PC (4G also used by laptops on hotspot)', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Win32', maxTouchPoints: 0,
        connection: { effectiveType: '4g' }, screenWidth: 1920
      })).toBe('PC')
    })

    it('ANGLE/Intel GPU (desktop) → PC, not overridden', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Win32', maxTouchPoints: 0,
        webglRenderer: 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)',
        screenWidth: 1920
      })).toBe('PC')
    })

    // ── Apple GPU disambiguation ──────────────────────────────────────────────

    it('Apple GPU, screen<768 (iPhone) → Mobile', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'iPhone', maxTouchPoints: 5,
        webglRenderer: 'Apple GPU', screenWidth: 390
      })).toBe('Mobile')
    })

    it('Apple GPU, 768≤screen≤1366 (iPad) → Tablet', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'MacIntel', maxTouchPoints: 5,
        webglRenderer: 'Apple GPU', screenWidth: 1024
      })).toBe('Tablet')
    })

    it('Apple GPU, screen>1366 (Mac) → PC, not overridden', () => {
      expect(detectDevice(UA.safari.desktop, {
        platform: 'MacIntel', maxTouchPoints: 0,
        webglRenderer: 'Apple GPU', screenWidth: 1440
      })).toBe('PC')
    })

    // ── WebGL hardware limits ─────────────────────────────────────────────────

    it('MAX_TEXTURE_SIZE=4096 + touch + screen<768 (Android mobile GPU) → Mobile', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        webglMaxTextureSize: 4096, screenWidth: 412
      })).toBe('Mobile')
    })

    it('MAX_TEXTURE_SIZE=8192 + touch + screen≥768 → Tablet', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Linux armv8l', maxTouchPoints: 5,
        webglMaxTextureSize: 8192, screenWidth: 820
      })).toBe('Tablet')
    })

    it('MAX_TEXTURE_SIZE=16384 (desktop GPU) → PC, not overridden', () => {
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Win32', maxTouchPoints: 0,
        webglMaxTextureSize: 16384, screenWidth: 1920
      })).toBe('PC')
    })

    it('MAX_TEXTURE_SIZE=8192 but no touch (maxTouchPoints=0) → PC, not overridden', () => {
      // e.g. a non-touch PC with a very old/weak GPU
      expect(detectDevice(UA.chrome.windows, {
        platform: 'Win32', maxTouchPoints: 0,
        webglMaxTextureSize: 8192, screenWidth: 1280
      })).toBe('PC')
    })
  })
})
