import { ARCH_DEFS, type ArchName } from '../constants/arch.js'
import type { EnvContext } from '../utils/env-context.js'

/**
 * Detect the CPU architecture using a 4-layer priority chain.
 *
 * Layer 1 (highest): UA Client Hints — precise, Chrome/Edge only
 * Layer 2: WebGL renderer string — resolves Apple Silicon vs Intel Mac
 * Layer 3: navigator.platform — synchronous, covers iPhone/iPad/Linux aarch64
 * Layer 4 (lowest): UA string pattern matching — existing behaviour, fallback
 */
export function detectArch(ua: string, ctx?: EnvContext): ArchName {
  // Layer 1: UA Client Hints (most reliable when available)
  if (ctx?.highEntropyData) {
    const { architecture, bitness } = ctx.highEntropyData
    if (architecture === 'arm') {
      return bitness === '64' ? 'arm64' : 'arm'
    }
    if (architecture === 'x86') {
      return bitness === '64' ? 'x86_64' : 'x86'
    }
  }

  // Layer 2: WebGL renderer — disambiguates Apple Silicon vs Intel Mac
  const renderer = ctx?.webglRenderer
  if (renderer) {
    if (/Apple\s+(M\d|A\d{1,2}[A-Z]?)\b/i.test(renderer) || /APPLE M\d/i.test(renderer)) {
      return 'arm64'
    }
    if (/\b(Intel|AMD|NVIDIA|Radeon)\b/i.test(renderer)) {
      return 'x86_64'
    }
  }

  // Layer 3: navigator.platform — synchronous, broad coverage
  const platform = ctx?.platform
  if (platform) {
    if (/iPhone|iPad|iPod/.test(platform)) return 'arm64'
    if (/arm64|aarch64/i.test(platform)) return 'arm64'
    if (/arm/i.test(platform)) return 'arm'
    if (/Win64|WOW64|x86_64/i.test(platform)) return 'x86_64'
    if (/Win32|i686/i.test(platform)) return 'x86'
  }

  // Layer 4: UA string pattern matching (original behaviour)
  for (const def of ARCH_DEFS) {
    if (def.detect.test(ua)) {
      return def.name
    }
  }

  return 'unknown'
}
