import type { DeviceName } from '../types.js'
import { DEVICE_DEFS } from '../constants/devices.js'
import type { NavContext } from '../utils/navigator.js'

type DeviceNav = Pick<NavContext, 'platform' | 'maxTouchPoints'> & {
  pointerType?: 'coarse' | 'fine' | 'none'
  hoverCapability?: boolean
  screenWidth?: number
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

  // Desktop-mode override: UA looks like PC, but environment signals reveal a touch-only device.
  // pointerType=coarse (touch primary) + hoverCapability=false (no hover at all) is a strong
  // indicator of a phone/tablet impersonating desktop — touch laptops still have hoverCapability=true.
  if (nav?.pointerType === 'coarse' && nav.hoverCapability === false) {
    // screen.width is reliable even in desktop mode (always reports physical CSS pixels).
    // ≥768px → tablet footprint; <768px → phone footprint.
    return (nav.screenWidth ?? 0) >= 768 ? 'Tablet' : 'Mobile'
  }

  return 'PC'
}
