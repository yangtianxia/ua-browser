import type { DeviceName } from '../types.js'
import { DEVICE_DEFS } from '../constants/devices.js'
import type { NavContext } from '../utils/navigator.js'

/**
 * Detect the device type from a user agent string.
 *
 * @param ua  - Raw user agent string
 * @param nav - Optional nav context; used to detect iPad on modern macOS
 *              (where the UA reports "Macintosh" but maxTouchPoints > 1)
 */
export function detectDevice(ua: string, nav?: Pick<NavContext, 'platform' | 'maxTouchPoints'>): DeviceName {
  // Modern iPad reports platform='MacIntel' and UA contains 'Macintosh'
  if (nav?.platform === 'MacIntel' && nav.maxTouchPoints > 1) {
    return 'Tablet'
  }

  // iPad in UA string while device would otherwise be Mobile (older iPads)
  if (/iPad/.test(ua)) {
    return 'Tablet'
  }

  for (const def of DEVICE_DEFS) {
    if (def.detect.test(ua)) {
      return def.name as DeviceName
    }
  }

  return 'PC'
}
