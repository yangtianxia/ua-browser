import type { DeviceName } from '../types.js'
import { DEVICE_DEFS } from '../constants/devices.js'
import type { NavContext } from '../utils/navigator.js'

type DeviceNav = Pick<NavContext, 'platform' | 'maxTouchPoints'> & {
  pointerType?: 'coarse' | 'fine' | 'none'
  hoverCapability?: boolean
  screenWidth?: number
  webglRenderer?: string
  webglCompressedFormats?: { s3tc: boolean; pvrtc: boolean; etc2: boolean; astc: boolean }
  hasVibration?: boolean
  hasDeviceMotion?: boolean
  connection?: { effectiveType?: string }
}

/**
 * Detect the device type from a user agent string.
 *
 * @param ua  - Raw user agent string
 * @param nav - Optional nav context; used for iPad detection and desktop-mode override
 */
export function detectDevice(ua: string, nav?: DeviceNav): DeviceName {
  // Smart TV — must come first; some TV UAs also contain Android/Linux tokens
  if (/(SMART-TV|HbbTV|SmartTV|TV Safari|Android TV|GoogleTV)/.test(ua)) {
    return 'TV'
  }

  // Apple device with a Mac-style UA and touch points: either iPadOS 13+ or iPhone in desktop mode.
  // Use screenWidth to tell them apart — iPads have ≥768px, iPhones have <768px.
  if (nav?.platform === 'MacIntel' && nav.maxTouchPoints > 1) {
    return (nav.screenWidth !== undefined && nav.screenWidth < 768) ? 'Mobile' : 'Tablet'
  }

  // iPad in UA string (older iPads)
  if (/iPad/.test(ua)) {
    return 'Tablet'
  }

  // Android tablet: has Android but no Mobile marker
  if (/Android/.test(ua) && !/Mobile/.test(ua)) {
    return 'Tablet'
  }

  for (const def of DEVICE_DEFS) {
    if (def.detect.test(ua)) {
      return def.name as DeviceName
    }
  }

  // ── Hard-to-fake hardware signal overrides ────────────────────────────────
  // Only fire when UA detection above did not already identify a mobile device.

  // GPU renderer: Adreno = Qualcomm (Android), Mali = ARM (Android).
  // These are hardware-bound strings that cannot be spoofed at the JS layer.
  if (nav?.webglRenderer) {
    if (/Adreno/i.test(nav.webglRenderer) || /Mali[-\s]/i.test(nav.webglRenderer)) {
      return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
    }
  }

  // Compressed texture formats: pvrtc is PowerVR (iOS-only GPU family).
  if (nav?.webglCompressedFormats?.pvrtc && !nav.webglCompressedFormats.s3tc) {
    return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
  }

  // Mobile-exclusive browser APIs: vibration and device-motion are not
  // implemented in any desktop browser, making them reliable mobile indicators.
  if (nav?.hasVibration || nav?.hasDeviceMotion) {
    return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
  }

  // Mobile network type: 2G/3G connections are virtually absent on desktop.
  // 4G is excluded — it also appears on mobile hotspots used by laptops.
  if (nav?.connection?.effectiveType &&
      ['2g', '3g', 'slow-2g'].includes(nav.connection.effectiveType)) {
    return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
  }

  // Soft signal: touch-primary pointer with no hover capability.
  // Placed last because touch laptops (Surface etc.) also have pointerType=coarse
  // but keep hoverCapability=true via their trackpad/mouse.
  if (nav?.pointerType === 'coarse' && nav.hoverCapability === false) {
    return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
  }

  return 'PC'
}
