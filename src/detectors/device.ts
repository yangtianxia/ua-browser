import type { DeviceName } from '../types.js'
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
 * @param ua  - Raw user agent string
 * @param nav - Optional nav context; hardware signals take precedence over UA when available
 */
export function detectDevice(ua: string, nav?: DeviceNav): DeviceName {
  // ── UA-only detection (pure UA string signals) ───────────────────────────
  function uaDetect(): DeviceName | null {
    if (/PlayStation|Xbox|Nintendo/.test(ua)) return 'Console'
    if (/visionOS|Quest/.test(ua)) return 'XR'
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

  return hwDetect() ?? uaDetect() ?? 'PC'
}

export interface VendorModelResult {
  vendor: string
  model:  string
}

const VENDOR_MAP: [RegExp, string][] = [
  [/^SM-|^GT-|^SGH-|^SCH-|^SHW-|^SPH-|^SAMSUNG /i, 'Samsung'],
  [/^Pixel |^Nexus /,                                 'Google'],
  [/^moto |^motorola /i,                              'Motorola'],
  [/^HONOR /i,                                        'Honor'],
  [/^ELS-|^LYA-|^HMA-|^VOG-|^ANA-|^CLT-|^JNY-|^NOH-|^PLK-|^BAH-|^BKL-|^COL-|^DUB-|^FIG-|^KIW-|^MAR-|^VTR-|^WAS-/i, 'Huawei'],
  [/^CPH/,                                            'OPPO'],
  [/^RMX/,                                            'Realme'],
  [/^V\d{4}[A-Z]|^vivo /i,                           'Vivo'],
  [/^iqoo/i,                                          'Vivo'],
  [/^Redmi |^POCO |^Mi /,                             'Xiaomi'],
  [/^2\d{9}|^2\d{3}[A-Z]/,                           'Xiaomi'],
  [/^OnePlus |^IN2|^KB2|^LE2/i,                       'OnePlus'],
  [/^LM-|^LGE |^LG-/i,                               'LG'],
  [/^HTC/i,                                           'HTC'],
  [/^Nokia/i,                                         'Nokia'],
  [/^XQ-/,                                            'Sony'],
  [/^ASUS_|^ZB6|^ZS6|^ZE[56]/i,                      'Asus'],
  [/^Quest /i,                                        'Meta'],
]

const ANDROID_MODEL_RE = /Android [0-9.]+;(?:\s*U;)?(?:\s*[a-z]{2}[-_][a-zA-Z]{2,4};)?\s*([^;)]+?)(?:\s+Build\/|[;)])/

/**
 * Extract device vendor and model from a user agent string.
 * Returns 'unknown' for both when the UA does not carry recognisable device info.
 */
export function detectVendorModel(ua: string): VendorModelResult {
  // iOS / visionOS — vendor is always Apple
  if (/visionOS/.test(ua)) return { vendor: 'Apple', model: 'Apple Vision Pro' }
  if (/iPhone/.test(ua))   return { vendor: 'Apple', model: 'iPhone' }
  if (/iPad/.test(ua))     return { vendor: 'Apple', model: 'iPad' }
  if (/iPod/.test(ua))     return { vendor: 'Apple', model: 'iPod touch' }

  // Android — extract model string then infer vendor
  const m = ANDROID_MODEL_RE.exec(ua)
  if (m) {
    const model = m[1]!.trim()
    for (const [re, vendor] of VENDOR_MAP) {
      if (re.test(model)) return { vendor, model }
    }
    return { vendor: 'unknown', model }
  }

  return { vendor: 'unknown', model: 'unknown' }
}
