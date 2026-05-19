import type { DeviceName, DetectStrategy } from '../types.js'
import { DEVICE_DEFS } from '../constants/devices.js'
import type { NavContext } from '../utils/navigator.js'

type DeviceNav = Pick<NavContext, 'platform' | 'maxTouchPoints'> & {
  pointerType?: 'coarse' | 'fine' | 'none'
  hoverCapability?: boolean
  screenWidth?: number
  webglRenderer?: string
  webglMaxTextureSize?: number
  webglFragPrecision?: number
  webglCompressedFormats?: { s3tc: boolean; pvrtc: boolean; etc2: boolean; astc: boolean }
  safeAreaInsetTop?: number
  devicePixelRatio?: number
  hasVibration?: boolean
  hasDeviceMotion?: boolean
  connection?: { effectiveType?: string }
}

/**
 * Detect the device type from a user agent string.
 *
 * @param ua       - Raw user agent string
 * @param nav      - Optional nav context; used for hardware signal overrides
 * @param strategy - Detection strategy (default: 'auto')
 */
export function detectDevice(ua: string, nav?: DeviceNav, strategy: DetectStrategy = 'auto'): DeviceName {
  // ── UA-only detection (pure UA string signals) ───────────────────────────
  function uaDetect(): DeviceName | null {
    if (/(SMART-TV|HbbTV|SmartTV|TV Safari|Android TV|GoogleTV)/.test(ua)) return 'TV'
    if (/iPad/.test(ua)) return 'Tablet'
    if (/Android/.test(ua) && !/Mobile/.test(ua)) return 'Tablet'
    for (const def of DEVICE_DEFS) {
      if (def.detect.test(ua)) return def.name as DeviceName
    }
    return null
  }

  // ── Hardware signal detection ────────────────────────────────────────────
  // Signals ordered from most reliable (GPU renderer) to softest (pointer type).
  function hwDetect(): DeviceName | null {
    if (!nav) return null

    if (nav.webglRenderer) {
      // ANGLE prefix = desktop Chrome/Firefox translating WebGL via D3D or Metal.
      // Mobile devices use native GLES/Metal directly — ANGLE never appears there.
      // Check ANGLE first — it definitively identifies desktop and prevents
      // the MacIntel+touch check below from firing for DevTools emulation on Mac.
      if (/^ANGLE\b/.test(nav.webglRenderer)) return 'PC'
      // Adreno = Qualcomm (Android), Mali = ARM (Android)
      if (/Adreno/i.test(nav.webglRenderer) || /Mali[-\s]/i.test(nav.webglRenderer)) {
        return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
      }
      // Apple GPU appears on iPhone, iPad, and Apple Silicon Macs.
      // Use screenWidth to separate them: ≤1366 = iPhone/iPad footprint, >1366 = Mac display.
      if (/Apple GPU/i.test(nav.webglRenderer)) {
        const w = nav.screenWidth ?? 0
        if (w <= 1366) return w >= 768 ? 'Tablet' : 'Mobile'
        return 'PC'
      }
    }

    // iPadOS 13+ desktop mode reports MacIntel platform with real touch points.
    // Placed after GPU checks so DevTools emulation (which spoofs maxTouchPoints
    // but keeps ANGLE renderer) does not false-fire here.
    // Default to Tablet when screenWidth is unknown — iPads are almost always ≥768px.
    if (nav.platform === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1) {
      return (nav.screenWidth !== undefined && nav.screenWidth < 768) ? 'Mobile' : 'Tablet'
    }

    // WebGL MAX_TEXTURE_SIZE: mobile GPUs cap at ≤8192; desktop GPUs report ≥16384.
    if (
      nav.webglMaxTextureSize !== undefined && nav.webglMaxTextureSize <= 8192 &&
      (nav.maxTouchPoints ?? 0) > 1 &&
      (nav.screenWidth ?? 9999) < 1367
    ) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }

    // Compressed texture formats: pvrtc is PowerVR (iOS-only GPU family).
    if (nav.webglCompressedFormats?.pvrtc && !nav.webglCompressedFormats.s3tc) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }

    // CSS env(safe-area-inset-top) > 0 means iOS with notch / Dynamic Island.
    if (nav.safeAreaInsetTop !== undefined && nav.safeAreaInsetTop > 0) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }

    // Mobile-exclusive browser APIs: vibration and device-motion are not
    // implemented in any desktop browser.
    if (nav.hasVibration || nav.hasDeviceMotion) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }

    // Mobile network type: 2G/3G connections are virtually absent on desktop.
    if (
      nav.connection?.effectiveType &&
      ['2g', '3g', 'slow-2g'].includes(nav.connection.effectiveType)
    ) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }

    // High DPR (>2) + touch: desktop Retina (MacBook) tops at DPR=2; phones/tablets
    // start at DPR=3.
    if ((nav.devicePixelRatio ?? 0) > 2 && (nav.maxTouchPoints ?? 0) > 1) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }

    // Soft signal: touch-primary pointer with no hover capability.
    if (nav.pointerType === 'coarse' && nav.hoverCapability === false) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }

    return null
  }

  if (strategy === 'ua-first') return uaDetect() ?? 'PC'

  if (strategy === 'hardware-first') return hwDetect() ?? uaDetect() ?? 'PC'

  if (strategy === 'strict') {
    const uaResult = uaDetect()
    const hwResult = hwDetect()
    // Both have explicit opinions and they conflict → signal contradiction
    if (uaResult !== null && hwResult !== null && uaResult !== hwResult) {
      return 'unknown'
    }
    return hwResult ?? uaResult ?? 'PC'
  }

  // auto (default): UA signals first, hardware fills gaps
  const uaResult = uaDetect()
  if (uaResult !== null) return uaResult
  return hwDetect() ?? 'PC'
}
