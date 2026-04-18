import { ARCH_DEFS, type ArchName } from '../constants/arch.js'

/**
 * Detect the CPU architecture from a user agent string.
 * Returns 'unknown' when the UA provides no architecture hints.
 */
export function detectArch(ua: string): ArchName {
  for (const def of ARCH_DEFS) {
    if (def.detect.test(ua)) {
      return def.name
    }
  }
  return 'unknown'
}
